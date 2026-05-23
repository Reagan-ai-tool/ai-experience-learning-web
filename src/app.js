import { cases, reviewItems } from "./data/cases.js";

const app = document.querySelector("#app");

const navItems = [
  { href: "/", label: "首頁" },
  { href: "/cases", label: "案例列表" },
  { href: "/submit-experience", label: "經驗投稿" },
  { href: "/admin-review", label: "管理審核 demo" },
  { href: "/review/CASE006?token=test-token", label: "老手審核 Demo" }
];

function normalizePath(pathname) {
  const cleaned = pathname.replace(/\/+$/, "");
  return cleaned || "/";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatFeedback(value) {
  return escapeHtml(value).replaceAll("\n", "<br />");
}

function getCaseById(caseId) {
  return cases.find((item) => item.caseId === caseId);
}

function renderIcon(name) {
  const icons = {
    clipboard: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 5h6" />
        <path d="M9 3h6a2 2 0 0 1 2 2v1H7V5a2 2 0 0 1 2-2Z" />
        <path d="M7 6H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-1" />
        <path d="M8 12h8" />
        <path d="M8 16h5" />
      </svg>
    `,
    brain: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 4.5a3 3 0 0 0-3 3v.2A3.4 3.4 0 0 0 4 11a3.4 3.4 0 0 0 2 3.1v.4a3 3 0 0 0 3 3" />
        <path d="M15 4.5a3 3 0 0 1 3 3v.2A3.4 3.4 0 0 1 20 11a3.4 3.4 0 0 1-2 3.1v.4a3 3 0 0 1-3 3" />
        <path d="M9 4.5v15" />
        <path d="M15 4.5v15" />
        <path d="M9 9h3" />
        <path d="M12 15h3" />
      </svg>
    `,
    refresh: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 7v5h-5" />
        <path d="M4 17v-5h5" />
        <path d="M6.2 9A7 7 0 0 1 18.8 7" />
        <path d="M17.8 15A7 7 0 0 1 5.2 17" />
      </svg>
    `,
    workflow: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 6h.01" />
        <path d="M18 18h.01" />
        <path d="M6 18h.01" />
        <path d="M8 6h4a4 4 0 0 1 4 4v6" />
        <path d="M8 18h8" />
        <circle cx="6" cy="6" r="2.5" />
        <circle cx="18" cy="18" r="2.5" />
        <circle cx="6" cy="18" r="2.5" />
      </svg>
    `,
    shield: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3 19 6v5c0 4.5-2.8 8.2-7 10-4.2-1.8-7-5.5-7-10V6l7-3Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    `
  };

  return icons[name] || icons.clipboard;
}

function renderShell(content, activePath) {
  const navigation = navItems
    .map((item) => {
      const isActive =
        item.href === activePath ||
        (item.href.startsWith("/review/") && activePath.startsWith("/review/")) ||
        (item.href === "/cases" &&
          (activePath.startsWith("/cases/") || activePath.startsWith("/practice/")));

      return `
        <a class="nav-link${isActive ? " is-active" : ""}" href="${item.href}" data-link ${
        isActive ? 'aria-current="page"' : ""
      }>
          ${item.label}
        </a>
      `;
    })
    .join("");

  app.innerHTML = `
    <header class="site-header">
      <div class="site-header-inner">
        <a class="brand" href="/" data-link>
          <span class="brand-mark" aria-hidden="true">🧠</span>
          <span>
            <strong>老手不在，判斷還在</strong>
            <small>AI 經驗轉訓練系統</small>
          </span>
        </a>
        <nav class="site-nav" aria-label="主要導覽">
          ${navigation}
        </nav>
      </div>
    </header>
    <main>
      ${content}
    </main>
    <footer class="site-footer">
      <div class="site-footer-inner">
        <span>v0.3-A 本機前端 demo</span>
        <span>只使用專案內 mock data，不連接正式資料庫或外部 API。</span>
      </div>
    </footer>
  `;
}

function renderHome() {
  return `
    <section class="workspace-hero">
      <div class="hero-main">
        <p class="eyebrow">AI 經驗轉訓練系統</p>
        <h1>老手不在，判斷還在</h1>
        <p class="hero-subtitle">讓每一次真實經驗，都變成可內化的工作判斷力</p>
        <div class="hero-actions" aria-label="主要行動">
          <a class="button primary" href="/cases" data-link>我要練習判斷力</a>
          <a class="button secondary" href="/submit-experience" data-link>我要分享我的經驗</a>
        </div>
      </div>
      <aside class="hero-status" aria-label="系統狀態">
        <span class="panel-kicker">v0.2 sandbox</span>
        <strong>產品開發狀態</strong>
        <p>CASE005 / CASE006 可進入情境判斷練習頁。目前為 mock feedback，尚未串接正式 AI。</p>
        <div class="hero-metrics" aria-label="目前 demo 狀態">
          <div>
            <b>2</b>
            <span>mock 案例</span>
          </div>
          <div>
            <b>2</b>
            <span>練習入口</span>
          </div>
        </div>
      </aside>
    </section>

    <section class="value-grid" aria-label="產品價值說明">
      <article class="value-card tone-blue">
        <span class="value-mark" aria-hidden="true">${renderIcon("clipboard")}</span>
        <h2>真實情境</h2>
        <p>從工作現場會遇到的問題出發，先理解脈絡、限制與現場壓力。</p>
      </article>
      <article class="value-card tone-cream">
        <span class="value-mark" aria-hidden="true">${renderIcon("brain")}</span>
        <h2>判斷練習</h2>
        <p>先寫下自己的判斷順序，再對照本題建議重點與 mock feedback。</p>
      </article>
      <article class="value-card tone-green">
        <span class="value-mark" aria-hidden="true">${renderIcon("refresh")}</span>
        <h2>判斷力轉用</h2>
        <p>把單一案例裡的取捨邏輯，轉成下一次面對情境時可使用的能力。</p>
      </article>
    </section>

    <section class="section-heading compact">
      <div>
        <p class="eyebrow">開始使用</p>
        <h2>選擇你現在要做的事</h2>
      </div>
    </section>

    <section class="entry-grid" aria-label="首頁入口">
      <article class="entry-card">
        <span class="entry-number">01</span>
        <h2>我要練習判斷力</h2>
        <p>從真實工作案例開始，練習如何分析問題、做出取捨，並對照前人的實際解法。</p>
        <a class="button primary" href="/cases" data-link>我要練習判斷力</a>
      </article>
      <article class="entry-card">
        <span class="entry-number">02</span>
        <h2>我要分享我的經驗</h2>
        <p>分享你遇過的真實工作情境，讓系統協助整理成可學習的案例。</p>
        <a class="button secondary" href="/submit-experience" data-link>我要分享我的經驗</a>
      </article>
    </section>
  `;
}

function renderCaseCard(caseItem) {
  const icon = caseItem.caseId === "CASE005" ? "workflow" : "shield";

  return `
    <article class="case-card">
      <div class="case-card-top">
        <span class="case-mark" aria-hidden="true">${renderIcon(icon)}</span>
        <span class="status-pill">mock data</span>
      </div>
      <div class="case-card-body">
        <span class="case-id">${escapeHtml(caseItem.caseId)}</span>
        <h2>${escapeHtml(caseItem.frontendTitle)}</h2>
        <div class="case-tags" aria-label="情境類型">
          ${caseItem.types.map((type) => `<span>${escapeHtml(type)}</span>`).join("")}
        </div>
        <p>${escapeHtml(caseItem.summary)}</p>
      </div>
      <a class="button primary" href="/cases/${caseItem.caseId}" data-link>查看案例</a>
    </article>
  `;
}

function renderCases() {
  const caseCards = cases.map(renderCaseCard).join("");

  return `
    <section class="section-heading">
      <div>
        <p class="eyebrow">案例列表</p>
        <h1>目前可練習的案例</h1>
        <p>第一版案例資料延續 mock data，v0.2 新增情境判斷練習入口。</p>
      </div>
      <div class="heading-badge">2 個 mock 案例</div>
    </section>
    <section class="case-grid" aria-label="案例列表">
      ${caseCards}
    </section>
  `;
}

function renderTagList(items) {
  return `
    <div class="tag-list">
      ${items.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
    </div>
  `;
}

function renderBulletList(items) {
  return `
    <ul class="detail-list">
      ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
    </ul>
  `;
}

function renderReviewField(label, value) {
  return `
    <article class="review-content-card">
      <h2>${escapeHtml(label)}</h2>
      <p>${escapeHtml(value || "尚無資料")}</p>
    </article>
  `;
}

function renderReviewAccessError(message) {
  return `
    <section class="empty-state review-error" role="alert">
      <p class="eyebrow">老手審核入口</p>
      <h1>${escapeHtml(message)}</h1>
      <p>請確認 Email 連結中的 caseId 與 token 是否正確，或請管理者重新寄送審核連結。</p>
    </section>
  `;
}

function renderReviewLoading() {
  return `
    <section class="empty-state review-error" role="status">
      <p class="eyebrow">老手審核入口</p>
      <h1>正在讀取審核資料</h1>
      <p>系統正在透過後端 API 驗證連結並讀取 Airtable 測試資料。</p>
    </section>
  `;
}

function renderReviewApiError(message) {
  return `
    <section class="empty-state review-error" role="alert">
      <p class="eyebrow">老手審核入口</p>
      <h1>${escapeHtml(message || "目前無法讀取審核資料")}</h1>
      <p>請稍後再試，或請管理者確認 Airtable 測試資料與 Vercel 環境變數設定。</p>
    </section>
  `;
}

async function fetchReviewCase(caseId) {
  const token = new URLSearchParams(window.location.search).get("token") || "";
  const response = await fetch(
    `/api/review/${encodeURIComponent(caseId)}?token=${encodeURIComponent(token)}`,
    { headers: { Accept: "application/json" } }
  );
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || "目前無法讀取審核資料");
    error.status = response.status;
    throw error;
  }

  return data.case;
}

async function submitReviewResult(caseId, payload) {
  const response = await fetch(`/api/review/${encodeURIComponent(caseId)}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || "目前無法送出審核結果");
    error.status = response.status;
    throw error;
  }

  return data;
}

function renderReviewPage(caseItem) {
  const fields = [
    ["Case ID", caseItem.caseId],
    ["Case Title", caseItem.title],
    ["One-line Summary", caseItem.summary],
    ["Case Background", caseItem.background],
    ["Surface Problem", caseItem.surfaceProblem],
    ["Core Problem", caseItem.coreProblem],
    ["Human Judgment Logic", caseItem.humanJudgmentLogic],
    ["Expert Solution", caseItem.expertSolution],
    ["AI Draft", caseItem.aiDraft],
    ["Learning Goal", caseItem.learningGoal]
  ];

  return `
    <section class="review-hero">
      <div>
        <p class="eyebrow">老手審核入口 Demo</p>
        <span class="case-id">${escapeHtml(caseItem.caseId)}</span>
        <h1>${escapeHtml(caseItem.title)}</h1>
        <p>這是前端 Demo，尚未寫回 Airtable。</p>
        <p>目前是 v0.3-B2 Demo；此頁透過後端 API 安全讀取 Airtable，送出時只寫回審核白名單欄位。</p>
      </div>
      <span class="heading-badge">v0.3-B2 API review write</span>
    </section>

    <section class="review-layout" aria-label="案例審核內容">
      <div class="review-content-grid">
        ${fields.map(([label, value]) => renderReviewField(label, value)).join("")}
      </div>

      <aside class="review-form-panel" aria-label="老手審核區">
        <span class="panel-kicker">老手審核區</span>
        <h2>送出審核結果</h2>
        <p>v0.3-B2 只允許 TEST_REVIEW_001 測試寫回。</p>
        <p>送出後只寫回老手審核狀態、備註、修正版解法、最後審核時間、審核來源與 Token 使用狀態。</p>
        <form id="expert-review-form" class="review-form" data-case-id="${escapeHtml(caseItem.caseId)}">
          <label>
            <span>審核狀態</span>
            <select name="reviewStatus">
              <option value="審核中">審核中</option>
              <option value="已通過">已通過</option>
              <option value="需修改">需修改</option>
              <option value="不適合公開">不適合公開</option>
            </select>
          </label>
          <label>
            <span>老手審核備註</span>
            <textarea name="expertReviewNotes" rows="6" placeholder="請補充需要調整、保留或提醒的地方。"></textarea>
          </label>
          <label>
            <span>老手修正版解法</span>
            <textarea name="expertRevisedSolution" rows="8" placeholder="可貼上或改寫更貼近現場的解法。">${escapeHtml(caseItem.expertSolution)}</textarea>
          </label>
          <button class="button primary" type="submit">送出審核結果</button>
        </form>
        <div class="success-message" id="review-submit-message" role="status" hidden>
          審核結果已送出，系統會自動進入下一步。
        </div>
        <div class="success-message error-message" id="review-submit-error" role="alert" hidden></div>
      </aside>
    </section>
  `;
}

function renderCaseDetail(caseId) {
  const caseItem = getCaseById(caseId);

  if (!caseItem) {
    return renderCaseNotFound(caseId);
  }

  return `
    <section class="detail-hero">
      <div>
        <span class="case-id">${escapeHtml(caseItem.caseId)}</span>
        <h1>${escapeHtml(caseItem.title)}</h1>
        <p class="case-type">${escapeHtml(caseItem.type)}</p>
      </div>
      <a class="button primary" href="/practice/${caseItem.caseId}" data-link>
        開始練習
      </a>
    </section>

    <section class="detail-layout">
      <article class="detail-panel wide">
        <h2>案例背景</h2>
        <p>${escapeHtml(caseItem.background)}</p>
      </article>
      <article class="detail-panel">
        <h2>練習重點</h2>
        ${renderBulletList(caseItem.learningFocus)}
      </article>
      <article class="detail-panel">
        <h2>適合訓練的判斷能力</h2>
        ${renderTagList(caseItem.judgmentSkills)}
      </article>
    </section>
  `;
}

function renderPractice(caseId) {
  const caseItem = getCaseById(caseId);

  if (!caseItem) {
    return renderCaseNotFound(caseId);
  }

  return `
    <section class="practice-hero">
      <div>
        <p class="eyebrow">情境判斷練習</p>
        <span class="case-id">${escapeHtml(caseItem.caseId)}</span>
        <h1>${escapeHtml(caseItem.title)}</h1>
        <p>v0.2 mock feedback，尚未串接正式 AI 評分。</p>
      </div>
      <a class="button secondary" href="/cases/${caseItem.caseId}" data-link>回案例詳情</a>
    </section>

    <section class="practice-layout">
      <article class="practice-panel">
        <h2>案例背景</h2>
        <p>${escapeHtml(caseItem.background)}</p>
        <div class="practice-focus">
          <h3>本關練習重點</h3>
          ${renderBulletList(caseItem.practice.focusPoints)}
        </div>
      </article>

      <article class="practice-panel exercise-card">
        <span class="heading-badge">第 1 關</span>
        <h2>${escapeHtml(caseItem.practice.question1)}</h2>
        <form id="practice-form" class="practice-form">
          <label>
            <span>你的回答</span>
            <textarea
              name="practiceAnswer"
              rows="7"
              placeholder="請寫下你會先確認哪些線索、如何判斷順序，以及下一步會怎麼做。"
            ></textarea>
          </label>
          <button class="button primary" type="submit">送出回答</button>
        </form>
        <div class="feedback-card" id="practice-feedback" role="status" hidden>
          <span class="panel-kicker">mock AI 回饋</span>
          <p>${formatFeedback(caseItem.practice.mockFeedback)}</p>
        </div>
        <div class="next-placeholder">
          <span class="status-badge pending">下一關 placeholder</span>
          <p>後續版本可加入第二關追問、比較前人解法與行動反思。v0.2 目前不串接正式 AI。</p>
        </div>
      </article>
    </section>
  `;
}

function renderSubmitExperience() {
  return `
    <section class="section-heading">
      <div>
        <p class="eyebrow">經驗投稿</p>
        <h1>分享你遇過的真實工作情境</h1>
        <p>第一版只提供表單 UI 與本機成功訊息，不寫入 Airtable、資料庫或任何外部系統。</p>
      </div>
      <div class="heading-badge">mock submission</div>
    </section>

    <section class="form-panel">
      <div class="form-intro">
        <span class="panel-kicker">表單 demo</span>
        <h2>把現場經驗整理成可學習的案例素材</h2>
        <p>請先用自然語言描述情境、限制、判斷與結果。v0.2 只在前端顯示測試成功訊息，不會送出到任何外部系統。</p>
      </div>
      <form id="experience-form" class="experience-form">
        <label>
          <span>分享者名稱</span>
          <input name="name" type="text" autocomplete="name" placeholder="可留空或填暱稱" />
        </label>
        <label>
          <span>經驗標題</span>
          <input name="title" type="text" placeholder="例如：現場流程卡住時如何分工" />
        </label>
        <label>
          <span>情境類型</span>
          <input name="type" type="text" placeholder="例如：流程改善 / 錯誤補救 / 現場判斷" />
        </label>
        <label>
          <span>當時遇到什麼問題？</span>
          <textarea name="problem" rows="4"></textarea>
        </label>
        <label>
          <span>當時有哪些限制？</span>
          <textarea name="constraints" rows="4"></textarea>
        </label>
        <label>
          <span>你當下怎麼判斷？</span>
          <textarea name="judgment" rows="4"></textarea>
        </label>
        <label>
          <span>你實際做了什麼？</span>
          <textarea name="actions" rows="4"></textarea>
        </label>
        <label>
          <span>最後結果如何？</span>
          <textarea name="result" rows="4"></textarea>
        </label>
        <label>
          <span>你從這件事學到什麼？</span>
          <textarea name="learning" rows="4"></textarea>
        </label>
        <label class="checkbox-row">
          <input name="allowAnonymous" type="checkbox" />
          <span>是否允許匿名後公開？</span>
        </label>
        <div class="form-actions">
          <button class="button primary" type="submit">送出測試投稿</button>
        </div>
      </form>
      <div class="success-message" id="submit-message" role="status" hidden>
        已收到你的測試投稿。v0.2 目前不寫入正式資料庫，後續版本會再串接審核流程。
      </div>
    </section>
  `;
}

function renderWorkflowBadge(step) {
  return `<span class="flow-badge ${escapeHtml(step.status)}">${escapeHtml(step.label)}</span>`;
}

function renderAdminReview() {
  const rows = reviewItems
    .map(
      (item) => `
        <article class="review-flow-card">
          <div class="review-flow-header">
            <div>
              <span class="case-id">${escapeHtml(item.id)}</span>
              <h2>${escapeHtml(item.title)}</h2>
              <p>Case Draft：${escapeHtml(item.relatedCaseId)}</p>
            </div>
          </div>
          <div class="flow-badge-list" aria-label="審核流程狀態">
            ${item.workflow.map(renderWorkflowBadge).join("")}
          </div>
        </article>
      `
    )
    .join("");

  return `
    <section class="section-heading">
      <div>
        <p class="eyebrow">管理審核 demo</p>
        <h1>流程狀態展示</h1>
        <p>此頁為 v0.2 demo，目前不連接正式 Airtable / n8n / Dify。</p>
      </div>
      <div class="heading-badge">mock review flow</div>
    </section>

    <section class="admin-panel">
      <div class="demo-alert">
        此頁為 v0.2 demo，目前不連接正式 Airtable / n8n / Dify。所有狀態都來自專案內 mock data，不會建立、修改或刪除任何正式資料。
      </div>
      <div class="review-flow-grid">
        ${rows}
      </div>
    </section>
  `;
}

function renderCaseNotFound(caseId) {
  return `
    <section class="empty-state">
      <p class="eyebrow">找不到案例</p>
      <h1>目前沒有 ${escapeHtml(caseId)} 的 mock data</h1>
      <p>v0.2 只放入 CASE005 與 CASE006，後續可以再擴充更多案例與練習題。</p>
      <a class="button primary" href="/cases" data-link>返回案例列表</a>
    </section>
  `;
}

function renderNotFound() {
  return `
    <section class="empty-state">
      <p class="eyebrow">404</p>
      <h1>找不到這個頁面</h1>
      <p>可以回到首頁，或查看目前已建立的 mock 案例。</p>
      <div class="hero-actions">
        <a class="button primary" href="/" data-link>回首頁</a>
        <a class="button secondary" href="/cases" data-link>看案例</a>
      </div>
    </section>
  `;
}

function renderReviewRoute(caseId, activePath) {
  renderShell(renderReviewLoading(), activePath);
  fetchReviewCase(caseId)
    .then((caseItem) => {
      renderShell(renderReviewPage(caseItem), activePath);
    })
    .catch((error) => {
      renderShell(renderReviewApiError(error.message), activePath);
    });
}

function render() {
  const activePath = normalizePath(window.location.pathname);
  let content;

  if (activePath === "/") {
    content = renderHome();
  } else if (activePath === "/cases") {
    content = renderCases();
  } else if (activePath.startsWith("/cases/")) {
    const caseId = decodeURIComponent(activePath.split("/")[2] || "");
    content = renderCaseDetail(caseId);
  } else if (activePath.startsWith("/practice/")) {
    const caseId = decodeURIComponent(activePath.split("/")[2] || "");
    content = renderPractice(caseId);
  } else if (activePath.startsWith("/review/")) {
    const caseId = decodeURIComponent(activePath.split("/")[2] || "");
    renderReviewRoute(caseId, activePath);
    return;
  } else if (activePath === "/submit-experience") {
    content = renderSubmitExperience();
  } else if (activePath === "/admin-review") {
    content = renderAdminReview();
  } else {
    content = renderNotFound();
  }

  renderShell(content, activePath);
}

document.addEventListener("click", (event) => {
  const link = event.target.closest("a[data-link]");
  if (!link) {
    return;
  }

  const targetUrl = new URL(link.href);
  if (targetUrl.origin === window.location.origin) {
    event.preventDefault();
    window.history.pushState({}, "", `${targetUrl.pathname}${targetUrl.search}`);
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

document.addEventListener("submit", async (event) => {
  if (event.target.id === "experience-form") {
    event.preventDefault();
    const message = document.querySelector("#submit-message");
    if (message) {
      message.hidden = false;
      message.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return;
  }

  if (event.target.id === "practice-form") {
    event.preventDefault();
    const feedback = document.querySelector("#practice-feedback");
    if (feedback) {
      feedback.hidden = false;
      feedback.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return;
  }

  if (event.target.id === "expert-review-form") {
    event.preventDefault();
    const formData = new FormData(event.target);
    const submitButton = event.target.querySelector('button[type="submit"]');
    const message = document.querySelector("#review-submit-message");
    const errorMessage = document.querySelector("#review-submit-error");
    const caseId = event.target.dataset.caseId;
    const reviewPayload = {
      token: new URLSearchParams(window.location.search).get("token") || "",
      reviewStatus: formData.get("reviewStatus"),
      expertReviewNotes: formData.get("expertReviewNotes"),
      expertRevisedSolution: formData.get("expertRevisedSolution")
    };

    if (message) {
      message.hidden = true;
    }
    if (errorMessage) {
      errorMessage.hidden = true;
      errorMessage.textContent = "";
    }
    if (submitButton) {
      submitButton.disabled = true;
    }

    try {
      await submitReviewResult(caseId, reviewPayload);
      if (message) {
        message.hidden = false;
        message.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } catch (error) {
      if (errorMessage) {
        errorMessage.textContent = error.message || "目前無法送出審核結果";
        errorMessage.hidden = false;
        errorMessage.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  }
});

window.addEventListener("popstate", render);

render();
