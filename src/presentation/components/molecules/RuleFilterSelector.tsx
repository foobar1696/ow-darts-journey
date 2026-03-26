import React from 'react';
import type { MapRule, RuleFilter } from '../../../types';
import { ruleLabel, toggleRuleFilter } from '../../../utils/rules';

export default function RuleFilterSelector(props: {
  value: RuleFilter;
  availableRules: MapRule[];
  disabledRules: MapRule[];
  disabled: boolean;
  onChange: (value: RuleFilter) => void;
  onSelectAllEnabledRules: () => void;
}) {
  const { value, availableRules, disabledRules, disabled, onChange, onSelectAllEnabledRules } = props;
  const disabledRuleSet = new Set(disabledRules);
  const enabledRules = availableRules.filter((rule) => !disabledRuleSet.has(rule));
  const allEnabledSelected = enabledRules.length > 0 && enabledRules.every((rule) => value.includes(rule));

  return (
    <div className="rule-filter-selector">
      <label
        className={`rule-filter-selector-label rule-filter-selector-label-heading${
          disabled || enabledRules.length === 0 || allEnabledSelected ? ' is-disabled' : ''
        }`}
      >
        <input
          type="checkbox"
          checked={allEnabledSelected}
          disabled={disabled || enabledRules.length === 0 || allEnabledSelected}
          onChange={onSelectAllEnabledRules}
        />
        <span>マップルール</span>
      </label>
      <div className="rule-filter-selector-list">
        {availableRules.map((rule) => (
          <label
            key={rule}
            className={`rule-filter-selector-label${
              disabled || disabledRuleSet.has(rule) ? ' is-disabled' : ''
            }${disabledRuleSet.has(rule) ? ' is-unavailable' : ''}`}
          >
            <input
              type="checkbox"
              checked={value.includes(rule)}
              disabled={disabled || disabledRuleSet.has(rule)}
              onChange={() => onChange(toggleRuleFilter(value, rule))}
            />
            <span>{ruleLabel(rule)}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
