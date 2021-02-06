#!/usr/bin/env node
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __exportStar = (target, module2, desc) => {
  __markAsModule(target);
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  if (module2 && module2.__esModule)
    return module2;
  return __exportStar(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", {value: module2, enumerable: true}), module2);
};

// src/types/game-state.ts
var GameState;
(function(GameState2) {
  GameState2["Initial"] = "";
  GameState2["Unknown"] = "Unknown";
  GameState2["Match"] = "CSGO_GAME_UI_STATE_INGAME";
  GameState2["PauseMenu"] = "CSGO_GAME_UI_STATE_PAUSEMENU";
  GameState2["MainMenu"] = "CSGO_GAME_UI_STATE_MAINMENU";
  GameState2["LoadingScreen"] = "CSGO_GAME_UI_STATE_LOADINGSCREEN";
})(GameState || (GameState = {}));

// src/types/events.ts
var MatchEvent;
(function(MatchEvent2) {
  MatchEvent2["Unknown"] = "";
  MatchEvent2["Message"] = " : ";
  MatchEvent2["PlayerConnected"] = "connected.";
  MatchEvent2["PlayerDisconnected"] = "disconnected.";
  MatchEvent2["DamageGiven"] = "Damage Given to";
  MatchEvent2["DamageTaken"] = "Damage Taken from";
})(MatchEvent || (MatchEvent = {}));
var LobbyEvent;
(function(LobbyEvent2) {
  LobbyEvent2["PlayerJoined"] = "";
})(LobbyEvent || (LobbyEvent = {}));
var GlobalEvent;
(function(GlobalEvent2) {
  GlobalEvent2["Unknown"] = "";
  GlobalEvent2["Message"] = " : ";
  GlobalEvent2["GameStateChanged"] = "ChangeGameUIState";
})(GlobalEvent || (GlobalEvent = {}));
var EventWrapper = class {
  constructor(event, value) {
    this.event = event;
    this.value = value;
  }
};

// src/types/enums.ts
var Language;
(function(Language2) {
  Language2["Ruski"] = "russian";
})(Language || (Language = {}));
var LanguageIso;
(function(LanguageIso3) {
  LanguageIso3["English"] = "en";
  LanguageIso3["Russia"] = "ru";
  LanguageIso3["Swedish"] = "sv";
  LanguageIso3["Danish"] = "da";
  LanguageIso3["Norwegian"] = "no";
})(LanguageIso || (LanguageIso = {}));

// src/types/translation.ts
var Translation = class {
  constructor(language, text) {
    this.language = language;
    this.text = text;
  }
};

// src/parsers/game-state-parser.ts
function parseGameState(message) {
  const split = message.split("->");
  switch (split[1].trim()) {
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

// src/parsers/event-parser.ts
function parseMatchEvent(message) {
  let event = MatchEvent.Unknown;
  let args = "";
  if (message.endsWith(MatchEvent.PlayerConnected)) {
    event = MatchEvent.PlayerConnected;
    args = message.substr(0, message.length - MatchEvent.PlayerConnected.length).trim();
  } else if (message.startsWith(MatchEvent.DamageGiven)) {
    event = MatchEvent.DamageGiven;
    const [playerName, hit] = message.substr(MatchEvent.DamageGiven.length).trim().split(" - ");
    const [damage, numberOfHits] = hit.split("in").map((x) => x.trim());
    args = [playerName, damage, numberOfHits];
  } else if (message.startsWith(MatchEvent.DamageTaken)) {
    event = MatchEvent.DamageTaken;
    const [playerName, hit] = message.substr(MatchEvent.DamageTaken.length).trim().split(" - ");
    const [damage, numberOfHits] = hit.split("in").map((x) => x.trim());
    args = [playerName, damage, numberOfHits];
  } else if (message.indexOf(MatchEvent.Message) !== -1) {
    event = MatchEvent.Message;
    args = message.split(MatchEvent.Message);
  }
  const result = new EventWrapper(event, args);
  return result;
}
function parseGlobalEvent(message) {
  if (message.startsWith(GlobalEvent.GameStateChanged)) {
    return GlobalEvent.GameStateChanged;
  } else {
    return GlobalEvent.Unknown;
  }
}

// src/services/client.ts
var import_net = __toModule(require("net"));
var Client = class {
  constructor(port, host) {
    this.port = port;
    this.host = host;
    this.socket = new import_net.Socket();
  }
  connect() {
    console.log("Connecting...");
    return this.socket.connect(this.port, this.host, () => {
      console.log("Connected!");
    });
  }
  send(...messages) {
    for (const message of messages) {
      this.socket.write(`${message}\r
`);
    }
  }
  addListener(handler) {
    this.socket.addListener("data", (data) => {
      if (data && handler) {
        const message = data.toString("utf8");
        handler(message);
      }
    });
  }
};

// src/services/translate.ts
var https = __toModule(require("https"));
var translationCache = {};
async function translate(language, message) {
  return new Promise((resolve, reject) => {
    const cacheResult = translationCache[message];
    if (cacheResult) {
      resolve(cacheResult);
      return;
    }
    const encodedMessage = encodeURIComponent(message);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${language}&dt=t&q=${encodedMessage}`;
    https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => data += chunk);
      res.on("end", () => {
        const response = JSON.parse(data);
        const [translation, _, language2, __] = response;
        const [engText, originalText] = translation[0];
        const result = new Translation(language2, engText);
        translationCache[message] = result;
        resolve(result);
      });
      res.on("error", () => {
        console.log("failed to translate", message);
        reject();
      });
    });
  });
}

// src/index.ts
console.log("[32m", `
_______  _______  _______  _______    _______  __   __  ______   ______   __   __ 
|       ||       ||       ||       |  |  _    ||  | |  ||      | |      | |  | |  |
|       ||  _____||    ___||   _   |  | |_|   ||  | |  ||  _    ||  _    ||  |_|  |
|       || |_____ |   | __ |  | |  |  |       ||  |_|  || | |   || | |   ||       |
|      _||_____  ||   ||  ||  |_|  |  |  _   | |       || |_|   || |_|   ||_     _|
|     |_  _____| ||   |_| ||       |  | |_|   ||       ||       ||       |  |   |  
|_______||_______||_______||_______|  |_______||_______||______| |______|   |___|  
`);
var skipLanguages = [
  LanguageIso.English,
  LanguageIso.Swedish,
  LanguageIso.Danish,
  LanguageIso.Norwegian
];
var gameState = GameState.Initial;
var client = new Client(1337, "127.0.0.1");
client.addListener(async (message) => {
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
              const translation = await translate(LanguageIso.English, playerMessage);
              if (translation && !skipLanguages.some((lang) => lang === translation.language)) {
                const translationKey = "[t]";
                const translatedPlayerMessage = `${translationKey} ${playerName}: ${translation.text}`;
                console.log(translatedPlayerMessage);
                client.send("developer 1", "con_filter_enable 2", `con_filter_text "${translationKey}"`, `echo "${translatedPlayerMessage}"`);
              }
              break;
            case MatchEvent.PlayerConnected:
              break;
            case MatchEvent.PlayerDisconnected:
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
