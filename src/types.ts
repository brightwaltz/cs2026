// ---------------------------------------------------------------------------
// ドメイン型の定義
// このアプリが扱う「設計上の選択肢」を型として明示する。
// ---------------------------------------------------------------------------

/** シナリオの種類 */
export type ScenarioId = 'wifi' | 'app-permission' | 'password-reuse'

/** 目立つ（無視）ボタンの色 */
export type ButtonColor = 'red' | 'green' | 'gray'

/** 「警告を無視する」ボタンの配置パターン */
export type IgnorePlacement =
  | 'small-bottom-right' // 右下に小さく配置
  | 'large-center' //       中央に大きく配置
  | 'checkbox-required' //   チェックボックスに同意しないと押せない

/** ON/OFF で切り替える追加の防御機能のキー */
export type FeatureKey =
  | 'forceWaitTimer'
  | 'confirmStep'
  | 'requireReason'
  | 'dangerEmphasis'
  | 'safeDefaultFocus'

/** 画面上で学生が設計する状態のすべて */
export interface DesignState {
  scenario: ScenarioId
  warningText: string
  buttonColor: ButtonColor
  ignorePlacement: IgnorePlacement
  /** 強制待機タイマー（5秒間ボタンを押せなくする） */
  forceWaitTimer: boolean
  /** 二段階確認ダイアログ */
  confirmStep: boolean
  /** 操作理由の入力を必須化 */
  requireReason: boolean
  /** 危険の視覚的強調（赤バナー・警告アイコン） */
  dangerEmphasis: boolean
  /** 安全な選択肢を既定フォーカス/Enterに */
  safeDefaultFocus: boolean
  reflection: string
}

/** 切り替え可能なタブ */
export type TabId = 'design' | 'algorithm'
