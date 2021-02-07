export enum MatchEvent {
  Unknown = '',
  PlayerConnected = 'connected.',
  PlayerDisconnected = 'disconnected.',
  DamageGiven = 'Damage Given to',
  DamageTaken = 'Damage Taken from'
}

export enum LobbyEvent {
  PlayerJoined = '',
}

export enum GlobalEvent {
  Unknown = '',
  Message = ' : ',
  GameStateChanged = 'ChangeGameUIState',
}

export type EventValue = string | string[] | null;
export class EventWrapper<T extends MatchEvent | LobbyEvent | GlobalEvent> {
  constructor(
    public event: T,
    public value: EventValue
  ) {}
}
