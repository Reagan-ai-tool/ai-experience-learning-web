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
    learningFocus: [
      "在現場問題中先辨認真正的流程卡點，而不是只看表面速度慢。",
      "練習把一個工作流程拆成可分工、可測試、可調整的步驟。",
      "理解小範圍測試如何協助判斷改善是否真的有效。"
    ],
    judgmentSkills: ["流程拆解", "分工設計", "現場觀察", "小範圍測試"],
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
    learningFocus: [
      "練習在錯誤發生後先穩住現場，判斷損失範圍與可用選項。",
      "理解補救決策需要同時考量安全、品質、時間與成本。",
      "學習如何把一次現場錯誤轉化為流程修正。"
    ],
    judgmentSkills: ["錯誤分級", "損失控制", "現場補救", "流程修正"],
    status: "published"
  }
];

export const reviewItems = [
  {
    id: "SUBMIT-001",
    title: "清洗流程分工改善經驗",
    relatedCaseId: "CASE005",
    submissionStatus: "已收到",
    aiStatus: "已整理",
    draftStatus: "待審核",
    publishable: "是",
    humanReviewStatus: "待審核"
  },
  {
    id: "SUBMIT-002",
    title: "白米秤重錯誤補救經驗",
    relatedCaseId: "CASE006",
    submissionStatus: "已收到",
    aiStatus: "已整理",
    draftStatus: "待審核",
    publishable: "否",
    humanReviewStatus: "待審核"
  },
  {
    id: "SUBMIT-003",
    title: "備料順序調整經驗",
    relatedCaseId: "尚未建立",
    submissionStatus: "已收到",
    aiStatus: "待整理",
    draftStatus: "尚未建立",
    publishable: "否",
    humanReviewStatus: "待審核"
  },
  {
    id: "SUBMIT-004",
    title: "交接資訊不完整的現場處理",
    relatedCaseId: "DRAFT-004",
    submissionStatus: "已收到",
    aiStatus: "已整理",
    draftStatus: "待審核",
    publishable: "是",
    humanReviewStatus: "通過"
  }
];
