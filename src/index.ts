import { GameState, GlobalEvent, MatchEvent, LanguageIso } from './types';
import { parseGameState, parseGlobalEvent, parseMatchEvent } from './parsers';
import { translate, Client } from './services';

const skipLanguages = [
  LanguageIso.English,
  LanguageIso.Swedish,
  LanguageIso.Danish,
  LanguageIso.Norwegian,
];

let gameState = GameState.Initial;
let playerNames = [];

const client = new Client(1338, '127.0.0.1');
client.addListener(async (message: string) => {
  switch (parseGlobalEvent(message)) {
    case GlobalEvent.GameStateChanged:
      gameState = parseGameState(message);
      console.log('GameState:', gameState);
      break;
    default:
      switch (gameState) {
        case GameState.Match:
          const matchEvent = parseMatchEvent(message);
          switch (matchEvent.event) {
            case MatchEvent.Message:
              const [playerName, playerMessage] = matchEvent.value;
              const translation = await translate(LanguageIso.English, playerMessage);
              if(translation && !skipLanguages.some(lang => lang === translation.language)) {
                console.log('Translation', playerName, translation.text);
              }
              break;
            case MatchEvent.PlayerConnected:
              console.log('player connected:', matchEvent.value);
              break;
            case MatchEvent.PlayerDisconnected:
              console.log('Player disconnected:', matchEvent.value);
              break;
            default:
              // todo (MIKAEL): Handle unmapped match events
              break;
          }
          break;
      }
      break;
  }
});

client.connect();
