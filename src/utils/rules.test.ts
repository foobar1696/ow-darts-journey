import { describe, expect, it } from 'vitest';
import {
  constrainRuleFilter,
  getAvailableMapRules,
  mapDisplayLabel,
  nextRuleFilterAfterSpin,
  getSelectableMapRules,
  normalizeRuleFilter,
  toggleRuleFilter,
} from './rules';
import type { MapMaster } from '../types';

const mapMasters: MapMaster[] = [
  { mapId: 'kings-row', mapName: "King's Row", mapRule: 'hybrid' },
  { mapId: 'route-66', mapName: 'Route 66', mapRule: 'escort' },
  { mapId: 'busan', mapName: 'Busan', mapRule: 'control' },
];

describe('rules ユーティリティ', () => {
  it('ルールフィルタは空白を除去しつつ入力順を維持して正規化する', () => {
    expect(normalizeRuleFilter([' escort ', 'control', 'escort'])).toEqual(['escort', 'control']);
  });

  it('空文字や不正な値しかない場合は利用可能ルールの全選択に戻す', () => {
    expect(normalizeRuleFilter(['', '   ', 1], ['escort', 'control'])).toEqual(['escort', 'control']);
  });

  it('マップ一覧に存在するルールだけを抽出する', () => {
    expect(getAvailableMapRules(mapMasters)).toEqual(['hybrid', 'escort', 'control']);
  });

  it('24時間除外で候補が残っているルールだけを選択可能ルールとして抽出する', () => {
    expect(
      getSelectableMapRules(
        mapMasters,
        {
          'kings-row': '2026-03-26T00:30:00.000Z',
          'route-66': '2026-03-26T00:30:00.000Z',
        },
        new Date('2026-03-26T12:00:00.000Z'),
      ),
    ).toEqual(['control']);
  });

  it('選択済みルールに利用可能なルールだけが残る場合はそのまま絞り込む', () => {
    expect(constrainRuleFilter(['escort', 'push'], ['escort', 'hybrid'])).toEqual(['escort']);
  });

  it('選択済みルールが利用可能ルールに1件も残らない場合は全選択に戻す', () => {
    expect(constrainRuleFilter(['push'], ['escort', 'hybrid'])).toEqual(['escort', 'hybrid']);
  });

  it('スロット表示ラベルはルール名とマップ名を大文字で返す', () => {
    expect(mapDisplayLabel('flash point', 'Suravasa')).toBe('FLASH POINT : SURAVASA');
  });

  it('抽選後は当選したルールだけを選択状態から外す', () => {
    expect(nextRuleFilterAfterSpin(['escort', 'hybrid'], 'escort', ['escort', 'hybrid', 'control'])).toEqual([
      'hybrid',
    ]);
  });

  it('選択済みのルールをトグルするとオフになる', () => {
    expect(toggleRuleFilter(['escort', 'control'], 'escort')).toEqual(['control']);
  });

  it('未選択のルールをトグルするとオンになる', () => {
    expect(toggleRuleFilter(['control'], 'escort')).toEqual(['control', 'escort']);
  });

  it('抽選前にルールが1件だけ選択されていた場合は当選ルールだけオフにして他の利用可能ルールをオンにする', () => {
    expect(nextRuleFilterAfterSpin(['escort'], 'escort', ['escort', 'hybrid', 'control'])).toEqual([
      'hybrid',
      'control',
    ]);
  });
});
