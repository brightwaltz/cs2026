// =============================================================================
// ローカルHCI評価エンジン
// -----------------------------------------------------------------------------
// 警告UIの設計から「防御力」と「利便性(UX)」を 0〜100 で見積もる単純なモデル。
// これは"唯一の正解"ではなく、議論のための一つの仮説（配点モデル）にすぎない。
// =============================================================================

/** 警告本文が「長すぎる」と判定する文字数のしきい値 */
export const LONG_TEXT_THRESHOLD = 100

/** スコア計算に必要な入力 */
export interface ScoreInput {
  /** 警告テキスト本文の文字数 */
  warningTextLength: number
  /** 目立つ（無視）ボタンの色 */
  buttonColor: 'red' | 'green' | 'gray'
  /** 「無視」ボタンをチェックボックス同意必須にしているか */
  checkboxRequired: boolean
  /** 強制待機タイマー（5秒間ボタンを押せなくする）が有効か */
  forceWaitTimer: boolean
  /** 二段階確認ダイアログ（もう一度確認する）が有効か */
  confirmStep: boolean
  /** 操作理由の入力を必須にしているか */
  requireReason: boolean
  /** 危険を視覚的に強調（赤バナー・警告アイコン）しているか */
  dangerEmphasis: boolean
  /** 安全な選択肢を既定フォーカス/Enterに割り当てているか */
  safeDefaultFocus: boolean
}

/** 値を 0〜100 の範囲に収める */
function clamp(score: number): number {
  return Math.max(0, Math.min(100, score))
}

/**
 * 防御力スコア — ユーザーが危険な操作を思いとどまる強さ。
 *
 *   ベース ............................ 50
 *   テキストが長すぎる(100文字以上) ... -20  （読まれず素通りされるため）
 *   ボタンが赤 ........................ +15  （危険が直感的に伝わる）
 *   ボタンが緑 ........................ -20  （安全だと誤認させてしまう）
 *   チェックボックス必須 .............. +20  （意図的な同意を要求できる）
 *   強制待機タイマーあり .............. +25  （衝動的なクリックを抑止する）
 *   二段階確認ダイアログ .............. +15  （もう一度立ち止まらせる）
 *   操作理由の入力を必須化 ............ +20  （言語化させ、惰性を断ち切る）
 *   危険の視覚的強調 .................. +10  （危険性を見落としにくくする）
 *   安全な選択肢を既定に .............. +10  （初期状態で安全側に誘導する）
 */
export function calculateDefenseScore(input: ScoreInput): number {
  let score = 50

  if (input.warningTextLength >= LONG_TEXT_THRESHOLD) score -= 20

  if (input.buttonColor === 'red') score += 15
  else if (input.buttonColor === 'green') score -= 20

  if (input.checkboxRequired) score += 20
  if (input.forceWaitTimer) score += 25

  // --- 追加の防御機能 ---
  if (input.confirmStep) score += 15
  if (input.requireReason) score += 20
  if (input.dangerEmphasis) score += 10
  if (input.safeDefaultFocus) score += 10

  return clamp(score)
}

/**
 * 利便性(UX)スコア — ユーザーが目的を素早く達成できる快適さ。
 *
 *   ベース ............................ 100
 *   強制待機タイマーあり .............. -40  （操作を著しく妨げる）
 *   チェックボックス必須 .............. -20  （手間が増える）
 *   テキストが長すぎる(100文字以上) ... -15  （読む負荷が高い）
 *   二段階確認ダイアログ .............. -15  （クリック手数が増える）
 *   操作理由の入力を必須化 ............ -25  （文章入力の負荷は大きい）
 *   危険の視覚的強調 .................. -5   （威圧的で不快になりうる）
 *   安全な選択肢を既定に .............. ±0   （ほぼ無償の防御策。UXは下げない）
 */
export function calculateUxScore(input: ScoreInput): number {
  let score = 100

  if (input.forceWaitTimer) score -= 40
  if (input.checkboxRequired) score -= 20
  if (input.warningTextLength >= LONG_TEXT_THRESHOLD) score -= 15

  // --- 追加の防御機能による摩擦 ---
  if (input.confirmStep) score -= 15
  if (input.requireReason) score -= 25
  if (input.dangerEmphasis) score -= 5
  // safeDefaultFocus は利便性を犠牲にしない（あえて減点しない）

  return clamp(score)
}
