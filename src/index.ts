import { GameState, GlobalEvent, MatchEvent, Language } from './types';
import { parseGameState, parseGlobalEvent, parseMatchEvent } from './parsers';
import { translate, detectLanguage, Client } from './services';

let gameState = GameState.Initial;
let playerNames = [];

const client = new Client(1338, '127.0.0.1');
client.addListener((message: string) => {
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
              const language = detectLanguage(playerMessage);

              switch (language) {
                case Language.Ruski:
                  translate('en', playerMessage).then((translatedMessage) => {
                    console.log(
                      'translated:',
                      playerMessage,
                      'to:',
                      translatedMessage
                    );
                  });
                  break;
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
