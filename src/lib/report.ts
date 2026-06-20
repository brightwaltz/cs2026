import { getButtonColor, getPlacement, getScenario } from '../constants'
import type { DesignState } from '../types'
import type { ScoreInput } from './scoring'

/** DesignState を、スコア計算エンジンが必要とする入力へ変換する */
export function toScoreInput(design: DesignState): ScoreInput {
  return {
    warningTextLength: design.warningText.length,
    buttonColor: design.buttonColor,
    checkboxRequired: design.ignorePlacement === 'checkbox-required',
    forceWaitTimer: design.forceWaitTimer,
  }
}

/**
 * LMS 提出用のレポートテキストを組み立てる。
 * 仕様で指定されたフォーマットに厳密に一致させる。
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

  return `【HCIトレードオフ・シミュレーション結果】
選択シナリオ: ${scenario.label}
設計したUI: 色=${color.reportLabel}, 配置=${placement.reportLabel}, タイマー=${timer}

[システム評価]
防御力スコア: ${defenseScore}/100
利便性スコア: ${uxScore}/100

[学生の考察（UIのトレードオフとアルゴリズムの妥当性について）]
${reflection}
====================`
}
