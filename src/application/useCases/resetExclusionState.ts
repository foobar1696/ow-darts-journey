import type { AppStateRepository } from '../ports/AppStateRepository';
import type { RuleFilter, StoredAppState } from '../../types';
import { allRuleFilter } from '../../utils/rules';

export function resetExclusionState(params: {
  repo: AppStateRepository;
  availableRules: RuleFilter;
}): StoredAppState {
  const { repo, availableRules } = params;
  repo.clearExclusionState();
  const next: StoredAppState = {
    mapState: {},
    ruleFilter: allRuleFilter(availableRules),
  };

  repo.save(next);
  return next;
}
