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

/** 画面上で学生が設計する状態のすべて */
export interface DesignState {
  scenario: ScenarioId
  warningText: string
  buttonColor: ButtonColor
  ignorePlacement: IgnorePlacement
  forceWaitTimer: boolean
  reflection: string
}

/** 切り替え可能なタブ */
export type TabId = 'design' | 'algorithm'
