import { cases, reviewItems } from "./data/cases.js";

const app = document.querySelector("#app");

const navItems = [
  { href: "/", label: "首頁" },
  { href: "/cases", label: "案例列表" },
  { href: "/submit-experience", label: "經驗投稿" },
  { href: "/admin-review", label: "管理審核 demo" }
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

function renderShell(content, activePath) {
  const navigation = navItems
    .map((item) => {
      const isActive =
        item.href === activePath ||
        (item.href === "/cases" && activePath.startsWith("/cases/"));

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
          <span class="brand-mark" aria-hidden="true">判</span>
          <span>
            <strong>把前人經驗，變成你的判斷力</strong>
            <small>AI 真人經驗情境互動學習系統</small>
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
        <span>v0.1 本機前端 demo</span>
        <span>只使用專案內 mock data，不連接正式資料庫或外部 API。</span>
      </div>
    </footer>
  `;
}

function renderHome() {
  return `
    <section class="workspace-hero">
      <div class="hero-main">
        <p class="eyebrow">AI 真人經驗情境互動學習系統</p>
        <h1>把前人經驗，變成你的判斷力</h1>
        <p class="hero-subtitle">用真實工作情境，練習判斷、取捨與解決問題的能力。</p>
        <div class="hero-actions" aria-label="主要行動">
          <a class="button primary" href="/cases" data-link>開始練習案例</a>
          <a class="button secondary" href="/submit-experience" data-link>分享我的經驗</a>
        </div>
      </div>
      <aside class="hero-status" aria-label="系統狀態">
        <span class="panel-kicker">v0.1 sandbox</span>
        <strong>目前是本機練習沙盒</strong>
        <p>頁面結構已可展示，資料只來自專案內 mock data。這一版不接 Airtable、n8n、Dify 或任何外部服務。</p>
        <div class="hero-metrics" aria-label="目前 demo 狀態">
          <div>
            <b>2</b>
            <span>mock 案例</span>
          </div>
          <div>
            <b>5</b>
            <span>本機頁面</span>
          </div>
        </div>
      </aside>
    </section>

    <section class="value-grid" aria-label="產品價值說明">
      <article class="value-card tone-blue">
        <span class="value-mark" aria-hidden="true">情</span>
        <h2>真實情境</h2>
        <p>從工作現場會遇到的問題出發，先理解脈絡、限制與現場壓力。</p>
      </article>
      <article class="value-card tone-cream">
        <span class="value-mark" aria-hidden="true">解</span>
        <h2>前人解法</h2>
        <p>對照有經驗者如何觀察、拆解與補救，把隱性的判斷過程說清楚。</p>
      </article>
      <article class="value-card tone-green">
        <span class="value-mark" aria-hidden="true">轉</span>
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
        <a class="button primary" href="/cases" data-link>開始練習案例</a>
      </article>
      <article class="entry-card">
        <span class="entry-number">02</span>
        <h2>我要分享我的經驗</h2>
        <p>分享你遇過的真實工作情境，讓系統協助整理成可學習的案例。</p>
        <a class="button secondary" href="/submit-experience" data-link>分享我的經驗</a>
      </article>
    </section>
  `;
}

function renderCaseCard(caseItem) {
  const mark = caseItem.caseId === "CASE005" ? "流" : "補";

  return `
    <article class="case-card">
      <div class="case-card-top">
        <span class="case-mark" aria-hidden="true">${mark}</span>
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

function getStatusTone(value) {
  if (["已收到", "已整理", "通過", "是"].includes(value)) {
    return "success";
  }

  if (["待整理", "待審核"].includes(value)) {
    return "pending";
  }

  if (["否", "尚未建立"].includes(value)) {
    return "muted";
  }

  return "neutral";
}

function renderStatusBadge(value) {
  return `<span class="status-badge ${getStatusTone(value)}">${escapeHtml(value)}</span>`;
}

function renderCases() {
  const caseCards = cases.map(renderCaseCard).join("");

  return `
    <section class="section-heading">
      <div>
        <p class="eyebrow">案例列表</p>
        <h1>目前可練習的案例</h1>
        <p>第一版使用專案內 mock data，先驗證案例閱讀、路由與後續 Agent 協作流程。</p>
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

function renderCaseDetail(caseId) {
  const caseItem = cases.find((item) => item.caseId === caseId);

  if (!caseItem) {
    return `
      <section class="empty-state">
        <p class="eyebrow">找不到案例</p>
        <h1>目前沒有 ${escapeHtml(caseId)} 的 mock data</h1>
        <p>v0.1 只放入 CASE005 與 CASE006，後續可以再擴充更多案例。</p>
        <a class="button primary" href="/cases" data-link>返回案例列表</a>
      </section>
    `;
  }

  return `
    <section class="detail-hero">
      <div>
        <span class="case-id">${escapeHtml(caseItem.caseId)}</span>
        <h1>${escapeHtml(caseItem.title)}</h1>
        <p class="case-type">${escapeHtml(caseItem.type)}</p>
      </div>
      <button class="button primary" type="button" data-action="practice-placeholder" aria-expanded="false">
        開始練習
      </button>
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

    <section class="practice-note" id="practice-note" hidden>
      <strong>v0.1 暫不串接正式 Dify，後續版本再接入互動練習 App。</strong>
      <p>這個提示只在本機前端顯示，不會呼叫任何外部服務。</p>
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
        <p>請先用自然語言描述情境、限制、判斷與結果。v0.1 只在前端顯示測試成功訊息，不會送出到任何外部系統。</p>
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
        已收到你的測試投稿。v0.1 目前不寫入正式資料庫，後續版本會再串接審核流程。
      </div>
    </section>
  `;
}

function renderAdminReview() {
  const rows = reviewItems
    .map(
      (item) => `
        <tr>
          <td>
            <strong>${escapeHtml(item.id)}</strong>
            <span>${escapeHtml(item.title)}</span>
          </td>
          <td>${escapeHtml(item.relatedCaseId)}</td>
          <td>${renderStatusBadge(item.submissionStatus)}</td>
          <td>${renderStatusBadge(item.aiStatus)}</td>
          <td>${renderStatusBadge(item.draftStatus)}</td>
          <td>${renderStatusBadge(item.publishable)}</td>
          <td>${renderStatusBadge(item.humanReviewStatus)}</td>
        </tr>
      `
    )
    .join("");

  return `
    <section class="section-heading">
      <div>
        <p class="eyebrow">管理審核 demo</p>
        <h1>模擬人工審核流程</h1>
        <p>此頁為 v0.1 demo，不連接正式資料。</p>
      </div>
      <div class="heading-badge">mock review</div>
    </section>

    <section class="admin-panel">
      <div class="demo-alert">
        此頁為 v0.1 demo，不連接正式資料。所有狀態都來自專案內 mock data，不會建立、修改或刪除任何正式資料。
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>投稿</th>
              <th>Case Draft</th>
              <th>投稿狀態</th>
              <th>AI 整理狀態</th>
              <th>Case Draft 狀態</th>
              <th>是否可發布</th>
              <th>人工審核狀態</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
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
  if (link) {
    const targetUrl = new URL(link.href);
    if (targetUrl.origin === window.location.origin) {
      event.preventDefault();
      window.history.pushState({}, "", targetUrl.pathname);
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    return;
  }

  const action = event.target.closest("[data-action='practice-placeholder']");
  if (action) {
    const note = document.querySelector("#practice-note");
    if (note) {
      note.hidden = false;
      action.setAttribute("aria-expanded", "true");
      note.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
});

document.addEventListener("submit", (event) => {
  if (event.target.id !== "experience-form") {
    return;
  }

  event.preventDefault();
  const message = document.querySelector("#submit-message");
  if (message) {
    message.hidden = false;
    message.scrollIntoView({ behavior: "smooth", block: "center" });
  }
});

window.addEventListener("popstate", render);

render();
