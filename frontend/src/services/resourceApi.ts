import apiClient from './apiClient';
import type { Match, StandingRow } from '../types';

export function listResource<T = any>(resource: string) {
  return apiClient.get<T[]>(`/${resource}`).then((res) => res.data);
}

export function getResource<T = any>(resource: string, id: number | string) {
  return apiClient.get<T>(`/${resource}/${id}`).then((res) => res.data);
}

export function createResource<T = any>(resource: string, data: Record<string, unknown>) {
  return apiClient.post<T>(`/${resource}`, normalizePayload(data)).then((res) => res.data);
}

export function updateResource<T = any>(resource: string, id: number | string, data: Record<string, unknown>) {
  return apiClient.put<T>(`/${resource}/${id}`, normalizePayload(data)).then((res) => res.data);
}

export function deleteResource(resource: string, id: number | string) {
  return apiClient.delete(`/${resource}/${id}`).then((res) => res.data);
}

export function getDashboardSummary() {
  return apiClient.get<Record<string, number>>('/dashboard/summary').then((res) => res.data);
}

export function updateMatchResult(matchId: number | string, data: Record<string, unknown>) {
  return apiClient.patch(`/matches/${matchId}/result`, normalizePayload(data)).then((res) => res.data);
}

export function getStandings(tournamentId: number | string) {
  return apiClient.get<StandingRow[]>(`/standings/tournaments/${tournamentId}`).then((res) => res.data);
}

export function recalculateGroup(tournamentId: number | string, groupId: number | string) {
  return apiClient.post<StandingRow[]>(`/standings/tournaments/${tournamentId}/groups/${groupId}/recalculate`).then((res) => res.data);
}

export function getBracket(tournamentId: number | string) {
  return apiClient.get<Match[]>(`/brackets/tournaments/${tournamentId}`).then((res) => res.data);
}

export function generateSemiFinals(tournamentId: number | string, data: Record<string, unknown>) {
  return apiClient.post(`/brackets/tournaments/${tournamentId}/semi-finals`, normalizePayload(data)).then((res) => res.data);
}

function normalizePayload(data: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => {
      if (value === '') return [key, null];
      if (key === 'roles' && typeof value === 'string') {
        return [key, value.split(',').map((role) => role.trim()).filter(Boolean)];
      }
      if (key.endsWith('Id') || ['capacity', 'shirtNumber', 'minute', 'orderNo', 'homeScore', 'awayScore'].includes(key)) {
        return [key, value === null ? null : Number(value)];
      }
      return [key, value];
    })
  );
}
