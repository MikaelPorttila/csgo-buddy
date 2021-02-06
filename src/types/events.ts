export enum MatchEvent {
  Unknown = '',
  Message = ' : ',
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
  GameStateChanged = 'ChangeGameUIState',
}

export class EventWrapper<T extends MatchEvent | LobbyEvent | GlobalEvent> {
  constructor(
    public event: T,
    public value: string | string[]
  ) {}
}
