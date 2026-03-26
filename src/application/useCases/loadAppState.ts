import type { AppStateRepository } from '../ports/AppStateRepository';
import type { StoredAppState } from '../../types';

/**
 * 永続化済みのアプリ状態を読み出す。
 */
export function loadAppState(params: { repo: AppStateRepository }): StoredAppState {
  return params.repo.load();
}
