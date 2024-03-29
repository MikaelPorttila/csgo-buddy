#!/usr/bin/env node
import {
  CommandArg,
  GlobalEvent,
  LanguageIso,
} from "./types";
import { parseGlobalEvent } from "./parsers";
import { Client, translate } from "./services";
import arg from "arg";

console.log(
  "\x1b[32m",
  `
 _______  _______  _______  _______    _______  __   __  ______   ______   __   __ 
|       ||       ||       ||       |  |  _    ||  | |  ||      | |      | |  | |  |
|       ||  _____||    ___||   _   |  | |_|   ||  | |  ||  _    ||  _    ||  |_|  |
|       || |___ _ |   | __ |  | |  |  |       ||  |_|  || | |   || | |   ||       |
|      _||_____  ||   ||  ||  |_|  |  |  _   | |       || |_|   || |_|   ||_     _|
|     |_  _____| ||   |_| ||       |  | |_|   ||       ||       ||       |  |   |  
|_______||_______||_______||_______|  |_______||_______||______| |______|   |___|  
`,
);

const argv = arg({
  // Arguments
  "--port": Number,
  "--host": String,
  "--lang": String,
  // Aliases
  "-p": "--port",
  "-h": "--host",
  "-l": "--lang",
});

const port = argv[CommandArg.Port] || 1337;
const host = argv[CommandArg.Host] || "127.0.0.1";
const lang = argv[CommandArg.Language];
const skipLanguages: { [id: string]: boolean } = {};

for (
  const language of lang
    ? (lang as string).split(",")
    : [
      LanguageIso.English,
      LanguageIso.Swedish,
      LanguageIso.Danish,
      LanguageIso.Norwegian,
    ]
) {
  skipLanguages[language] = true;
}

const client = new Client(port, host);
client.addListener(async (message: string) => {
  const globalEvent = parseGlobalEvent(message);
  switch (globalEvent.event) {
    case GlobalEvent.Message: {
      const [player, msg] = globalEvent.value as string[];
      const { text, language } = await translate(LanguageIso.English, msg);

      if (!skipLanguages[language]) {
        const translationKey = "[msg]";
        const translatedPlayerMessage = `${translationKey} ${player}: ${text}`;
        console.log(translatedPlayerMessage);
        client.send(
          "developer 1",
          "con_filter_enable 2",
          `con_filter_text "${translationKey}"`,
          `echo "${translatedPlayerMessage}"`,
        );
      }
      break;
    }
  }
});

client.connect();
