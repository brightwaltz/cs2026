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
 */
export function calculateDefenseScore(input: ScoreInput): number {
  let score = 50

  if (input.warningTextLength >= LONG_TEXT_THRESHOLD) score -= 20

  if (input.buttonColor === 'red') score += 15
  else if (input.buttonColor === 'green') score -= 20

  if (input.checkboxRequired) score += 20
  if (input.forceWaitTimer) score += 25

  return clamp(score)
}

/**
 * 利便性(UX)スコア — ユーザーが目的を素早く達成できる快適さ。
 *
 *   ベース ............................ 100
 *   強制待機タイマーあり .............. -40  （操作を著しく妨げる）
 *   チェックボックス必須 .............. -20  （手間が増える）
 *   テキストが長すぎる(100文字以上) ... -15  （読む負荷が高い）
 */
export function calculateUxScore(input: ScoreInput): number {
  let score = 100

  if (input.forceWaitTimer) score -= 40
  if (input.checkboxRequired) score -= 20
  if (input.warningTextLength >= LONG_TEXT_THRESHOLD) score -= 15

  return clamp(score)
}
