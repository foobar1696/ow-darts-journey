import { describe, expect, it } from 'vitest';
import { getCandidates, pickRandomCandidate } from './selectionPolicy';
import type { MapMaster } from '../../types';

const mapMasters: MapMaster[] = [
  { mapId: 'route-66', mapName: 'Route 66', mapRule: 'escort' },
  { mapId: 'rialto', mapName: 'Rialto', mapRule: 'escort' },
  { mapId: 'busan', mapName: 'Busan', mapRule: 'control' },
];

describe('selectionPolicy', () => {
  const now = new Date('2026-03-26T12:00:00.000Z');

  it('選択したルールに属するマップだけを抽選候補に残す', () => {
    const result = getCandidates({
      mapMasters,
      mapState: {},
      ruleFilter: ['control'],
      now,
    });

    expect(result.candidates).toEqual([{ mapId: 'busan', mapName: 'Busan', mapRule: 'control' }]);
  });

  it('24時間より少し短い間隔で選ばれたマップは抽選候補から外す', () => {
    const result = getCandidates({
      mapMasters,
      mapState: {
        'route-66': '2026-03-25T12:00:01.000Z',
      },
      ruleFilter: ['escort'],
      now,
    });

    expect(result.candidates).toEqual([{ mapId: 'rialto', mapName: 'Rialto', mapRule: 'escort' }]);
    expect(result.excludedBy24h.has('route-66')).toBe(true);
  });

  it('ちょうど24時間経過したマップは抽選候補に戻る', () => {
    const result = getCandidates({
      mapMasters,
      mapState: {
        'route-66': '2026-03-25T12:00:00.000Z',
      },
      ruleFilter: ['escort'],
      now,
    });

    expect(result.candidates).toEqual([
      { mapId: 'route-66', mapName: 'Route 66', mapRule: 'escort' },
      { mapId: 'rialto', mapName: 'Rialto', mapRule: 'escort' },
    ]);
    expect(result.excludedBy24h.has('route-66')).toBe(false);
  });

  it('24時間を十分に超えているマップは抽選候補に残る', () => {
    const result = getCandidates({
      mapMasters,
      mapState: {
        rialto: '2026-03-24T11:00:00.000Z',
      },
      ruleFilter: ['escort'],
      now,
    });

    expect(result.candidates).toEqual([
      { mapId: 'route-66', mapName: 'Route 66', mapRule: 'escort' },
      { mapId: 'rialto', mapName: 'Rialto', mapRule: 'escort' },
    ]);
    expect(result.excludedBy24h.has('rialto')).toBe(false);
  });

  it('候補が空のままランダム抽選しようとすると例外になる', () => {
    expect(() => pickRandomCandidate([])).toThrow('No candidates to pick.');
  });
});
