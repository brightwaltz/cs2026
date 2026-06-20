import { useState } from 'react'
import { buildReport } from '../lib/report'
import type { DesignState } from '../types'
import { ScoreBar } from './ScoreBar'
import { WarningPreview } from './WarningPreview'

interface PreviewScorePanelProps {
  design: DesignState
  defenseScore: number
  uxScore: number
}

/** クリップボード API が使えない環境向けのフォールバック */
function legacyCopy(text: string): boolean {
  try {
    const el = document.createElement('textarea')
    el.value = text
    el.setAttribute('readonly', '')
    el.style.position = 'fixed'
    el.style.opacity = '0'
    document.body.appendChild(el)
    el.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(el)
    return ok
  } catch {
    return false
  }
}

export function PreviewScorePanel({ design, defenseScore, uxScore }: PreviewScorePanelProps) {
  const [copied, setCopied] = useState(false)
  const report = buildReport(design, defenseScore, uxScore)

  async function handleCopy() {
    let ok = false
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(report)
        ok = true
      } else {
        ok = legacyCopy(report)
      }
    } catch {
      ok = legacyCopy(report)
    }
    if (ok) {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
      {/* スコア */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold tracking-wide text-slate-500 uppercase">
          リアルタイム評価
        </h2>
        <div className="space-y-4">
          <ScoreBar
            label="防御力スコア"
            value={defenseScore}
            tone="defense"
            hint="危険な操作を思いとどまらせる強さ"
          />
          <ScoreBar
            label="利便性スコア"
            value={uxScore}
            tone="ux"
            hint="ユーザーが目的を素早く達成できる快適さ"
          />
        </div>
      </section>

      {/* プレビュー */}
      <section>
        <h2 className="mb-3 text-sm font-bold tracking-wide text-slate-500 uppercase">
          擬似警告UIプレビュー
        </h2>
        <WarningPreview design={design} />
      </section>

      {/* レポート出力 */}
      <section>
        <button
          type="button"
          onClick={handleCopy}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 active:scale-[0.99]"
        >
          {copied ? '✓ コピーしました' : '📋 レポートをコピー'}
        </button>
        <details className="mt-3 rounded-lg border border-slate-200 bg-slate-50">
          <summary className="cursor-pointer px-3 py-2 text-xs font-medium text-slate-600 select-none">
            コピーされる内容を確認
          </summary>
          <pre className="overflow-x-auto whitespace-pre-wrap break-words border-t border-slate-200 px-3 py-2 text-xs leading-relaxed text-slate-700">
            {report}
          </pre>
        </details>
      </section>
    </div>
  )
}
