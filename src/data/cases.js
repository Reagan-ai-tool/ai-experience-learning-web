export const mockFeedback =
  "本關評估：中高｜達到本題建議標準\n\n你已經抓到這題的重點：先理解現場問題，再思考可行的處理順序。\n\nv0.2 目前為 mock feedback，尚未串接正式 AI 評分。";

export const cases = [
  {
    caseId: "CASE005",
    title: "現場清洗流程太慢，如何透過分工改善效率？",
    frontendTitle: "現場清洗流程太慢，如何透過分工改善效率？",
    type: "流程改善 / 分工效率",
    types: ["流程改善", "分工效率"],
    summary:
      "這是一個來自餐飲現場的流程改善案例。原本某個清洗流程主要由一個人完成，導致速度較慢，也影響後續作業銜接。案例中的前人不是直接增加人力，而是先觀察流程卡點，將流程拆成不同步驟，安排多人分工，並透過小範圍測試確認是否真的提升效率。",
    background:
      "某個餐飲現場的清洗流程長期由同一位人員負責完成。因為流程中包含分類、沖洗、整理與交接等多個步驟，一旦前段速度變慢，後續作業就容易等待。前人沒有直接判定是人手不足，而是先觀察整個流程，找出真正造成等待與堆積的卡點，再把流程拆成幾個可以並行處理的段落。",
    surfaceProblem: "清洗流程速度太慢，影響後續備料與交接。",
    coreProblem:
      "真正問題不是單一人員不夠努力，而是流程步驟沒有被拆開，等待與交接卡點沒有被看見。",
    humanJudgmentLogic:
      "先觀察現場作業順序，找出最容易等待或重複動作的段落，再用小範圍分工測試確認改善是否有效。",
    expertSolution:
      "把清洗流程拆成分類、沖洗、整理、交接等段落，安排不同人員並行處理，並觀察是否縮短等待時間。",
    aiDraft:
      "這個案例可訓練學習者辨認流程卡點，避免一開始只用增加人力或要求加快速度處理問題。",
    learningGoal:
      "學會先拆解流程、辨認卡點，再設計可測試的分工改善方案。",
    learningFocus: [
      "在現場問題中先辨認真正的流程卡點，而不是只看表面速度慢。",
      "練習把一個工作流程拆成可分工、可測試、可調整的步驟。",
      "理解小範圍測試如何協助判斷改善是否真的有效。"
    ],
    judgmentSkills: ["流程拆解", "分工設計", "現場觀察", "小範圍測試"],
    practice: {
      question1:
        "如果你發現現場某個清洗流程太慢，已經影響後續作業，你會先怎麼判斷問題卡在哪裡？",
      focusPoints: [
        "不要一開始就只想增加人力",
        "先觀察流程卡點",
        "拆解步驟",
        "找出等待、移動、重複動作或分工不清的地方"
      ],
      mockFeedback
    },
    status: "published"
  },
  {
    caseId: "CASE006",
    title: "白米秤錯了，如何先降低損失再修流程？",
    frontendTitle: "白米秤錯了，如何先降低損失再修流程？",
    type: "錯誤補救 / 現場判斷 / 損失控制 / 流程改善",
    types: ["錯誤補救", "現場判斷", "損失控制", "流程改善"],
    summary:
      "這是一個來自餐飲現場的錯誤補救案例。現場原本需要準備固定重量的白米，但因為秤重或確認流程出錯，導致白米重量不正確。案例中的前人不是先追究責任或直接報廢，而是先確認錯誤程度，判斷這批白米是否還能安全使用，再思考能否轉用、重新分配，並回頭修正流程。",
    background:
      "餐飲現場需要依照固定重量準備白米，但某次因秤重或確認流程出錯，導致白米重量不符合原本需求。面對這種情況，前人沒有立刻追究責任，也沒有直接把整批材料報廢，而是先確認錯誤程度、食品安全與現場需求，再判斷是否能透過轉用、重新分配或調整當日作業降低損失，最後再回頭修正秤重與確認流程。",
    surfaceProblem: "白米秤重錯誤，現場原本作業需求被打亂。",
    coreProblem:
      "核心不是單次秤錯本身，而是錯誤發生後需要快速判斷可用性、損失範圍與補救順序。",
    humanJudgmentLogic:
      "先確認錯誤重量、食品安全與當日需求，再判斷是否能轉用、重新分配或調整排程，最後才回頭修流程。",
    expertSolution:
      "不先追究責任或報廢，先把可用選項盤點出來，將損失降到最低，再補上秤重與覆核機制。",
    aiDraft:
      "這個案例可訓練學習者在錯誤發生時先穩住現場，依安全、品質、時間、成本排序補救決策。",
    learningGoal:
      "學會錯誤補救時的優先順序：確認事實、控制損失、保留可用選項，最後修正流程。",
    learningFocus: [
      "練習在錯誤發生後先穩住現場，判斷損失範圍與可用選項。",
      "理解補救決策需要同時考量安全、品質、時間與成本。",
      "學習如何把一次現場錯誤轉化為流程修正。"
    ],
    judgmentSkills: ["錯誤分級", "損失控制", "現場補救", "流程修正"],
    practice: {
      question1:
        "如果你發現白米秤錯，第一時間你會先確認哪些事情，來降低損失？",
      focusPoints: [
        "不要先追究責任",
        "先確認錯誤程度",
        "判斷是否仍可安全使用",
        "思考能否轉用或重新分配",
        "後續再回頭修流程"
      ],
      mockFeedback
    },
    status: "published"
  }
];

export const reviewItems = [
  {
    id: "SUBMIT-001",
    title: "清洗流程分工改善經驗",
    relatedCaseId: "CASE005",
    workflow: [
      { label: "投稿已收到", status: "done" },
      { label: "AI 整理中", status: "active" },
      { label: "Case Draft 待審核", status: "pending" },
      { label: "Prompt 待生成", status: "pending" },
      { label: "前台待發布", status: "pending" },
      { label: "已發布", status: "muted" }
    ]
  },
  {
    id: "SUBMIT-002",
    title: "白米秤重錯誤補救經驗",
    relatedCaseId: "CASE006",
    workflow: [
      { label: "投稿已收到", status: "done" },
      { label: "AI 整理中", status: "done" },
      { label: "Case Draft 待審核", status: "active" },
      { label: "Prompt 待生成", status: "pending" },
      { label: "前台待發布", status: "pending" },
      { label: "已發布", status: "muted" }
    ]
  },
  {
    id: "SUBMIT-003",
    title: "備料順序調整經驗",
    relatedCaseId: "尚未建立",
    workflow: [
      { label: "投稿已收到", status: "done" },
      { label: "AI 整理中", status: "active" },
      { label: "Case Draft 待審核", status: "pending" },
      { label: "Prompt 待生成", status: "pending" },
      { label: "前台待發布", status: "pending" },
      { label: "已發布", status: "muted" }
    ]
  },
  {
    id: "SUBMIT-004",
    title: "交接資訊不完整的現場處理",
    relatedCaseId: "DRAFT-004",
    workflow: [
      { label: "投稿已收到", status: "done" },
      { label: "AI 整理中", status: "done" },
      { label: "Case Draft 待審核", status: "done" },
      { label: "Prompt 待生成", status: "done" },
      { label: "前台待發布", status: "done" },
      { label: "已發布", status: "done" }
    ]
  }
];
