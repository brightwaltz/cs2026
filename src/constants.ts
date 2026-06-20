import type {
  ButtonColor,
  DesignState,
  IgnorePlacement,
  ScenarioId,
} from './types'

// ---------------------------------------------------------------------------
// シナリオ定義
// 各シナリオは「擬似警告UI」のプレビュー文言にも利用される。
// ---------------------------------------------------------------------------
export interface ScenarioMeta {
  id: ScenarioId
  /** Select に表示するラベル / レポート出力にも使う */
  label: string
  /** プレビューの見出し */
  heading: string
  /** プレビューの補足説明 */
  description: string
  /** 「推奨文を挿入」で挿入される警告本文の例 */
  defaultText: string
  /** 安全側（推奨）アクションのラベル */
  safeActionLabel: string
  /** 警告を無視する（危険側）アクションのラベル */
  ignoreActionLabel: string
}

export const SCENARIOS: readonly ScenarioMeta[] = [
  {
    id: 'wifi',
    label: '不審なWi-Fi接続警告',
    heading: '不審なWi-Fiネットワーク',
    description: 'このネットワークは暗号化されていない可能性があります。',
    defaultText:
      'このWi-Fiは保護されていません。接続すると、通信内容が第三者に盗み見られる危険があります。本当に接続しますか？',
    safeActionLabel: '接続しない',
    ignoreActionLabel: 'このまま接続する',
  },
  {
    id: 'app-permission',
    label: '未知のアプリの実行許可',
    heading: '発行元が確認できないアプリ',
    description: 'このアプリの開発元は検証されていません。',
    defaultText:
      'このアプリの発行元を確認できませんでした。実行を許可すると、デバイスやデータに損害が及ぶ可能性があります。',
    safeActionLabel: '許可しない',
    ignoreActionLabel: '実行を許可する',
  },
  {
    id: 'password-reuse',
    label: 'パスワード再利用の警告',
    heading: 'パスワードの再利用を検出',
    description: '他のサービスと同じパスワードが使われています。',
    defaultText:
      'このパスワードは他のサービスでも使われています。1つが漏えいすると全てのアカウントが危険にさらされます。',
    safeActionLabel: '新しいパスワードを設定',
    ignoreActionLabel: 'このパスワードを使い続ける',
  },
] as const

// ---------------------------------------------------------------------------
// ボタンの色定義
// ---------------------------------------------------------------------------
export interface ButtonColorMeta {
  id: ButtonColor
  /** Select 用ラベル */
  label: string
  /** レポート出力用の短いラベル */
  reportLabel: string
  /** 色見本（インラインスタイル用） */
  swatch: string
  /** プレビューボタンに適用する Tailwind クラス（静的文字列） */
  previewClass: string
}

export const BUTTON_COLORS: readonly ButtonColorMeta[] = [
  {
    id: 'red',
    label: '赤（危険）',
    reportLabel: '赤',
    swatch: '#dc2626',
    previewClass: 'bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600',
  },
  {
    id: 'green',
    label: '緑（安全と誤認）',
    reportLabel: '緑',
    swatch: '#059669',
    previewClass:
      'bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:outline-emerald-600',
  },
  {
    id: 'gray',
    label: 'グレー（目立たない）',
    reportLabel: 'グレー',
    swatch: '#cbd5e1',
    previewClass:
      'bg-slate-200 text-slate-600 hover:bg-slate-300 focus-visible:outline-slate-400',
  },
] as const

// ---------------------------------------------------------------------------
// 「無視」ボタンの配置定義
// ---------------------------------------------------------------------------
export interface PlacementMeta {
  id: IgnorePlacement
  /** Select 用ラベル */
  label: string
  /** レポート出力用の短いラベル */
  reportLabel: string
}

export const PLACEMENTS: readonly PlacementMeta[] = [
  { id: 'small-bottom-right', label: '右下に小さく配置', reportLabel: '右下に小さく' },
  { id: 'large-center', label: '中央に大きく配置', reportLabel: '中央に大きく' },
  {
    id: 'checkbox-required',
    label: 'チェックボックスに同意しないと押せない',
    reportLabel: 'チェックボックス必須',
  },
] as const

// ---------------------------------------------------------------------------
// ルックアップ用ヘルパー
// ---------------------------------------------------------------------------
export const getScenario = (id: ScenarioId): ScenarioMeta =>
  SCENARIOS.find((s) => s.id === id) ?? SCENARIOS[0]

export const getButtonColor = (id: ButtonColor): ButtonColorMeta =>
  BUTTON_COLORS.find((c) => c.id === id) ?? BUTTON_COLORS[0]

export const getPlacement = (id: IgnorePlacement): PlacementMeta =>
  PLACEMENTS.find((p) => p.id === id) ?? PLACEMENTS[0]

// ---------------------------------------------------------------------------
// 初期状態
// ---------------------------------------------------------------------------
export const DEFAULT_DESIGN: DesignState = {
  scenario: 'wifi',
  warningText: SCENARIOS[0].defaultText,
  buttonColor: 'red',
  ignorePlacement: 'small-bottom-right',
  forceWaitTimer: false,
  reflection: '',
}
