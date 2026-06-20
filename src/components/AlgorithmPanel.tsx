import scoringSource from '../lib/scoring.ts?raw'
import { CodeBlock } from './CodeBlock'

/**
 * アルゴリズム解析タブ。
 * スコア計算の「本物のソースコード」を ?raw インポートでそのまま表示するため、
 * 画面に出ているコードと実際に動いているコードは常に一致する。
 */
export function AlgorithmPanel() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-slate-900">評価アルゴリズムのソースコード</h2>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">
          下のコードは、左側で動いている<strong>スコア計算関数そのもの</strong>です（
          <code className="rounded bg-slate-100 px-1 py-0.5 text-[0.8em] text-slate-700">
            src/lib/scoring.ts
          </code>
          を <code className="rounded bg-slate-100 px-1 py-0.5 text-[0.8em] text-slate-700">?raw</code>{' '}
          で読み込んで表示しています）。配点や条件式を実際に確認できます。
        </p>
      </div>

      {/* 批判的思考をうながすメッセージ */}
      <div className="rounded-xl border border-amber-300 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <span className="text-xl leading-none" aria-hidden>
            🧭
          </span>
          <p className="text-sm leading-relaxed text-amber-900">
            この計算式は<strong>絶対の正解ではなく、一つのモデル</strong>です。
            この配点は現実の人間の認知バイアスを正しく反映しているでしょうか？
            <strong>批判的にソースコードを読んで</strong>、配点の根拠・しきい値（100文字）・
            加点/減点のバランスが妥当かどうかを考えてみてください。
          </p>
        </div>
      </div>

      <CodeBlock code={scoringSource} language="tsx" />

      {/* 考えるための問い */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-bold text-slate-800">批判的に読むための問い</h3>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-600">
          <li>「赤=+15」「緑=-20」という配点差は、本当に妥当な比率でしょうか？</li>
          <li>
            「100文字以上で減点」というしきい値は適切ですか？ 文字数だけで「読まれやすさ」を
            測ってよいのでしょうか。
          </li>
          <li>
            強制待機タイマーは防御力 +25 / 利便性 -40 です。この非対称な重み付けに根拠はありますか？
          </li>
          <li>防御力と利便性を独立に足し算するモデルは、両者の相互作用を見落としていませんか？</li>
        </ul>
      </div>
    </div>
  )
}
