# 把前人經驗，變成你的判斷力

AI 真人經驗情境互動學習系統 v0.1，本專案是全新的自架網站開發沙盒，用來練習後續 Agent 協作開發流程，並作為未來產品化與敏捷迭代的本機 demo。

## 專案目的

這個版本只建立可在本機啟動的前端雛形，先驗證資訊架構、頁面路由、案例資料結構與投稿/審核流程的展示方式。

v0.1 不修改既有 Softr MVP，也不串接 Airtable、n8n、Dify、Supabase、Firebase 或任何外部 API。所有資料都放在專案內 mock data 檔案中。

## 技術選擇

原本優先考慮 Next.js + TypeScript + Tailwind CSS，但目前工作環境沒有可用的 `npm`，也不適合為了 demo 下載外部依賴。因此 v0.1 採用最穩定的零依賴架構：

- HTML
- CSS
- ES Modules JavaScript
- Node.js 內建 `http` server
- 專案內 mock data

## 如何安裝

此版本不需要安裝套件。請確認本機或 Codex workspace 有可用的 Node.js。

## 如何啟動

在專案根目錄執行：

```powershell
.\start.ps1
```

或直接執行：

```powershell
node server.mjs
```

啟動後開啟：

```text
http://localhost:3000
```

如果需要換 port：

```powershell
$env:PORT=3001
.\start.ps1
```

## 目前頁面

- `/`：首頁，提供「我要練習判斷力」與「我要分享我的經驗」兩個入口。
- `/cases`：案例列表頁，顯示 CASE005 與 CASE006。
- `/cases/CASE005`：CASE005 詳情頁。
- `/cases/CASE006`：CASE006 詳情頁。
- `/submit-experience`：經驗投稿表單 demo，送出後只顯示本機測試成功訊息。
- `/admin-review`：管理審核頁 demo，顯示 mock 審核狀態。

## Mock Data

v0.1 所有案例與審核資料都集中在：

```text
src/data/cases.js
```

目前包含：

- CASE005：現場清洗流程太慢，如何透過分工改善效率？
- CASE006：白米秤錯了，如何先降低損失再修流程？
- 管理審核頁 demo 使用的投稿狀態資料

## v0.1 限制

此版本明確不做以下事情：

- 不修改 Softr
- 不修改 Airtable
- 不修改 n8n
- 不修改 Dify
- 不串接正式資料庫
- 不串接任何外部 API
- 不要求 API key
- 不建立會員登入
- 不加入刪除功能
- 投稿表單不寫入任何外部系統

## 下一步迭代方向

1. 若環境允許，再升級為 Next.js + TypeScript + Tailwind CSS。
2. 擴充 mock data schema，加入更完整的案例草稿、審核紀錄與互動練習欄位。
3. 將投稿表單拆成更細的步驟式輸入流程。
4. 為開始練習建立更完整的 placeholder 練習流程。
5. 在正式接入外部系統前，先定義審核流程與資料邊界。
