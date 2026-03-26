import type { MapRule } from '../types';
import type { RuleFilter } from '../types';
import type { MapMaster } from '../types';
import { isWithinHoursFromIso } from './time';

/**
 * マップマスタに登場するルール一覧を、出現順を保って返す。
 */
export function getAvailableMapRules(mapMasters: MapMaster[]): MapRule[] {
  const availableRules: MapRule[] = [];
  const seen = new Set<MapRule>();

  for (const mapMaster of mapMasters) {
    if (seen.has(mapMaster.mapRule)) continue;
    seen.add(mapMaster.mapRule);
    availableRules.push(mapMaster.mapRule);
  }

  return availableRules;
}

/**
 * 現時点で1件以上抽選可能なマップを持つルールだけを返す。
 */
export function getSelectableMapRules(
  mapMasters: MapMaster[],
  mapState: Record<string, string | null>,
  now: Date,
): MapRule[] {
  const selectableRules: MapRule[] = [];
  const seen = new Set<MapRule>();

  for (const mapMaster of mapMasters) {
    const lastSelectedAt = mapState[mapMaster.mapId] ?? null;
    const exhausted = isWithinHoursFromIso(lastSelectedAt, now, 24);

    if (exhausted || seen.has(mapMaster.mapRule)) continue;
    seen.add(mapMaster.mapRule);
    selectableRules.push(mapMaster.mapRule);
  }

  return selectableRules;
}

/**
 * 利用可能ルール全件を選択済み状態として返す。
 */
export function allRuleFilter(availableRules: MapRule[]): RuleFilter {
  return [...availableRules];
}

/**
 * ルール選択値を正規化し、空や不正な入力しかない場合は全選択に戻す。
 */
export function normalizeRuleFilter(value: unknown, availableRules: MapRule[] = []): RuleFilter {
  if (value === 'all' || value == null) return allRuleFilter(availableRules);

  const rawValues = Array.isArray(value) ? value : [value];
  const selected: MapRule[] = [];
  const seen = new Set<MapRule>();

  for (const rawValue of rawValues) {
    if (typeof rawValue !== 'string') continue;
    const rule = rawValue.trim();
    if (rule.length === 0 || seen.has(rule)) continue;
    seen.add(rule);
    selected.push(rule);
  }

  return selected.length > 0 ? selected : allRuleFilter(availableRules);
}

/**
 * 現在利用可能なルールだけへ絞り込み、結果が空なら全選択に戻す。
 */
export function constrainRuleFilter(ruleFilter: RuleFilter, availableRules: MapRule[]): RuleFilter {
  const available = new Set(availableRules);
  const constrained = ruleFilter.filter((rule) => available.has(rule));
  return constrained.length > 0 ? constrained : allRuleFilter(availableRules);
}

/**
 * 指定ルールの ON/OFF を反転した新しいフィルタを返す。
 */
export function toggleRuleFilter(ruleFilter: RuleFilter, rule: MapRule): RuleFilter {
  const next = ruleFilter.includes(rule)
    ? ruleFilter.filter((selected) => selected !== rule)
    : [...ruleFilter, rule];

  return normalizeRuleFilter(next);
}

/**
 * 抽選後のルール選択状態を返す。
 */
export function nextRuleFilterAfterSpin(
  ruleFilter: RuleFilter,
  pickedRule: MapRule,
  availableRules: MapRule[],
): RuleFilter {
  if (ruleFilter.length <= 1) {
    return availableRules.filter((rule) => rule !== pickedRule);
  }
  const next = ruleFilter.filter((rule) => rule !== pickedRule);
  return constrainRuleFilter(normalizeRuleFilter(next), availableRules);
}

/**
 * ルール表示用ラベルを返す。
 */
export function ruleLabel(rule: MapRule): string {
  return rule.toUpperCase();
}

/**
 * スロット表示用の "RULE : MAP" 文字列を返す。
 */
export function mapDisplayLabel(mapRule: MapRule, mapName: string): string {
  return `${ruleLabel(mapRule)} : ${mapName.toUpperCase()}`;
}
