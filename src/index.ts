#!/usr/bin/env node
import { GameState, GlobalEvent, MatchEvent, LanguageIso } from './types';
import { parseGameState, parseGlobalEvent, parseMatchEvent } from './parsers';
import { translate, Client } from './services';

console.log(
  '\x1b[32m',
  `
_______  _______  _______  _______    _______  __   __  ______   ______   __   __ 
|       ||       ||       ||       |  |  _    ||  | |  ||      | |      | |  | |  |
|       ||  _____||    ___||   _   |  | |_|   ||  | |  ||  _    ||  _    ||  |_|  |
|       || |_____ |   | __ |  | |  |  |       ||  |_|  || | |   || | |   ||       |
|      _||_____  ||   ||  ||  |_|  |  |  _   | |       || |_|   || |_|   ||_     _|
|     |_  _____| ||   |_| ||       |  | |_|   ||       ||       ||       |  |   |  
|_______||_______||_______||_______|  |_______||_______||______| |______|   |___|  
`
);

const skipLanguages: { [id: string]: boolean } = {};
skipLanguages[LanguageIso.English] = true;
skipLanguages[LanguageIso.Swedish] = true;
skipLanguages[LanguageIso.Danish] = true;
skipLanguages[LanguageIso.Norwegian] = true;

let gameState = GameState.Initial;

// TODO: port and/or host as parameters.
const client = new Client(1337, '127.0.0.1');
client.addListener(async (message: string) => {
  const globalEvent = parseGlobalEvent(message); 
  switch (globalEvent.event) {
    case GlobalEvent.GameStateChanged:
      gameState = parseGameState(globalEvent.value as string);
      break;
    case GlobalEvent.Message:
      const [player, msg] = (globalEvent.value as string[]);
      const { text, language } = await translate(LanguageIso.English, msg);

      if (!skipLanguages[language]) {
        const translationKey = '[msg]';
        const translatedPlayerMessage = `${translationKey} ${player}: ${text}`;
        console.log(translatedPlayerMessage);
        client.send(
          'developer 1',
          'con_filter_enable 2',
          `con_filter_text "${translationKey}"`,
          `echo "${translatedPlayerMessage}"`
        );
      }
      break;
    default:
      // disable match event parsing for now.
      break;
      switch (gameState) {
        case GameState.Match:
          const matchEvent = parseMatchEvent(message);
          switch (matchEvent.event) {
            case MatchEvent.PlayerConnected:
              // todo: Do something fun with this.
              break;
            case MatchEvent.PlayerDisconnected:
              // todo: Do something fun with this.
              break;
            default:
              break;
          }
          break;
      }
      break;
  }
});

client.connect();
