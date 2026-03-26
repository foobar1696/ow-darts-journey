import { describe, expect, it } from 'vitest';
import { isWithinHoursFromIso } from './time';

describe('time ユーティリティ', () => {
  it('24時間境界の手前では指定時間内と判定する', () => {
    expect(isWithinHoursFromIso('2026-03-25T12:00:01.000Z', new Date('2026-03-26T12:00:00.000Z'), 24)).toBe(true);
  });

  it('24時間境界ちょうどでは指定時間内に含めない', () => {
    expect(isWithinHoursFromIso('2026-03-25T12:00:00.000Z', new Date('2026-03-26T12:00:00.000Z'), 24)).toBe(false);
  });

  it('24時間境界を超えた日時は指定時間内に含めない', () => {
    expect(isWithinHoursFromIso('2026-03-25T11:59:59.000Z', new Date('2026-03-26T12:00:00.000Z'), 24)).toBe(false);
  });

  it('null は指定時間内に含めない', () => {
    expect(isWithinHoursFromIso(null, new Date('2026-03-26T12:00:00.000Z'), 24)).toBe(false);
  });

  it('不正な日時文字列は指定時間内に含めない', () => {
    expect(isWithinHoursFromIso('invalid', new Date('2026-03-26T12:00:00.000Z'), 24)).toBe(false);
  });
});
