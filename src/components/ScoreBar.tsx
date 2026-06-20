interface ScoreBarProps {
  label: string
  value: number
  /** バーの配色テーマ */
  tone: 'defense' | 'ux'
  hint?: string
}

const TONES = {
  defense: {
    bar: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
    text: 'text-indigo-700',
    track: 'bg-indigo-100',
  },
  ux: {
    bar: 'bg-gradient-to-r from-amber-400 to-amber-500',
    text: 'text-amber-700',
    track: 'bg-amber-100',
  },
} as const

/** 0〜100 を 低 / 中 / 高 の定性ラベルに変換 */
function band(value: number): string {
  if (value >= 67) return '高'
  if (value >= 34) return '中'
  return '低'
}

export function ScoreBar({ label, value, tone, hint }: ScoreBarProps) {
  const theme = TONES[tone]
  const clamped = Math.max(0, Math.min(100, value))

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-sm font-semibold text-slate-700">{label}</span>
        <span className={`text-sm font-bold tabular-nums ${theme.text}`}>
          {clamped}
          <span className="text-xs font-medium text-slate-400">/100</span>
          <span className="ml-1.5 text-xs font-medium text-slate-400">（{band(clamped)}）</span>
        </span>
      </div>
      <div
        className={`h-2.5 w-full overflow-hidden rounded-full ${theme.track}`}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-500 ease-out ${theme.bar}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {hint && <p className="mt-1 text-xs leading-relaxed text-slate-500">{hint}</p>}
    </div>
  )
}
