import type { MapMaster, RuleFilter } from '../../types';
import { getCandidates, pickRandomCandidate } from '../../domain/selection/selectionPolicy';
import type { CandidateResult } from '../../domain/selection/selectionPolicy';

export type SpinPreparation = {
  ok: true;
  picked: MapMaster;
  candidateResult: CandidateResult;
};

export type SpinPreparationError = {
  ok: false;
  message: string;
};

export type SpinPreparationResult = SpinPreparation | SpinPreparationError;

export function prepareSpin(params: {
  mapMasters: MapMaster[];
  mapState: Record<string, string | null>;
  ruleFilter: RuleFilter;
  now: Date;
}): SpinPreparationResult {
  const { mapMasters, mapState, ruleFilter, now } = params;

  const candidateResult = getCandidates({
    mapMasters,
    mapState,
    ruleFilter,
    now,
  });

  if (candidateResult.candidates.length === 0) {
    return { ok: false, message: '現在抽選可能なマップがありません' };
  }

  const picked = pickRandomCandidate(candidateResult.candidates);
  return { ok: true, picked, candidateResult };
}
