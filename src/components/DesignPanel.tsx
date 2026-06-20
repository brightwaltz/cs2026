import {
  BUTTON_COLORS,
  FEATURES,
  PLACEMENTS,
  SCENARIOS,
  getButtonColor,
  getScenario,
} from '../constants'
import { LONG_TEXT_THRESHOLD } from '../lib/scoring'
import type { ButtonColor, DesignState, IgnorePlacement, ScenarioId } from '../types'

interface DesignPanelProps {
  design: DesignState
  onChange: (patch: Partial<DesignState>) => void
}

const fieldLabel = 'block text-sm font-semibold text-slate-800'
const selectClass =
  'mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200'
const textareaClass =
  'mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm leading-relaxed text-slate-800 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200'

export function DesignPanel({ design, onChange }: DesignPanelProps) {
  const scenario = getScenario(design.scenario)
  const selectedColor = getButtonColor(design.buttonColor)
  const textLength = design.warningText.length
  const isLongText = textLength >= LONG_TEXT_THRESHOLD

  return (
    <div className="space-y-6">
      {/* シナリオ */}
      <div>
        <label htmlFor="scenario" className={fieldLabel}>
          シナリオ
        </label>
        <select
          id="scenario"
          className={selectClass}
          value={design.scenario}
          onChange={(e) => onChange({ scenario: e.target.value as ScenarioId })}
        >
          {SCENARIOS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* 警告テキスト本文 */}
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="warningText" className={fieldLabel}>
            警告テキスト本文
          </label>
          <button
            type="button"
            onClick={() => onChange({ warningText: scenario.defaultText })}
            className="rounded-md px-2 py-0.5 text-xs font-medium text-indigo-600 transition hover:bg-indigo-50"
          >
            推奨文を挿入
          </button>
        </div>
        <textarea
          id="warningText"
          rows={4}
          className={textareaClass}
          value={design.warningText}
          placeholder="ユーザーに表示する警告文を入力してください"
          onChange={(e) => onChange({ warningText: e.target.value })}
        />
        <div className="mt-1 flex items-center justify-between text-xs">
          <span className={isLongText ? 'font-semibold text-red-600' : 'text-slate-400'}>
            {textLength} 文字
            {isLongText && `（${LONG_TEXT_THRESHOLD}文字以上：読まれにくく減点対象）`}
          </span>
        </div>
      </div>

      {/* ボタンの色 */}
      <div>
        <label htmlFor="buttonColor" className={fieldLabel}>
          目立つボタンの色
        </label>
        <div className="mt-1.5 flex items-center gap-2">
          <span
            className="h-5 w-5 shrink-0 rounded-full border border-black/10"
            style={{ backgroundColor: selectedColor.swatch }}
            aria-hidden
          />
          <select
            id="buttonColor"
            className={`${selectClass} mt-0 flex-1`}
            value={design.buttonColor}
            onChange={(e) => onChange({ buttonColor: e.target.value as ButtonColor })}
          >
            {BUTTON_COLORS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          ※ 色は「警告を無視する側のボタン」に適用されます。
        </p>
      </div>

      {/* 無視ボタンの配置 */}
      <div>
        <label htmlFor="placement" className={fieldLabel}>
          「警告を無視する」ボタンの配置
        </label>
        <select
          id="placement"
          className={selectClass}
          value={design.ignorePlacement}
          onChange={(e) => onChange({ ignorePlacement: e.target.value as IgnorePlacement })}
        >
          {PLACEMENTS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* 追加の防御機能（ON/OFF トグル） */}
      <div>
        <span className={fieldLabel}>追加の防御機能（HCI対策）</span>
        <p className="mt-0.5 text-xs text-slate-500">
          有効にすると防御力は上がりますが、多くは利便性を犠牲にします（配点は「アルゴリズム解析」タブで確認できます）。
        </p>
        <div className="mt-2 space-y-2">
          {FEATURES.map((f) => (
            <label
              key={f.key}
              className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:border-slate-300"
            >
              <input
                type="checkbox"
                checked={design[f.key]}
                onChange={(e) =>
                  onChange({ [f.key]: e.target.checked } as Partial<DesignState>)
                }
                className="mt-0.5 h-4 w-4 accent-indigo-600"
              />
              <span>
                <span className="block text-sm font-semibold text-slate-800">{f.title}</span>
                <span className="mt-0.5 block text-xs text-slate-500">{f.desc}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 考察 */}
      <div>
        <label htmlFor="reflection" className={fieldLabel}>
          考察
        </label>
        <p className="mt-0.5 text-xs text-slate-500">
          UI設計のトレードオフと、内部アルゴリズム（計算式）の妥当性について記述してください。
        </p>
        <textarea
          id="reflection"
          rows={6}
          className={textareaClass}
          value={design.reflection}
          placeholder="例：防御力を高めるために強制待機タイマーを採用したが、利便性スコアは大きく低下した。この配点モデルは…"
          onChange={(e) => onChange({ reflection: e.target.value })}
        />
        <div className="mt-1 text-right text-xs text-slate-400">{design.reflection.length} 文字</div>
      </div>
    </div>
  )
}
