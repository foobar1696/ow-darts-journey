import type { AppStateRepository } from '../ports/AppStateRepository';
import type { MapMaster, RuleFilter, StoredAppState } from '../../types';
import { toIsoString } from '../../utils/time';
import { nextRuleFilterAfterSpin } from '../../utils/rules';

export function commitSpin(params: {
  repo: AppStateRepository;
  mapState: Record<string, string | null>;
  ruleFilter: RuleFilter;
  picked: MapMaster;
  availableRules: MapMaster['mapRule'][];
  now: Date;
}): StoredAppState {
  const { repo, mapState, ruleFilter, picked, availableRules, now } = params;
  const iso = toIsoString(now);

  const nextMapState: Record<string, string | null> = {
    ...mapState,
    [picked.mapId]: iso,
  };

  const nextRuleSelection = nextRuleFilterAfterSpin(ruleFilter, picked.mapRule, availableRules);

  const next: StoredAppState = {
    mapState: nextMapState,
    ruleFilter: nextRuleSelection,
  };

  repo.save(next);
  return next;
}
