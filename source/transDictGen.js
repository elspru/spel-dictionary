#!/usr/bin/node
////////////////////////////////////////////////////////////////
//          0x10            0x20            0x30            0x40
//3456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0
//      10        20        30        40        50        60  64
//34567890123456789012345678901234567890123456789012345678901234
////////////////////////////////////////////////////////////////
/// be file sh for generate new word for concept ya
/// su speakable programming for every language be title ya
/// su la AGPL-3 be license ya
/// be end of head ya
///
"use strict";
var io = require("../../lib/io"),
  langWords = JSON.parse(io.fileRead("langWords-mega.json")),
  transObjX = JSON.parse(io.fileRead("genTransX.json")),
  uniqueObjX = JSON.parse(io.fileRead("unique-mega.json")),
  blacklist = uniqueObjX.blacklist,
  rootList = langWords.rootList,
  gramList = langWords.gramList;

function produce_dictionary(language_code) {
  var dictionary = {};
  var pyash_dativeCase = {};
  var pyash_ablativeCase = {};
  var regional_blacklist = {};
  var translation = "";
  var cardinalWords = Object.keys(rootList);
  var blacklistWords = Object.keys(blacklist);
  //console.log("cw " +  cardinalWords);
  cardinalWords.forEach(function (word) {
    translation = transObjX[word][language_code] && 
                  transObjX[word][language_code].replace(/[ \-]/g,"_");
    if (!translation) { return };
    if (gramList[word]) {
      pyash_dativeCase["X" + translation] = rootList[word][0];
      pyash_dativeCase["X_" + translation] = gramList[word][0];
      if(!pyash_dativeCase["X_" + translation.substring(0,3)]) {
        pyash_dativeCase["X_" + translation.substring(0,3)] = gramList[word][0];
        pyash_ablativeCase["X" + gramList[word][0]] = "_" +
                    translation.substring(0,3);
      } else {
        pyash_dativeCase["X_" + translation] = gramList[word][0];
        pyash_ablativeCase["X" + gramList[word][0]] = "_" + translation;
      }
      pyash_ablativeCase["X" + rootList[word][0]] = translation;
      console.log("gl " + gramList[word][0] + " " + translation);
    } else {
      pyash_dativeCase["X" + translation] = rootList[word][0];
      pyash_ablativeCase["X" + rootList[word][0]] = translation;
      console.log("rl " + rootList[word][0] + " " + translation);
    }
  });
  blacklistWords.forEach(function (word) {
    translation =  transObjX[word][language_code] && 
                   transObjX[word][language_code].replace(/[ \-]/g,"_");
    regional_blacklist["X" + translation] = word.substring(1);
    console.log("bt " + translation);
  });
  dictionary.pyash_dativeCase = pyash_dativeCase;
  dictionary.pyash_ablativeCase = pyash_ablativeCase;
  dictionary.blacklist = regional_blacklist;
  return dictionary;
}

function cardinal() {
  var dictionary = {};
  dictionary.en = produce_dictionary("en");
  dictionary.de = produce_dictionary("de");
  dictionary.fr = produce_dictionary("fr");
  dictionary.es = produce_dictionary("es");
  dictionary.ru = produce_dictionary("ru");
  dictionary.zh = produce_dictionary("zh");
  dictionary.hi = produce_dictionary("hi");
  io.fileWrite("dictionary.json",JSON.stringify(dictionary));
}

cardinal();
