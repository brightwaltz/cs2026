import {
  FEATURES,
  getButtonColor,
  getPlacement,
  getScenario,
} from '../constants'
import type { DesignState } from '../types'
import type { ScoreInput } from './scoring'

/** DesignState を、スコア計算エンジンが必要とする入力へ変換する */
export function toScoreInput(design: DesignState): ScoreInput {
  return {
    warningTextLength: design.warningText.length,
    buttonColor: design.buttonColor,
    checkboxRequired: design.ignorePlacement === 'checkbox-required',
    forceWaitTimer: design.forceWaitTimer,
    confirmStep: design.confirmStep,
    requireReason: design.requireReason,
    dangerEmphasis: design.dangerEmphasis,
    safeDefaultFocus: design.safeDefaultFocus,
  }
}

/**
 * LMS 提出用のレポートテキストを組み立てる。
 * 仕様で指定されたフォーマットに厳密に一致させつつ、
 * 追加で有効化した防御機能を1行で併記する。
 */
export function buildReport(
  design: DesignState,
  defenseScore: number,
  uxScore: number,
): string {
  const scenario = getScenario(design.scenario)
  const color = getButtonColor(design.buttonColor)
  const placement = getPlacement(design.ignorePlacement)
  const timer = design.forceWaitTimer ? 'あり' : 'なし'
  const reflection = design.reflection.trim() || '（未記入）'

  // タイマー以外の追加防御機能のうち、有効なものを列挙
  const extras = FEATURES.filter(
    (f) => f.key !== 'forceWaitTimer' && design[f.key],
  ).map((f) => f.short)
  const extraLine = extras.length > 0 ? extras.join(', ') : 'なし'

  return `【HCIトレードオフ・シミュレーション結果】
選択シナリオ: ${scenario.label}
設計したUI: 色=${color.reportLabel}, 配置=${placement.reportLabel}, タイマー=${timer}
追加の防御機能: ${extraLine}

[システム評価]
防御力スコア: ${defenseScore}/100
利便性スコア: ${uxScore}/100

[考察（UIのトレードオフとアルゴリズムの妥当性について）]
${reflection}
====================`
}
