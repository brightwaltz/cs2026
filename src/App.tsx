import { useMemo, useState } from 'react'
import { AlgorithmPanel } from './components/AlgorithmPanel'
import { DesignPanel } from './components/DesignPanel'
import { PreviewScorePanel } from './components/PreviewScorePanel'
import { DEFAULT_DESIGN } from './constants'
import { calculateDefenseScore, calculateUxScore } from './lib/scoring'
import { toScoreInput } from './lib/report'
import type { DesignState, TabId } from './types'

const TABS: { id: TabId; label: string }[] = [
  { id: 'design', label: '入力・設計' },
  { id: 'algorithm', label: 'アルゴリズム解析' },
]

export default function App() {
  const [design, setDesign] = useState<DesignState>(DEFAULT_DESIGN)
  const [tab, setTab] = useState<TabId>('design')

  // 状態が変わるたびにスコアを再計算する
  const scoreInput = useMemo(() => toScoreInput(design), [design])
  const defenseScore = useMemo(() => calculateDefenseScore(scoreInput), [scoreInput])
  const uxScore = useMemo(() => calculateUxScore(scoreInput), [scoreInput])

  const update = (patch: Partial<DesignState>) =>
    setDesign((prev) => ({ ...prev, ...patch }))

  return (
    <div className="min-h-full">
      {/* ヘッダー */}
      <header className="border-b border-slate-200 bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white shadow-sm">
              HCI
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                HCI Trade-off Simulator
              </h1>
              <p className="text-xs text-slate-500">
                セキュリティ警告UIの設計トレードオフと評価アルゴリズムを学ぶ
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* 本体：左（タブ）＋ 右（常時プレビュー＆スコア） */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
          {/* 左カラム */}
          <div className="min-w-0">
            {/* タブ切り替え */}
            <div
              className="mb-5 inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm"
              role="tablist"
              aria-label="表示の切り替え"
            >
              {TABS.map((t) => {
                const active = tab === t.id
                return (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setTab(t.id)}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                      active
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {t.label}
                  </button>
                )
              })}
            </div>

            {/* タブ内容 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              {tab === 'design' ? (
                <DesignPanel design={design} onChange={update} />
              ) : (
                <AlgorithmPanel />
              )}
            </div>
          </div>

          {/* 右カラム：常時表示。lg ではスクロール追従させる */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <PreviewScorePanel
              design={design}
              defenseScore={defenseScore}
              uxScore={uxScore}
            />
          </aside>
        </div>

        <footer className="mx-auto mt-10 max-w-7xl text-center text-xs text-slate-400">
          完全クライアントサイドで動作します（外部API・データベース不使用）。
        </footer>
      </main>
    </div>
  )
}
