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
    message
  });
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
    const errorPayload = await airtableResponse.json().catch(() => ({}));
    const error = new Error("Airtable read failed");
    error.status = airtableResponse.status;
    error.errorType = classifyAirtableError(airtableResponse.status, errorPayload);
    throw error;
  }

  const data = await airtableResponse.json();
  return data.records?.[0] || null;
}

export default async function handler(request, response) {
  const debug = isDebugRequest(request);

  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return sendSafeError(response, 405, "Method Not Allowed", debug, {
      errorType: "runtime_error",
      httpStatus: 405
    });
  }

  const missingEnv = getMissingEnv();
  if (missingEnv.length > 0) {
    return sendSafeError(response, 500, "審核 API 尚未完成環境設定", debug, {
      errorType: "missing_env",
      missingEnv,
      httpStatus: 500
    });
  }

  const caseId = getSingleQueryValue(request.query?.caseId);
  const token = getSingleQueryValue(request.query?.token);

  if (!caseId || !token) {
    return sendSafeError(response, 400, "缺少 caseId 或 token", debug, {
      errorType: "runtime_error",
      httpStatus: 400
    });
  }

  try {
    const record = await findAirtableCase(caseId);
    if (!record) {
      return sendSafeError(response, 404, "找不到此案例", debug, {
        errorType: "airtable_not_found",
        httpStatus: 404
      });
    }

    const fields = record.fields || {};
    const reviewToken = fields[process.env.AIRTABLE_REVIEW_TOKEN_FIELD];
    if (!reviewToken || token !== reviewToken) {
      return sendSafeError(response, 401, "連結無效或已過期", debug, {
        errorType: "invalid_token",
        httpStatus: 401
      });
    }

    return sendJson(response, 200, {
      case: pickCaseFields(fields)
    });
  } catch (error) {
    console.error("review api read failed", {
      errorType: error.errorType || "runtime_error",
      httpStatus: error.status || 502
    });
    return sendSafeError(response, 502, "目前無法讀取審核資料，請稍後再試", debug, {
      errorType: error.errorType || "runtime_error",
      httpStatus: error.status || 502
    });
  }
}
