const REQUIRED_ENV = [
  "AIRTABLE_PAT",
  "AIRTABLE_BASE_ID",
  "AIRTABLE_CASE_DRAFTS_TABLE_ID",
  "AIRTABLE_CASE_ID_FIELD",
  "AIRTABLE_REVIEW_TOKEN_FIELD"
];

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

function escapeFormulaString(value) {
  return String(value).replaceAll("'", "\\'");
}

function getMissingEnv() {
  return REQUIRED_ENV.filter((key) => !process.env[key]);
}

function pickCaseFields(fields) {
  return Object.fromEntries(
    Object.entries(FIELD_MAP).map(([key, fieldName]) => [key, fields[fieldName] || ""])
  );
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

  if (!airtableResponse.ok) {
    throw new Error(`Airtable read failed: ${airtableResponse.status}`);
  }

  const data = await airtableResponse.json();
  return data.records?.[0] || null;
}

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return sendJson(response, 405, { message: "Method Not Allowed" });
  }

  const missingEnv = getMissingEnv();
  if (missingEnv.length > 0) {
    return sendJson(response, 500, { message: "審核 API 尚未完成環境設定" });
  }

  const caseId = getSingleQueryValue(request.query?.caseId);
  const token = getSingleQueryValue(request.query?.token);

  if (!caseId || !token) {
    return sendJson(response, 400, { message: "缺少 caseId 或 token" });
  }

  try {
    const record = await findAirtableCase(caseId);
    if (!record) {
      return sendJson(response, 404, { message: "找不到此案例" });
    }

    const fields = record.fields || {};
    const reviewToken = fields[process.env.AIRTABLE_REVIEW_TOKEN_FIELD];
    if (!reviewToken || token !== reviewToken) {
      return sendJson(response, 401, { message: "連結無效或已過期" });
    }

    return sendJson(response, 200, {
      case: pickCaseFields(fields)
    });
  } catch (error) {
    console.error("review api read failed", error);
    return sendJson(response, 502, { message: "目前無法讀取審核資料，請稍後再試" });
  }
}
