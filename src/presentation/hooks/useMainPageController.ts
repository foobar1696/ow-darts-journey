import { useCallback, useMemo, useState } from 'react';
import type { CooldownMapItem, MapMaster, MapState, RuleFilter, SlotStatus } from '../../types';
import { defaultMapMasters } from '../../data/mapMasters';
import { LocalStorageAppStateRepository } from '../../infrastructure/repositories/LocalStorageAppStateRepository';
import { resetExclusionState } from '../../application/useCases/resetExclusionState';
import { loadAppState } from '../../application/useCases/loadAppState';
import { getCooldownMapsViewModel } from '../../application/useCases/getCooldownMapsViewModel';
import { constrainRuleFilter, getAvailableMapRules, getSelectableMapRules } from '../../utils/rules';
import { useCooldownResetFlow } from './useCooldownResetFlow';
import { useNowTicker } from './useNowTicker';
import { useSlotSpinFlow } from './useSlotSpinFlow';

const APP_STATE_REPO = new LocalStorageAppStateRepository();
const MAP_MASTERS = defaultMapMasters;
const RESET_FADE_OUT_MS = 280;

function loadInitialState(availableRules: RuleFilter) {
  const initial = loadAppState({ repo: APP_STATE_REPO });
  return {
    mapState: initial.mapState,
    ruleFilter: constrainRuleFilter(initial.ruleFilter, availableRules),
  };
}

export type MainPageController = {
  mapMasters: MapMaster[];
  availableRules: RuleFilter;
  slotStatus: SlotStatus;
  reelItems: string[];
  targetIndex: number;
  visibleRuleFilter: RuleFilter;
  disabledRules: RuleFilter;
  message: string;
  cooldownMaps: CooldownMapItem[];
  now: Date;
  isResettingExclusions: boolean;
  onRuleFilterChange: (next: RuleFilter) => void;
  onSelectAllEnabledRules: () => void;
  onStartSpin: () => void;
  onReset: () => void;
  onSlotFinished: () => void;
};

/**
 * メイン画面全体の表示用 state とイベントハンドラを組み立てる hook。
 */
export function useMainPageController(): MainPageController {
  const availableRules = useMemo(() => getAvailableMapRules(MAP_MASTERS), []);
  const initialState = useMemo(() => loadInitialState(availableRules), [availableRules]);
  const [mapState, setMapState] = useState<MapState>(() => initialState.mapState);
  const [storedRuleFilter, setStoredRuleFilter] = useState<RuleFilter>(() => initialState.ruleFilter);
  const [message, setMessage] = useState<string>('');
  const now = useNowTicker(5000);
  const { isResetting: isResettingExclusions, startReset } = useCooldownResetFlow(RESET_FADE_OUT_MS);

  const selectableRules = useMemo(() => getSelectableMapRules(MAP_MASTERS, mapState, now), [mapState, now]);
  const visibleRuleFilter = useMemo(
    () => storedRuleFilter.filter((rule) => selectableRules.includes(rule)),
    [selectableRules, storedRuleFilter],
  );
  const { slotStatus, reelItems, targetIndex, onStartSpin, onSpinAnimationFinished, resetSlotView } =
    useSlotSpinFlow({
      repo: APP_STATE_REPO,
      mapMasters: MAP_MASTERS,
      mapState,
      storedRuleFilter,
      visibleRuleFilter,
      availableRules,
      isExternallyLocked: isResettingExclusions,
      onCommitted: (next) => {
        setMapState(next.mapState);
        setStoredRuleFilter(next.ruleFilter);
      },
      onMessageChange: setMessage,
    });
  const interactionLocked = slotStatus === 'spinning' || slotStatus === 'stopping' || isResettingExclusions;
  const disabledRules = useMemo(
    () => availableRules.filter((rule) => !selectableRules.includes(rule)),
    [availableRules, selectableRules],
  );
  const cooldownMaps = useMemo(
    () =>
      getCooldownMapsViewModel({
        mapMasters: MAP_MASTERS,
        mapState,
        now,
      }),
    [mapState, now],
  );

  const onRuleFilterChange = useCallback(
    (next: RuleFilter) => {
      if (interactionLocked) return;
      const disabledSelectedRules = storedRuleFilter.filter((rule) => disabledRules.includes(rule));
      setStoredRuleFilter(constrainRuleFilter([...disabledSelectedRules, ...next], availableRules));
    },
    [availableRules, disabledRules, interactionLocked, storedRuleFilter],
  );

  const onSelectAllEnabledRules = useCallback(() => {
    if (interactionLocked) return;
    setStoredRuleFilter(constrainRuleFilter([...disabledRules, ...selectableRules], availableRules));
  }, [availableRules, disabledRules, interactionLocked, selectableRules]);

  const applyResetState = useCallback(
    (next: { mapState: MapState; ruleFilter: RuleFilter }) => {
      setMapState(next.mapState);
      setStoredRuleFilter(next.ruleFilter);
      resetSlotView();
    },
    [resetSlotView],
  );

  const onReset = useCallback(() => {
    if (interactionLocked) return;
    const ok = window.confirm('クールタイムをリセットします。リセット完了すると、再びマップが抽選対象となります。');
    if (!ok) return;

    startReset(() => {
      const next = resetExclusionState({
        repo: APP_STATE_REPO,
        availableRules,
      });

      applyResetState(next);
    });
  }, [applyResetState, availableRules, interactionLocked, startReset]);

  return {
    mapMasters: MAP_MASTERS,
    availableRules,
    slotStatus,
    reelItems,
    targetIndex,
    visibleRuleFilter,
    disabledRules,
    message,
    cooldownMaps,
    now,
    isResettingExclusions,
    onRuleFilterChange,
    onSelectAllEnabledRules,
    onStartSpin,
    onReset,
    onSlotFinished: onSpinAnimationFinished,
  };
}
