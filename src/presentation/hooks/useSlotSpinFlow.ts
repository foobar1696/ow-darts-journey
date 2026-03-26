import { useCallback, useEffect, useMemo, useState } from 'react';
import type { AppStateRepository } from '../../application/ports/AppStateRepository';
import { commitSpin } from '../../application/useCases/commitSpin';
import { prepareSpin } from '../../application/useCases/prepareSpin';
import type { SpinPreparationResult } from '../../application/useCases/prepareSpin';
import type { MapMaster, MapState, RuleFilter, SlotStatus } from '../../types';
import { mapDisplayLabel, constrainRuleFilter } from '../../utils/rules';

const RESULT_HIGHLIGHT_TOTAL_MS = 500;

function shuffleMaps(items: MapMaster[]): MapMaster[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j]!, next[i]!];
  }
  return next;
}

type SpinCommitResult = {
  mapState: MapState;
  ruleFilter: RuleFilter;
};

type UseSlotSpinFlowParams = {
  repo: AppStateRepository;
  mapMasters: MapMaster[];
  mapState: MapState;
  storedRuleFilter: RuleFilter;
  visibleRuleFilter: RuleFilter;
  availableRules: RuleFilter;
  isExternallyLocked: boolean;
  onCommitted: (next: SpinCommitResult) => void;
  onMessageChange: (message: string) => void;
};

/**
 * スロット抽選の開始・停止・確定までの画面状態を管理する hook。
 */
export function useSlotSpinFlow(params: UseSlotSpinFlowParams) {
  const {
    repo,
    mapMasters,
    mapState,
    storedRuleFilter,
    visibleRuleFilter,
    availableRules,
    isExternallyLocked,
    onCommitted,
    onMessageChange,
  } = params;
  const [slotStatus, setSlotStatus] = useState<SlotStatus>('idle');
  const [slotResult, setSlotResult] = useState<MapMaster | null>(null);
  const [reelMapOrder] = useState<MapMaster[]>(() => shuffleMaps(mapMasters));
  const isSpinLocked = isExternallyLocked || slotStatus === 'spinning' || slotStatus === 'stopping';

  useEffect(() => {
    if (slotStatus !== 'stopping') return;

    const id = window.setTimeout(() => {
      setSlotStatus('result');
    }, RESULT_HIGHLIGHT_TOTAL_MS);

    return () => window.clearTimeout(id);
  }, [slotStatus]);

  const reelItems = useMemo(
    () => reelMapOrder.map((mapMaster) => mapDisplayLabel(mapMaster.mapRule, mapMaster.mapName)),
    [reelMapOrder],
  );

  const targetIndex = useMemo(() => {
    if (!slotResult) return -1;
    return reelMapOrder.findIndex((mapMaster) => mapMaster.mapId === slotResult.mapId);
  }, [reelMapOrder, slotResult]);

  const onStartSpin = useCallback(() => {
    if (isSpinLocked) return;

    const result: SpinPreparationResult = prepareSpin({
      mapMasters,
      mapState,
      ruleFilter: visibleRuleFilter,
      now: new Date(),
    });

    if (!result.ok) {
      onMessageChange(result.message);
      return;
    }

    setSlotResult(result.picked);
    setSlotStatus('spinning');
    onMessageChange('');
  }, [isSpinLocked, mapMasters, mapState, onMessageChange, visibleRuleFilter]);

  const onSpinAnimationFinished = useCallback(() => {
    if (!slotResult) return;

    const next = commitSpin({
      repo,
      mapState,
      ruleFilter: storedRuleFilter,
      picked: slotResult,
      availableRules,
      now: new Date(),
    });

    onCommitted({
      mapState: next.mapState,
      ruleFilter: constrainRuleFilter(next.ruleFilter, availableRules),
    });
    setSlotStatus('stopping');
    onMessageChange('');
  }, [availableRules, mapState, onCommitted, onMessageChange, repo, slotResult, storedRuleFilter]);

  const resetSlotView = useCallback(() => {
    setSlotResult(null);
    setSlotStatus('idle');
    onMessageChange('');
  }, [onMessageChange]);

  return {
    slotStatus,
    slotResult,
    reelItems,
    targetIndex,
    onStartSpin,
    onSpinAnimationFinished,
    resetSlotView,
  };
}
