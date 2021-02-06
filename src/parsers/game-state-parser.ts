import { GameState } from '../types';

export function parseGameState(message: string): GameState {
  const split = message.split('->');
  switch(split[1].trim()) {
    case GameState.Match:
      return GameState.Match;
    case GameState.LoadingScreen:
      return GameState.LoadingScreen;
    case GameState.MainMenu:
      return GameState.MainMenu;
    case GameState.PauseMenu:
      return GameState.PauseMenu;
    default:
      return GameState.Unknown;
  }
}