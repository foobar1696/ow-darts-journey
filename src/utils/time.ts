/**
 * Date を localStorage 保存用の ISO 8601 文字列へ変換する。
 */
export function toIsoString(d: Date): string {
  return d.toISOString();
}

/**
 * ISO 8601 文字列を Date に変換する。
 */
export function parseIsoToDate(value: string): Date {
  return new Date(value);
}

/**
 * 入力文字列が妥当な日時として解釈できるかを判定する。
 */
export function isValidIso(value: string): boolean {
  const d = new Date(value);
  return !Number.isNaN(d.getTime());
}

/**
 * 2つの日時の差分を時間単位で返す。
 */
export function diffHours(from: Date, to: Date): number {
  return (to.getTime() - from.getTime()) / (1000 * 60 * 60);
}

/**
 * ISO 8601 文字列の時刻が、基準時刻から指定時間以内かを判定する。
 */
export function isWithinHoursFromIso(value: string | null, now: Date, hours: number): boolean {
  if (!value) return false;
  if (!isValidIso(value)) return false;
  return diffHours(parseIsoToDate(value), now) < hours;
}
