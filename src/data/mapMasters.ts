import { parse } from 'yaml';
import type { MapMaster } from '../types';
import mapsYaml from './maps.yaml?raw';

function parseMapMasters(source: string): MapMaster[] {
  const parsed = parse(source);
  return normalizeParsedMapMasters(parsed, 'maps.yaml');
}

/**
 * ルール単位で定義された YAML/オブジェクトを、画面で扱う MapMaster 配列へ正規化する。
 */
export function normalizeParsedMapMasters(parsed: unknown, sourceName = 'stored map masters'): MapMaster[] {
  if (!parsed || typeof parsed !== 'object') {
    throw new Error(`${sourceName} must contain a rule-grouped object.`);
  }

  const groups = parsed as Record<string, unknown>;
  const mapMasters: MapMaster[] = [];

  for (const [yamlKey, group] of Object.entries(groups)) {
    const mapRule = yamlKey.trim();
    if (mapRule.length === 0) {
      throw new Error(`${sourceName} contains an empty map rule key.`);
    }

    if (!group || typeof group !== 'object' || Array.isArray(group)) {
      throw new Error(`${sourceName} group "${yamlKey}" must be an object.`);
    }

    const maps = (group as Record<string, unknown>).maps;
    if (!Array.isArray(maps)) {
      throw new Error(`${sourceName} group "${yamlKey}" must contain a maps array.`);
    }

    for (const [index, entry] of maps.entries()) {
      if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
        throw new Error(`${sourceName} group "${yamlKey}" entry ${index + 1} must be an object.`);
      }

      const record = entry as Record<string, unknown>;

      if (typeof record.mapId !== 'string' || record.mapId.trim().length === 0) {
        throw new Error(`${sourceName} group "${yamlKey}" entry ${index + 1} has an invalid mapId.`);
      }

      if (typeof record.mapName !== 'string' || record.mapName.trim().length === 0) {
        throw new Error(`${sourceName} group "${yamlKey}" entry ${index + 1} has an invalid mapName.`);
      }

      mapMasters.push({
        mapId: record.mapId.trim(),
        mapName: record.mapName.trim(),
        mapRule,
      });
    }
  }

  return validateUniqueMapIds(mapMasters, sourceName);
}

function validateUniqueMapIds(mapMasters: MapMaster[], sourceName: string): MapMaster[] {
  const uniqueMapIds = new Set<string>();
  for (const mapMaster of mapMasters) {
    if (uniqueMapIds.has(mapMaster.mapId)) {
      throw new Error(`${sourceName} contains a duplicated mapId: ${mapMaster.mapId}`);
    }
    uniqueMapIds.add(mapMaster.mapId);
  }

  return mapMasters;
}

/** `maps.yaml` から読み込んだ標準マップマスタ。 */
export const defaultMapMasters: MapMaster[] = parseMapMasters(mapsYaml);
