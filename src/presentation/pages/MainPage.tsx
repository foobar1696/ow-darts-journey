import React, { useState } from 'react';
import { useMainPageController } from '../hooks/useMainPageController';
import MainTemplate from '../templates/MainTemplate';
import RuleFilterSelector from '../components/molecules/RuleFilterSelector';
import SpinButton from '../components/atoms/SpinButton';
import MessageBanner from '../components/atoms/MessageBanner';
import SlotMachine from '../components/organisms/SlotMachine';
import MapListPanel from '../components/organisms/MapListPanel';
import UsageGuideModal from '../components/organisms/UsageGuideModal';
import './mainPage.css';

export default function MainPage() {
  const c = useMainPageController();
  const [isManualOpen, setIsManualOpen] = useState(false);
  const interactionLocked = c.slotStatus === 'spinning' || c.slotStatus === 'stopping' || c.isResettingExclusions;

  return (
    <div className="app" data-app="ow-darts-journey">
      <div className="app-header">
        <h1>OWダーツの旅</h1>
        <button
          type="button"
          className="manual-toggle-button"
          aria-expanded={isManualOpen}
          aria-controls="usage-modal"
          onClick={() => setIsManualOpen((current) => !current)}
        >
          使い方
        </button>
      </div>
      <UsageGuideModal isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />
      <MainTemplate
        left={
          <div className="side-panel-shell">
            <div className="side-panel-card">
              <div>
                <RuleFilterSelector
                  value={c.visibleRuleFilter}
                  availableRules={c.availableRules}
                  disabledRules={c.disabledRules}
                  disabled={interactionLocked}
                  onChange={c.onRuleFilterChange}
                  onSelectAllEnabledRules={c.onSelectAllEnabledRules}
                />
              </div>
              <MessageBanner message={c.message} />
            </div>
            <div className="side-panel-card">
              <MapListPanel
                cooldownMaps={c.cooldownMaps}
                isResetting={c.isResettingExclusions}
                resetDisabled={interactionLocked}
                onReset={c.onReset}
              />
            </div>
          </div>
        }
        center={
          <div className="slot-stage">
            <SlotMachine
              status={c.slotStatus}
              items={c.reelItems}
              targetIndex={c.targetIndex}
              onSpinAnimationFinished={c.onSlotFinished}
            />
            <div className="slot-stage-action">
              <SpinButton disabled={interactionLocked} onClick={c.onStartSpin} />
            </div>
          </div>
        }
        right={null}
      />
    </div>
  );
}
