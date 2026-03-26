import type { CooldownMapItem, MapMaster } from '../../types';
import { isValidIso, isWithinHoursFromIso, parseIsoToDate } from '../../utils/time';

/**
 * クールタイム中のマップ一覧を、抽選日時の新しい順で返す。
 */
export function getCooldownMapsViewModel(params: {
  mapMasters: MapMaster[];
  mapState: Record<string, string | null>;
  now: Date;
}): CooldownMapItem[] {
  const { mapMasters, mapState, now } = params;

  return mapMasters
    .map((mapMaster) => {
      const selectedAt = mapState[mapMaster.mapId];
      if (!selectedAt || !isValidIso(selectedAt)) return null;
      if (!isWithinHoursFromIso(selectedAt, now, 24)) return null;

      return {
        mapId: mapMaster.mapId,
        mapName: mapMaster.mapName,
        selectedAt,
        selectedAtDate: parseIsoToDate(selectedAt),
      };
    })
    .filter((item): item is CooldownMapItem => item !== null)
    .sort((a, b) => b.selectedAtDate.getTime() - a.selectedAtDate.getTime());
}
