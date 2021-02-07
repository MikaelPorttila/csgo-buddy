#!/usr/bin/env node
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __commonJS = (callback, module2) => () => {
  if (!module2) {
    module2 = {exports: {}};
    callback(module2.exports, module2);
  }
  return module2.exports;
};
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

// node_modules/arg/index.js
var require_arg = __commonJS((exports2, module2) => {
  var flagSymbol = Symbol("arg flag");
  var ArgError = class extends Error {
    constructor(msg, code) {
      super(msg);
      this.name = "ArgError";
      this.code = code;
      Object.setPrototypeOf(this, ArgError.prototype);
    }
  };
  function arg2(opts, {argv: argv2 = process.argv.slice(2), permissive = false, stopAtPositional = false} = {}) {
    if (!opts) {
      throw new ArgError("argument specification object is required", "ARG_CONFIG_NO_SPEC");
    }
    const result = {_: []};
    const aliases = {};
    const handlers = {};
    for (const key of Object.keys(opts)) {
      if (!key) {
        throw new ArgError("argument key cannot be an empty string", "ARG_CONFIG_EMPTY_KEY");
      }
      if (key[0] !== "-") {
        throw new ArgError(`argument key must start with '-' but found: '${key}'`, "ARG_CONFIG_NONOPT_KEY");
      }
      if (key.length === 1) {
        throw new ArgError(`argument key must have a name; singular '-' keys are not allowed: ${key}`, "ARG_CONFIG_NONAME_KEY");
      }
      if (typeof opts[key] === "string") {
        aliases[key] = opts[key];
        continue;
      }
      let type = opts[key];
      let isFlag = false;
      if (Array.isArray(type) && type.length === 1 && typeof type[0] === "function") {
        const [fn] = type;
        type = (value, name, prev = []) => {
          prev.push(fn(value, name, prev[prev.length - 1]));
          return prev;
        };
        isFlag = fn === Boolean || fn[flagSymbol] === true;
      } else if (typeof type === "function") {
        isFlag = type === Boolean || type[flagSymbol] === true;
      } else {
        throw new ArgError(`type missing or not a function or valid array type: ${key}`, "ARG_CONFIG_VAD_TYPE");
      }
      if (key[1] !== "-" && key.length > 2) {
        throw new ArgError(`short argument keys (with a single hyphen) must have only one character: ${key}`, "ARG_CONFIG_SHORTOPT_TOOLONG");
      }
      handlers[key] = [type, isFlag];
    }
    for (let i = 0, len = argv2.length; i < len; i++) {
      const wholeArg = argv2[i];
      if (stopAtPositional && result._.length > 0) {
        result._ = result._.concat(argv2.slice(i));
        break;
      }
      if (wholeArg === "--") {
        result._ = result._.concat(argv2.slice(i + 1));
        break;
      }
      if (wholeArg.length > 1 && wholeArg[0] === "-") {
        const separatedArguments = wholeArg[1] === "-" || wholeArg.length === 2 ? [wholeArg] : wholeArg.slice(1).split("").map((a) => `-${a}`);
        for (let j = 0; j < separatedArguments.length; j++) {
          const arg3 = separatedArguments[j];
          const [originalArgName, argStr] = arg3[1] === "-" ? arg3.split(/=(.*)/, 2) : [arg3, void 0];
          let argName = originalArgName;
          while (argName in aliases) {
            argName = aliases[argName];
          }
          if (!(argName in handlers)) {
            if (permissive) {
              result._.push(arg3);
              continue;
            } else {
              throw new ArgError(`unknown or unexpected option: ${originalArgName}`, "ARG_UNKNOWN_OPTION");
            }
          }
          const [type, isFlag] = handlers[argName];
          if (!isFlag && j + 1 < separatedArguments.length) {
            throw new ArgError(`option requires argument (but was followed by another short argument): ${originalArgName}`, "ARG_MISSING_REQUIRED_SHORTARG");
          }
          if (isFlag) {
            result[argName] = type(true, argName, result[argName]);
          } else if (argStr === void 0) {
            if (argv2.length < i + 2 || argv2[i + 1].length > 1 && argv2[i + 1][0] === "-" && !(argv2[i + 1].match(/^-?\d*(\.(?=\d))?\d*$/) && (type === Number || typeof BigInt !== "undefined" && type === BigInt))) {
              const extended = originalArgName === argName ? "" : ` (alias for ${argName})`;
              throw new ArgError(`option requires argument: ${originalArgName}${extended}`, "ARG_MISSING_REQUIRED_LONGARG");
            }
            result[argName] = type(argv2[i + 1], argName, result[argName]);
            ++i;
          } else {
            result[argName] = type(argStr, argName, result[argName]);
          }
        }
      } else {
        result._.push(wholeArg);
      }
    }
    return result;
  }
  arg2.flag = (fn) => {
    fn[flagSymbol] = true;
    return fn;
  };
  arg2.COUNT = arg2.flag((v, name, existingCount) => (existingCount || 0) + 1);
  arg2.ArgError = ArgError;
  module2.exports = arg2;
});

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
var CommandArg;
(function(CommandArg2) {
  CommandArg2["Language"] = "--lang";
  CommandArg2["Port"] = "--port";
  CommandArg2["Host"] = "--host";
})(CommandArg || (CommandArg = {}));

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
  let args = null;
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
  }
  const result = new EventWrapper(event, args);
  return result;
}
function parseGlobalEvent(message) {
  let event = GlobalEvent.Unknown;
  let args = null;
  if (message.startsWith(GlobalEvent.GameStateChanged)) {
    event = GlobalEvent.GameStateChanged;
    args = message.substr(GlobalEvent.GameStateChanged.length);
  } else if (message.indexOf(GlobalEvent.Message) !== -1) {
    event = GlobalEvent.Message;
    args = message.split(GlobalEvent.Message);
  } else {
    event = GlobalEvent.Unknown;
  }
  const result = new EventWrapper(event, args);
  return result;
}

