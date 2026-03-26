import { describe, expect, it } from 'vitest';
import { getCooldownMapsViewModel } from './getCooldownMapsViewModel';
import type { MapMaster } from '../../types';

const mapMasters: MapMaster[] = [
  { mapId: 'kings-row', mapName: "King's Row", mapRule: 'hybrid' },
  { mapId: 'route-66', mapName: 'Route 66', mapRule: 'escort' },
  { mapId: 'busan', mapName: 'Busan', mapRule: 'control' },
];

describe('getCooldownMapsViewModel', () => {
  it('24時間以内のマップだけを新しい抽選日時順で返す', () => {
    const result = getCooldownMapsViewModel({
      mapMasters,
      mapState: {
        'kings-row': '2026-03-25T23:00:00.000Z',
        'route-66': '2026-03-26T08:00:00.000Z',
        busan: '2026-03-24T07:00:00.000Z',
      },
      now: new Date('2026-03-26T12:00:00.000Z'),
    });

    expect(result.map((item) => item.mapId)).toEqual(['route-66', 'kings-row']);
  });

  it('不正な日時や未選択のマップは除外する', () => {
    const result = getCooldownMapsViewModel({
      mapMasters,
      mapState: {
        'kings-row': null,
        'route-66': 'invalid',
        busan: '2026-03-26T10:00:00.000Z',
      },
      now: new Date('2026-03-26T12:00:00.000Z'),
    });

    expect(result.map((item) => item.mapId)).toEqual(['busan']);
  });
});
