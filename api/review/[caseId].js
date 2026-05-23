const READ_ENV = [
  "AIRTABLE_PAT",
  "AIRTABLE_BASE_ID",
  "AIRTABLE_CASE_DRAFTS_TABLE_ID",
  "AIRTABLE_CASE_ID_FIELD",
  "AIRTABLE_REVIEW_TOKEN_FIELD"
];

const WRITE_ENV = [
  "AIRTABLE_REVIEW_STATUS_FIELD",
  "AIRTABLE_REVIEW_NOTES_FIELD",
  "AIRTABLE_REVISED_SOLUTION_FIELD",
  "AIRTABLE_REVIEWED_AT_FIELD",
  "AIRTABLE_REVIEW_SOURCE_FIELD",
  "AIRTABLE_TOKEN_STATUS_FIELD"
];

const ALLOWED_WRITE_CASE_ID = "TEST_REVIEW_001";
const TOKEN_USED_VALUE = "已使用";
const REVIEW_SOURCE_VALUE = "自架網站";
const ALLOWED_REVIEW_STATUSES = ["審核中", "已通過", "需修改", "不適合公開"];

const FIELD_MAP = {
  caseId: "Case ID",
  title: "Case Title",
  summary: "One-line Summary",
  background: "Case Background",
  surfaceProblem: "Surface Problem",
  coreProblem: "Core Problem",
  humanJudgmentLogic: "Human Judgment Logic",
  expertSolution: "Expert Solution",
  aiDraft: "AI Draft",
  learningGoal: "Learning Goal"
};

function sendJson(response, statusCode, payload) {
  response.status(statusCode);
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  return response.json(payload);
}

function getSingleQueryValue(value) {
  return Array.isArray(value) ? value[0] : value;
}

function isDebugRequest(request) {
  return getSingleQueryValue(request.query?.debug) === "1";
}

function sendSafeError(response, statusCode, message, debug, details = {}) {
  if (!debug) {
    return sendJson(response, statusCode, { message });
  }

  return sendJson(response, statusCode, {
    ok: false,
    errorType: details.errorType || "runtime_error",
    missingEnv: details.missingEnv || [],
    httpStatus: details.httpStatus || statusCode,
    postReceived: details.postReceived,
    patchAttempted: details.patchAttempted,
    patchSucceeded: details.patchSucceeded,
    foundCaseId: details.foundCaseId,
    targetRecordId: details.targetRecordId,
    patchedRecordId: details.patchedRecordId,
    patchedFieldNames: details.patchedFieldNames,
    airtableStatus: details.airtableStatus,
    message
  });
}

function escapeFormulaString(value) {
  return String(value).replaceAll("'", "\\'");
}

function getMissingEnv(envNames) {
  return envNames.filter((key) => !process.env[key]);
}

function pickCaseFields(fields) {
  return Object.fromEntries(
    Object.entries(FIELD_MAP).map(([key, fieldName]) => [key, fields[fieldName] || ""])
  );
}

function getRequestBody(request) {
  if (!request.body) {
    return {};
  }
  if (typeof request.body === "string") {
    return JSON.parse(request.body);
  }
  return request.body;
}

