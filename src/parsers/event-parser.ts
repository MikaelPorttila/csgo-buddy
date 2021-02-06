import { MatchEvent, GlobalEvent, EventWrapper } from '../types';

export function parseMatchEvent(message: string): EventWrapper<MatchEvent> {
  let event = MatchEvent.Unknown;
  let args: string | string[] = '';
  if (message.endsWith(MatchEvent.PlayerConnected)) {
    event = MatchEvent.PlayerConnected;
    args = message
      .substr(0, message.length - MatchEvent.PlayerConnected.length)
      .trim();
  } else if (message.startsWith(MatchEvent.DamageGiven)) {
    event = MatchEvent.DamageGiven;
    const [playerName, hit] = message
      .substr(MatchEvent.DamageGiven.length)
      .trim()
      .split(' - ');
    const [damage, numberOfHits] = hit.split('in').map((x) => x.trim());
    args = [playerName, damage, numberOfHits];
  } else if (message.startsWith(MatchEvent.DamageTaken)) {
    event = MatchEvent.DamageTaken;
    const [playerName, hit] = message
      .substr(MatchEvent.DamageTaken.length)
      .trim()
      .split(' - ');
    const [damage, numberOfHits] = hit.split('in').map((x) => x.trim());
    args = [playerName, damage, numberOfHits];
  } else if (message.indexOf(MatchEvent.Message) !== -1) {
    event = MatchEvent.Message;
    args = message.split(MatchEvent.Message);
  }

  const result = new EventWrapper<MatchEvent>(event, args);
  return result;
}

export function parseGlobalEvent(message: string): GlobalEvent {
  if (message.startsWith(GlobalEvent.GameStateChanged)) {
    return GlobalEvent.GameStateChanged;
  } else {
    return GlobalEvent.Unknown;
  }
}
