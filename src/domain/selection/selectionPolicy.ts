import type { MapMaster, RuleFilter } from '../../types';
import { isWithinHoursFromIso } from '../../utils/time';

export type CandidateResult = {
  candidates: MapMaster[];
  excludedBy24h: Set<string>;
};

/**
 * 抽選対象となる候補一覧と、24時間クールタイム除外された mapId 集合を返す。
 */
export function getCandidates(params: {
  mapMasters: MapMaster[];
  mapState: Record<string, string | null>;
  ruleFilter: RuleFilter;
  now: Date;
}): CandidateResult {
  const { mapMasters, mapState, ruleFilter, now } = params;

  const excludedBy24h = new Set<string>();
  for (const m of mapMasters) {
    if (isWithinHoursFromIso(mapState[m.mapId] ?? null, now, 24)) {
      excludedBy24h.add(m.mapId);
    }
  }

  // ルールフィルタ
  const selectedRules = new Set(ruleFilter);
  const filtered = mapMasters.filter((m) => selectedRules.has(m.mapRule));

  // 24時間除外
  const after24h = filtered.filter((m) => !excludedBy24h.has(m.mapId));

  return { candidates: after24h, excludedBy24h };
}

/**
 * 候補一覧から一様ランダムに1件選ぶ。
 */
export function pickRandomCandidate(candidates: MapMaster[]): MapMaster {
  if (candidates.length === 0) {
    throw new Error('No candidates to pick.');
  }
  const idx = Math.floor(Math.random() * candidates.length);
  return candidates[idx]!;
}