function cleanText(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function classifyAirtableError(status, errorPayload) {
  const errorType = String(errorPayload?.error?.type || "").toUpperCase();
  const errorMessage = String(errorPayload?.error?.message || "").toLowerCase();

  if (status === 401 || status === 403) {
    return "airtable_auth_error";
  }

  if (status === 404) {
    return "airtable_not_found";
  }

  if (
    errorType.includes("UNKNOWN_FIELD") ||
    errorType.includes("INVALID_FIELD") ||
    errorMessage.includes("unknown field") ||
    errorMessage.includes("field")
  ) {
    return "airtable_field_error";
  }

  if (
    errorType.includes("FORMULA") ||
    errorMessage.includes("formula") ||
    errorMessage.includes("filterbyformula")
  ) {
    return "airtable_filter_error";
  }

  return "runtime_error";
}

async function handleAirtableResponse(airtableResponse, fallbackMessage) {
  if (airtableResponse.ok) {
    return airtableResponse.json();
  }

  const errorPayload = await airtableResponse.json().catch(() => ({}));
  const error = new Error(fallbackMessage);
  error.status = airtableResponse.status;
  error.errorType = classifyAirtableError(airtableResponse.status, errorPayload);
  throw error;
}

async function findAirtableCase(caseId) {
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableId = process.env.AIRTABLE_CASE_DRAFTS_TABLE_ID;
  const caseIdField = process.env.AIRTABLE_CASE_ID_FIELD;
  const formula = `{${caseIdField}}='${escapeFormulaString(caseId)}'`;
  const url = new URL(`https://api.airtable.com/v0/${baseId}/${tableId}`);
  url.searchParams.set("maxRecords", "1");
  url.searchParams.set("filterByFormula", formula);

  const airtableResponse = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.AIRTABLE_PAT}`,
      "Content-Type": "application/json"
    }
  });

  const data = await handleAirtableResponse(airtableResponse, "Airtable read failed");
  return data.records?.[0] || null;
}

async function updateAirtableReview(recordId, fields) {
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableId = process.env.AIRTABLE_CASE_DRAFTS_TABLE_ID;
  const url = new URL(`https://api.airtable.com/v0/${baseId}/${tableId}/${recordId}`);

  const airtableResponse = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${process.env.AIRTABLE_PAT}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ fields })
  });

  const data = await handleAirtableResponse(airtableResponse, "Airtable write failed");
  return {
    airtableStatus: airtableResponse.status,
    patchedRecordId: data.id || ""
  };
}

function buildReviewUpdateFields(body) {
  const reviewStatus = cleanText(body.reviewStatus, 30);
  if (!ALLOWED_REVIEW_STATUSES.includes(reviewStatus)) {
    const error = new Error("審核狀態不在允許範圍");
    error.status = 400;
    error.errorType = "invalid_review_status";
    throw error;
  }

  return {
    [process.env.AIRTABLE_REVIEW_STATUS_FIELD]: reviewStatus,
    [process.env.AIRTABLE_REVIEW_NOTES_FIELD]: cleanText(body.expertReviewNotes, 5000),
    [process.env.AIRTABLE_REVISED_SOLUTION_FIELD]: cleanText(body.expertRevisedSolution, 10000),
    [process.env.AIRTABLE_REVIEWED_AT_FIELD]: new Date().toISOString(),
    [process.env.AIRTABLE_REVIEW_SOURCE_FIELD]: REVIEW_SOURCE_VALUE,
    [process.env.AIRTABLE_TOKEN_STATUS_FIELD]: TOKEN_USED_VALUE
  };
}

async function validateReviewAccess(caseId, token, debug, response, safeDebugDetails = {}) {
  const record = await findAirtableCase(caseId);
  if (!record) {
    sendSafeError(response, 404, "找不到此案例", debug, {
      errorType: "airtable_not_found",
      httpStatus: 404,
      ...safeDebugDetails
    });
    return null;
  }

  const fields = record.fields || {};
  const reviewToken = fields[process.env.AIRTABLE_REVIEW_TOKEN_FIELD];
  if (!reviewToken || token !== reviewToken) {
    sendSafeError(response, 401, "連結無效或已過期", debug, {
        errorType: "invalid_token",
        httpStatus: 401,
        ...safeDebugDetails
    });
    return null;
  }

  return record;
}

async function handleGet(request, response, debug, caseId, token) {
  const record = await validateReviewAccess(caseId, token, debug, response);
  if (!record) {
    return;
  }

  return sendJson(response, 200, {
    case: pickCaseFields(record.fields || {})
  });
}

