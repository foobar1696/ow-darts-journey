import type { AppStateRepository } from '../../application/ports/AppStateRepository';
import type { RuleFilter, StoredAppState } from '../../types';
import { isValidIso } from '../../utils/time';
import { normalizeRuleFilter } from '../../utils/rules';

const KEY_MAP_STATE = 'ow-darts-journey.mapState';
const KEY_RULE_FILTER = 'ow-darts-journey.ruleFilter';
const LEGACY_KEY_MAP_STATE = 'ow-map-randomizer.mapState';
const LEGACY_KEY_HISTORY = 'ow-map-randomizer.history';
const LEGACY_KEY_RULE_FILTER = 'ow-map-randomizer.ruleFilter';

function safeReadJson(key: string): unknown {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function safeReadJsonWithFallback(primaryKey: string, legacyKeys: string[] = []): unknown {
  const primaryValue = safeReadJson(primaryKey);
  if (primaryValue !== null) return primaryValue;

  for (const legacyKey of legacyKeys) {
    const legacyValue = safeReadJson(legacyKey);
    if (legacyValue !== null) return legacyValue;
  }

  return null;
}

function safeWriteJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // クリティカルでない（アプリが落ちないこと優先）
  }
}

function normalizeMapState(value: unknown): Record<string, string | null> {
  if (!value || typeof value !== 'object') return {};
  const obj = value as Record<string, unknown>;

  const result: Record<string, string | null> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === null) {
      result[k] = null;
      continue;
    }
    if (typeof v === 'string' && isValidIso(v)) {
      result[k] = v;
    }
  }
  return result;
}

export class LocalStorageAppStateRepository implements AppStateRepository {
  load(): StoredAppState {
    const storedMapState = normalizeMapState(safeReadJsonWithFallback(KEY_MAP_STATE, [LEGACY_KEY_MAP_STATE]));
    const storedRuleFilterRaw = safeReadJsonWithFallback(KEY_RULE_FILTER, [LEGACY_KEY_RULE_FILTER]);
    const ruleFilter: RuleFilter = normalizeRuleFilter(storedRuleFilterRaw);

    return {
      mapState: storedMapState,
      ruleFilter,
    };
  }

  save(state: StoredAppState): void {
    safeWriteJson(KEY_MAP_STATE, state.mapState);
    safeWriteJson(KEY_RULE_FILTER, state.ruleFilter);
  }

  clearExclusionState(): void {
    safeWriteJson(KEY_MAP_STATE, {});
    safeWriteJson(LEGACY_KEY_HISTORY, []);
  }
}
