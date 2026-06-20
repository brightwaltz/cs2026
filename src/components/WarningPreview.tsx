import { useEffect, useState } from 'react'
import { getButtonColor, getScenario } from '../constants'
import type { DesignState } from '../types'

interface WarningPreviewProps {
  design: DesignState
}

const WAIT_SECONDS = 5

/**
 * 設計内容にもとづく「擬似的な警告UI」を四角い枠内にプレビューする。
 * - 「目立つ（無視）ボタン」の色と配置は学生の設計をそのまま反映する。
 * - 強制待機タイマー有効時は、無視ボタンを5秒間押せなくする（カウントダウン）。
 * - チェックボックス必須／理由入力必須の場合は、条件を満たすまで無視ボタンを押せない。
 * - 危険の視覚的強調・安全側の既定・二段階確認も視覚的に反映する。
 */
export function WarningPreview({ design }: WarningPreviewProps) {
  const scenario = getScenario(design.scenario)
  const color = getButtonColor(design.buttonColor)
  const isCheckboxRequired = design.ignorePlacement === 'checkbox-required'

  // プレビューを「もう一度」再生するためのキー
  const [replayKey, setReplayKey] = useState(0)
  const [remaining, setRemaining] = useState(0)
  const [agreed, setAgreed] = useState(false)
  const [reason, setReason] = useState('')

  // 強制待機タイマーのカウントダウン
  useEffect(() => {
    if (!design.forceWaitTimer) {
      setRemaining(0)
      return
    }
    setRemaining(WAIT_SECONDS)
    let r = WAIT_SECONDS
    const id = setInterval(() => {
      r -= 1
      setRemaining(r)
      if (r <= 0) clearInterval(id)
    }, 1000)
    return () => clearInterval(id)
  }, [design.forceWaitTimer, replayKey])

  // 条件が変わったらチェック状態・理由入力をリセット
  useEffect(() => {
    setAgreed(false)
    setReason('')
  }, [design.ignorePlacement, design.scenario, design.requireReason, replayKey])

  const waiting = remaining > 0
  const blockedByCheckbox = isCheckboxRequired && !agreed
  const blockedByReason = design.requireReason && reason.trim() === ''
  const ignoreDisabled = waiting || blockedByCheckbox || blockedByReason

  const ignoreLabel = waiting
    ? `${scenario.ignoreActionLabel}（あと ${remaining} 秒）`
    : scenario.ignoreActionLabel

  const ignoreButton = (extra: string) => (
    <button
      type="button"
      disabled={ignoreDisabled}
      className={`rounded-lg font-semibold shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${color.previewClass} ${extra}`}
    >
      {ignoreLabel}
    </button>
  )

  const safeButton = (extra: string) => (
    <button
      type="button"
      className={`rounded-lg border bg-white font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 ${
        design.safeDefaultFocus
          ? 'border-indigo-400 ring-2 ring-indigo-300 ring-offset-1'
          : 'border-slate-300'
      } ${extra}`}
    >
      {scenario.safeActionLabel}
      {design.safeDefaultFocus && (
        <span className="ml-1 text-[10px] font-medium text-indigo-600">（既定）</span>
      )}
    </button>
  )

  return (
    <div>
      {/* 擬似ウィンドウの枠 */}
      <div className="overflow-hidden rounded-xl border border-slate-300 bg-white shadow-md">
        {/* タイトルバー風のヘッダー */}
        <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
          <span className="ml-2 text-xs font-medium text-slate-400">セキュリティ警告</span>
        </div>

        {/* 本文 */}
        <div className="px-5 py-5">
          {/* 危険の視覚的強調バナー */}
          {design.dangerEmphasis && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-bold text-red-700">
              <span aria-hidden>🚫</span>
              危険：この操作は強く非推奨です
            </div>
          )}

          <div className="flex items-start gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl ${
                design.dangerEmphasis ? 'bg-red-100 ring-2 ring-red-300' : 'bg-amber-100'
              }`}
            >
              ⚠️
            </div>
            <div className="min-w-0">
              <h4 className="text-base font-bold text-slate-900">{scenario.heading}</h4>
              <p className="mt-0.5 text-xs text-slate-500">{scenario.description}</p>
            </div>
          </div>

          <p className="mt-4 min-h-[3rem] whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-700">
            {design.warningText.trim() || '（警告テキストが未入力です）'}
          </p>

          {/* チェックボックス必須のとき */}
          {isCheckboxRequired && (
            <label className="mt-4 flex cursor-pointer items-start gap-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-indigo-600"
              />
              <span>上記のリスクを理解した上で続行します</span>
            </label>
          )}

          {/* 操作理由の入力を必須化 */}
          {design.requireReason && (
            <div className="mt-4">
              <label
                htmlFor="preview-reason"
                className="block text-xs font-medium text-slate-600"
              >
                続行する理由を入力してください（必須）
              </label>
              <input
                id="preview-reason"
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="例：自宅の信頼できるネットワークだから"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>
          )}

          {/* アクション領域：配置パターンで切り替え */}
          <div className="mt-5">
            {design.ignorePlacement === 'large-center' ? (
              <div className="flex flex-col items-center gap-3">
                {ignoreButton('w-full px-5 py-3 text-base')}
                {safeButton('px-3 py-1.5 text-xs')}
              </div>
            ) : design.ignorePlacement === 'small-bottom-right' ? (
              <div className="flex flex-col gap-3">
                {safeButton('w-full px-5 py-3 text-base')}
                <div className="flex justify-end">
                  {ignoreButton('px-2.5 py-1 text-xs')}
                </div>
              </div>
            ) : (
              // checkbox-required: 標準的な左右並び
              <div className="flex items-center justify-end gap-3">
                {safeButton('px-4 py-2 text-sm')}
                {ignoreButton('px-4 py-2 text-sm')}
              </div>
            )}
          </div>

          {/* 二段階確認ダイアログの注記 */}
          {design.confirmStep && (
            <p className="mt-2 text-right text-xs text-slate-400">
              ※「{scenario.ignoreActionLabel}」を押すと、もう一度確認ダイアログが表示されます。
            </p>
          )}
        </div>
      </div>

      {/* プレビュー操作 */}
      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs text-slate-400">
          ※ これは学習用の擬似UIです。ボタンは実際には何も実行しません。
        </p>
        <button
          type="button"
          onClick={() => setReplayKey((k) => k + 1)}
          className="rounded-md px-2 py-1 text-xs font-medium text-indigo-600 transition hover:bg-indigo-50"
        >
          ↻ もう一度プレビュー
        </button>
      </div>
    </div>
  )
}
