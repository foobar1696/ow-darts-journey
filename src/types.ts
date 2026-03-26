export type MapRule = string;

export type RuleFilter = MapRule[];
export type MapState = Record<string, string | null>;

export type SlotStatus = 'idle' | 'spinning' | 'stopping' | 'result';

export type MapMaster = {
  mapId: string;
  mapName: string;
  mapRule: MapRule;
  imagePath?: string; // optional (初期版は使わない)
};

export type StoredAppState = {
  mapState: MapState; // mapId -> lastSelectedAt (ISO 8601) | null
  ruleFilter: RuleFilter;
};

export type CooldownMapItem = {
  mapId: string;
  mapName: string;
  selectedAt: string;
  selectedAtDate: Date;
};