async function handlePost(request, response, debug, caseId, token) {
  if (caseId !== ALLOWED_WRITE_CASE_ID) {
    return sendSafeError(response, 403, "目前僅允許測試案例寫回", debug, {
      errorType: "write_case_not_allowed",
      httpStatus: 403,
      postReceived: true,
      patchAttempted: false,
      patchSucceeded: false
    });
  }

  const missingEnv = getMissingEnv(WRITE_ENV);
  if (missingEnv.length > 0) {
    return sendSafeError(response, 500, "審核 API 尚未完成寫回環境設定", debug, {
      errorType: "missing_env",
      missingEnv,
      httpStatus: 500,
      postReceived: true,
      patchAttempted: false,
      patchSucceeded: false
    });
  }

  const body = getRequestBody(request);
  const record = await validateReviewAccess(caseId, token || body.token, debug, response, {
    postReceived: true,
    patchAttempted: false,
    patchSucceeded: false
  });
  if (!record) {
    return;
  }

  const fields = record.fields || {};
  if (fields[process.env.AIRTABLE_TOKEN_STATUS_FIELD] === TOKEN_USED_VALUE) {
    return sendSafeError(response, 409, "此審核連結已使用", debug, {
      errorType: "token_already_used",
      httpStatus: 409,
      postReceived: true,
      patchAttempted: false,
      patchSucceeded: false
    });
  }

  const updateFields = buildReviewUpdateFields(body);
  const patchedFieldNames = Object.keys(updateFields);
  let patchResult;
  try {
    patchResult = await updateAirtableReview(record.id, updateFields);
  } catch (error) {
    console.error("review api write failed", {
      errorType: error.errorType || "runtime_error",
      httpStatus: error.status || 502
    });
    return sendSafeError(response, 502, "目前無法寫回審核資料，請稍後再試", debug, {
      errorType: error.errorType || "runtime_error",
      httpStatus: error.status || 502,
      postReceived: true,
      patchAttempted: true,
      patchSucceeded: false,
      foundCaseId: caseId,
      targetRecordId: record.id,
      patchedFieldNames,
      airtableStatus: error.status || 502
    });
  }

  if (patchResult.patchedRecordId !== record.id) {
    return sendSafeError(response, 502, "Airtable 寫回目標不一致", debug, {
      errorType: "airtable_record_mismatch",
      httpStatus: 502,
      postReceived: true,
      patchAttempted: true,
      patchSucceeded: false,
      foundCaseId: caseId,
      targetRecordId: record.id,
      patchedRecordId: patchResult.patchedRecordId,
      patchedFieldNames,
      airtableStatus: patchResult.airtableStatus
    });
  }

  return sendJson(response, 200, {
    ok: true,
    patchSucceeded: true,
    foundCaseId: caseId,
    targetRecordId: record.id,
    patchedRecordId: patchResult.patchedRecordId,
    patchedFieldNames,
    airtableStatus: patchResult.airtableStatus,
    message: "審核結果已送出，系統會自動進入下一步。"
  });
}

export default async function handler(request, response) {
  const debug = isDebugRequest(request);

  if (!["GET", "POST"].includes(request.method)) {
    response.setHeader("Allow", "GET, POST");
    return sendSafeError(response, 405, "Method Not Allowed", debug, {
      errorType: "runtime_error",
      httpStatus: 405
    });
  }

  const missingEnv = getMissingEnv(READ_ENV);
  if (missingEnv.length > 0) {
    return sendSafeError(response, 500, "審核 API 尚未完成環境設定", debug, {
      errorType: "missing_env",
      missingEnv,
      httpStatus: 500
    });
  }

  const caseId = getSingleQueryValue(request.query?.caseId);
  const queryToken = getSingleQueryValue(request.query?.token);

  if (!caseId) {
    return sendSafeError(response, 400, "缺少 caseId", debug, {
      errorType: "runtime_error",
      httpStatus: 400
    });
  }

  try {
    if (request.method === "GET") {
      if (!queryToken) {
        return sendSafeError(response, 400, "缺少 token", debug, {
          errorType: "runtime_error",
          httpStatus: 400
        });
      }
      return await handleGet(request, response, debug, caseId, queryToken);
    }

    const body = getRequestBody(request);
    const token = queryToken || body.token;
    if (!token) {
      return sendSafeError(response, 400, "缺少 token", debug, {
        errorType: "runtime_error",
        httpStatus: 400
      });
    }
    return await handlePost({ ...request, body }, response, debug, caseId, token);
  } catch (error) {
    if (error.status === 400) {
      return sendSafeError(response, 400, error.message, debug, {
        errorType: error.errorType || "runtime_error",
        httpStatus: 400,
        postReceived: request.method === "POST" ? true : undefined,
        patchAttempted: request.method === "POST" ? false : undefined,
        patchSucceeded: request.method === "POST" ? false : undefined
      });
    }

    console.error("review api failed", {
      method: request.method,
      errorType: error.errorType || "runtime_error",
      httpStatus: error.status || 502
    });
    return sendSafeError(response, 502, "目前無法處理審核資料，請稍後再試", debug, {
      errorType: error.errorType || "runtime_error",
      httpStatus: error.status || 502
    });
  }
}
