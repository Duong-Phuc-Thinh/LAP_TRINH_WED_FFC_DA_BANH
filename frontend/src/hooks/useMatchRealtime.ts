import { useEffect } from 'react';
import { socket } from '../services/socket';
import type { Match } from '../types';

interface MatchResultPayload {
  match: Match;
}

export function useMatchRealtime(onMatchUpdated: (match: Match) => void) {
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    function handleResultUpdated(payload: MatchResultPayload) {
      if (payload?.match) {
        onMatchUpdated(payload.match);
      }
    }

    socket.on('match:result-updated', handleResultUpdated);

    return () => {
      socket.off('match:result-updated', handleResultUpdated);
      if (socket.listeners('match:result-updated').length === 0) {
        socket.disconnect();
      }
    };
  }, [onMatchUpdated]);
}
