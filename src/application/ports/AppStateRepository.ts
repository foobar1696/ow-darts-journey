import type { RuleFilter, StoredAppState } from '../../types';

export type RuleFilterValue = RuleFilter;

export interface AppStateRepository {
  load(): StoredAppState;
  save(state: StoredAppState): void;
  clearExclusionState(): void;
  // 将来 API 等へ差し替えるために、現時点では write/read のみ持つ
}
