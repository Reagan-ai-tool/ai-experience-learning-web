import assert from "node:assert/strict";
import handler from "../api/review/[caseId].js";

const ENV = {
  AIRTABLE_PAT: "test-pat",
  AIRTABLE_BASE_ID: "base-test",
  AIRTABLE_CASE_DRAFTS_TABLE_ID: "tbl-test",
  AIRTABLE_CASE_ID_FIELD: "Case ID",
  AIRTABLE_REVIEW_TOKEN_FIELD: "Review Token",
  AIRTABLE_REVIEW_STATUS_FIELD: "老手審核狀態",
  AIRTABLE_REVIEW_NOTES_FIELD: "老手審核備註",
  AIRTABLE_REVISED_SOLUTION_FIELD: "老手修正版解法",
  AIRTABLE_REVIEWED_AT_FIELD: "最後審核時間",
  AIRTABLE_REVIEW_SOURCE_FIELD: "審核來源",
  AIRTABLE_TOKEN_STATUS_FIELD: "Token 使用狀態"
};

Object.assign(process.env, ENV);

const allowedPatchFields = [
  "老手審核狀態",
  "老手審核備註",
  "老手修正版解法",
  "最後審核時間",
  "審核來源",
  "Token 使用狀態"
];

function createResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    setHeader(key, value) {
      this.headers[key] = value;
      return this;
    },
    json(payload) {
      this.body = payload;
      return payload;
    }
  };
}

function makeRequest({ method = "POST", caseId, token = "good-token", body = {}, debug = "1" }) {
  return {
    method,
    query: { caseId, token, debug },
    body: {
      reviewStatus: "已通過",
      expertReviewNotes: "測試備註",
      expertRevisedSolution: "測試修正版解法",
      "Case ID": "MALICIOUS_CASE_ID",
      "Case Title": "不應寫入",
      "AI Draft": "不應寫入",
      "Publish Status": "已發布",
      ...body
    }
  };
}

function makeFetchMock({ record, capture }) {
  return async (url, options = {}) => {
    capture.calls.push({ url: String(url), options });
    if (options.method === "GET") {
      return Response.json({ records: record ? [record] : [] });
    }
    if (options.method === "PATCH") {
      const parsedBody = JSON.parse(options.body || "{}");
      capture.patchFields = parsedBody.fields || {};
      return Response.json({ id: record.id, fields: capture.patchFields });
    }
    throw new Error(`Unexpected method: ${options.method}`);
  };
}

async function runHandler(request, fetchMock) {
  const previousFetch = globalThis.fetch;
  globalThis.fetch = fetchMock;
  const response = createResponse();
  try {
    await handler(request, response);
    return response;
  } finally {
    globalThis.fetch = previousFetch;
  }
}

function makeRecord(caseId, { token = "good-token", tokenUsed = false } = {}) {
  return {
    id: `rec-${caseId}`,
    fields: {
      "Case ID": caseId,
      "Review Token": token,
      "Token 使用狀態": tokenUsed ? "已使用" : ""
    }
  };
}

async function testCase005CanWriteOnlyAllowedFields() {
  const capture = { calls: [] };
  const response = await runHandler(
    makeRequest({ caseId: "CASE005" }),
    makeFetchMock({ record: makeRecord("CASE005"), capture })
  );

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.ok, true);
  assert.equal(response.body.patchSucceeded, true);
  assert.deepEqual(Object.keys(capture.patchFields).sort(), [...allowedPatchFields].sort());
  assert.equal(capture.patchFields["老手審核狀態"], "已通過");
  assert.equal(capture.patchFields["審核來源"], "自架網站");
  assert.equal(capture.patchFields["Token 使用狀態"], "已使用");
  assert.equal(capture.patchFields["Case ID"], undefined);
  assert.equal(capture.patchFields["Case Title"], undefined);
  assert.equal(capture.patchFields["AI Draft"], undefined);
  assert.equal(capture.patchFields["Publish Status"], undefined);
}

async function testTestReview001StillCanWrite() {
  const capture = { calls: [] };
  const response = await runHandler(
    makeRequest({ caseId: "TEST_REVIEW_001" }),
    makeFetchMock({ record: makeRecord("TEST_REVIEW_001"), capture })
  );

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.ok, true);
  assert.deepEqual(Object.keys(capture.patchFields).sort(), [...allowedPatchFields].sort());
}

async function testCase006CannotWrite() {
  const capture = { calls: [] };
  const response = await runHandler(
    makeRequest({ caseId: "CASE006" }),
    makeFetchMock({ record: makeRecord("CASE006"), capture })
  );

  assert.equal(response.statusCode, 403);
  assert.equal(response.body.errorType, "write_case_not_allowed");
  assert.equal(response.body.patchAttempted, false);
  assert.equal(capture.calls.length, 0);
}

async function testMissingCaseCannotWrite() {
  const capture = { calls: [] };
  const response = await runHandler(
    makeRequest({ caseId: "CASE_NOT_EXIST" }),
    makeFetchMock({ record: null, capture })
  );

  assert.equal(response.statusCode, 403);
  assert.equal(response.body.errorType, "write_case_not_allowed");
  assert.equal(response.body.patchAttempted, false);
  assert.equal(capture.calls.length, 0);
}

async function testWrongTokenCannotWrite() {
  const capture = { calls: [] };
  const response = await runHandler(
    makeRequest({ caseId: "CASE005", token: "wrong-token" }),
    makeFetchMock({ record: makeRecord("CASE005"), capture })
  );

  assert.equal(response.statusCode, 401);
  assert.equal(response.body.errorType, "invalid_token");
  assert.equal(response.body.patchAttempted, false);
  assert.equal(capture.calls.length, 1);
}

async function testUsedTokenCannotWrite() {
  const capture = { calls: [] };
  const response = await runHandler(
    makeRequest({ caseId: "CASE005" }),
    makeFetchMock({ record: makeRecord("CASE005", { tokenUsed: true }), capture })
  );

  assert.equal(response.statusCode, 409);
  assert.equal(response.body.errorType, "token_already_used");
  assert.equal(response.body.patchAttempted, false);
  assert.equal(capture.calls.length, 1);
}

const tests = [
  testCase005CanWriteOnlyAllowedFields,
  testTestReview001StillCanWrite,
  testCase006CannotWrite,
  testMissingCaseCannotWrite,
  testWrongTokenCannotWrite,
  testUsedTokenCannotWrite
];

for (const test of tests) {
  await test();
  console.log(`PASS ${test.name}`);
}

console.log(`PASS ${tests.length} review API whitelist tests`);