// src/services/client.ts
var import_net = __toModule(require("net"));
var Client = class {
  constructor(port2, host2) {
    this.port = port2;
    this.host = host2;
    this.connectionOpen = false;
    this.socket = new import_net.Socket();
    this.socket.addListener("error", () => {
      this.connectionOpen = false;
      console.error("Failed to connect to CSGO.", `
Start CSGO and make sure that you add launch option: -netconport ${this.port}`);
    });
  }
  connect() {
    console.log("Connecting...");
    return this.socket.connect(this.port, this.host, () => {
      this.connectionOpen = true;
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
var import_arg = __toModule(require_arg());
console.log("[32m", `
 _______  _______  _______  _______    _______  __   __  ______   ______   __   __ 
|       ||       ||       ||       |  |  _    ||  | |  ||      | |      | |  | |  |
|       ||  _____||    ___||   _   |  | |_|   ||  | |  ||  _    ||  _    ||  |_|  |
|       || |___ _ |   | __ |  | |  |  |       ||  |_|  || | |   || | |   ||       |
|      _||_____  ||   ||  ||  |_|  |  |  _   | |       || |_|   || |_|   ||_     _|
|     |_  _____| ||   |_| ||       |  | |_|   ||       ||       ||       |  |   |  
|_______||_______||_______||_______|  |_______||_______||______| |______|   |___|  
`);
var argv = import_arg.default({
  "--port": Number,
  "--host": String,
  "--lang": String,
  "-p": "--port",
  "-h": "--host",
  "-l": "--lang"
});
var port = argv[CommandArg.Port] || 1337;
var host = argv[CommandArg.Host] || "127.0.0.1";
var lang = argv[CommandArg.Language];
var skipLanguages = {};
for (const language of lang ? lang.split(",") : [
  LanguageIso.English,
  LanguageIso.Swedish,
  LanguageIso.Danish,
  LanguageIso.Norwegian
]) {
  skipLanguages[language] = true;
}
var gameState = GameState.Initial;
var client = new Client(port, host);
client.addListener(async (message) => {
  const globalEvent = parseGlobalEvent(message);
  switch (globalEvent.event) {
    case GlobalEvent.GameStateChanged:
      gameState = parseGameState(globalEvent.value);
      break;
    case GlobalEvent.Message:
      const [player, msg] = globalEvent.value;
      const {text, language} = await translate(LanguageIso.English, msg);
      if (!skipLanguages[language]) {
        const translationKey = "[msg]";
        const translatedPlayerMessage = `${translationKey} ${player}: ${text}`;
        console.log(translatedPlayerMessage);
        client.send("developer 1", "con_filter_enable 2", `con_filter_text "${translationKey}"`, `echo "${translatedPlayerMessage}"`);
      }
      break;
    default:
      break;
      switch (gameState) {
        case GameState.Match:
          const matchEvent = parseMatchEvent(message);
          switch (matchEvent.event) {
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
