import { describe, expect, it, vi } from 'vitest';
import { commitSpin } from './commitSpin';
import type { AppStateRepository } from '../ports/AppStateRepository';
import type { StoredAppState } from '../../types';

describe('commitSpin', () => {
  it('当選したマップの時刻を保存し、当選ルールを選択状態から外す', () => {
    const save = vi.fn();
    const repo: AppStateRepository = {
      load: () => ({ mapState: {}, ruleFilter: [] }),
      save,
      clearExclusionState: vi.fn(),
    };

    const next = commitSpin({
      repo,
      mapState: { busan: null },
      ruleFilter: ['escort', 'control'],
      picked: {
        mapId: 'route-66',
        mapName: 'Route 66',
        mapRule: 'escort',
      },
      availableRules: ['escort', 'control', 'hybrid'],
      now: new Date('2026-03-26T12:34:56.000Z'),
    });

    const expected: StoredAppState = {
      mapState: {
        busan: null,
        'route-66': '2026-03-26T12:34:56.000Z',
      },
      ruleFilter: ['control'],
    };

    expect(next).toEqual(expected);
    expect(save).toHaveBeenCalledWith(expected);
  });

  it('抽選前に選択ルールが1件だけなら抽選後は当選ルールだけ外して他の利用可能ルールをオンにする', () => {
    const repo: AppStateRepository = {
      load: () => ({ mapState: {}, ruleFilter: [] }),
      save: vi.fn(),
      clearExclusionState: vi.fn(),
    };

    const next = commitSpin({
      repo,
      mapState: {},
      ruleFilter: ['escort'],
      picked: {
        mapId: 'route-66',
        mapName: 'Route 66',
        mapRule: 'escort',
      },
      availableRules: ['escort', 'control'],
      now: new Date('2026-03-26T12:34:56.000Z'),
    });

    expect(next.ruleFilter).toEqual(['control']);
  });
});
