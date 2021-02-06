import { GameUiState } from '../types';

export function parseGameState(message: string): GameUiState {
  const split = message.split('->');
  switch(split[1].trim()) {
    case GameUiState.Match:
      return GameUiState.Match;
    case GameUiState.LoadingScreen:
      return GameUiState.LoadingScreen;
    case GameUiState.MainMenu:
      return GameUiState.MainMenu;
    case GameUiState.PauseMenu:
      return GameUiState.PauseMenu;
    default:
      return GameUiState.Unknown;
  }
}