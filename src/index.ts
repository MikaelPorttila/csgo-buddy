#!/usr/bin/env node
import { GameState, GlobalEvent, MatchEvent, LanguageIso } from './types';
import { parseGameState, parseGlobalEvent, parseMatchEvent } from './parsers';
import { translate, Client } from './services';

console.log("\x1b[32m", `
_______  _______  _______  _______    _______  __   __  ______   ______   __   __ 
|       ||       ||       ||       |  |  _    ||  | |  ||      | |      | |  | |  |
|       ||  _____||    ___||   _   |  | |_|   ||  | |  ||  _    ||  _    ||  |_|  |
|       || |_____ |   | __ |  | |  |  |       ||  |_|  || | |   || | |   ||       |
|      _||_____  ||   ||  ||  |_|  |  |  _   | |       || |_|   || |_|   ||_     _|
|     |_  _____| ||   |_| ||       |  | |_|   ||       ||       ||       |  |   |  
|_______||_______||_______||_______|  |_______||_______||______| |______|   |___|  
`);


const skipLanguages = [
  LanguageIso.English,
  LanguageIso.Swedish,
  LanguageIso.Danish,
  LanguageIso.Norwegian,
];

let gameState = GameState.Initial;
let playerNames = [];

// TODO: port and/or host as parameters.
const client = new Client(1337, '127.0.0.1');
client.addListener(async (message: string) => {
  switch (parseGlobalEvent(message)) {
    case GlobalEvent.GameStateChanged:
      gameState = parseGameState(message);
      break;
    default:
      switch (gameState) {
        case GameState.Match:
          const matchEvent = parseMatchEvent(message);
          switch (matchEvent.event) {
            case MatchEvent.Message:
              const [playerName, playerMessage] = matchEvent.value;
              const translation = await translate(
                LanguageIso.English,
                playerMessage
              );
              if (
                translation &&
                !skipLanguages.some((lang) => lang === translation.language)
              ) {
                const translationKey = '[t]';
                const translatedPlayerMessage = `${translationKey} ${playerName}: ${translation.text}`;
                console.log(translatedPlayerMessage);
                client.send(
                  'developer 1',
                  'con_filter_enable 2',
                  `con_filter_text "${translationKey}"`,
                  `echo "${translatedPlayerMessage}"`
                );
              }
              break;
            case MatchEvent.PlayerConnected:
              // todo: Do something fun with this.
              // console.log('player connected:', matchEvent.value);
              break;
            case MatchEvent.PlayerDisconnected:
              // todo: Do something fun with this.
              // console.log('Player disconnected:', matchEvent.value);
              break;
            default:
              // todo: Handle unmapped match events
              break;
          }
          break;
      }
      break;
  }
});

client.connect();
