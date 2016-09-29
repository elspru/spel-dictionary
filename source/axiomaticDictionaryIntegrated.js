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
/*\section{Algortihm}
load axiomatic words
load root words and blacklist

generate axiomatic words to root words translation
if axiomatic word not in root words, 
then find suggestions in black list,
ask user to finalize selection.
*/
const readline = require('readline-sync');

var io = require("../../lib/io"),
  langWords = JSON.parse(io.fileRead("langWords-mega.json")),
  transObjX = JSON.parse(io.fileRead("genTransX.json")),
  axiomaticWords = io.fileRead("axiomaticDictionary.txt").split("\n"),
  axiomaticDictionary = JSON.parse(io.fileRead("axiomaticDictionary.json")),
  uniqueObjX = JSON.parse(io.fileRead("unique-mega.json")),
  blacklist = uniqueObjX.blacklist,
  rootList = langWords.rootList,
  gramList = langWords.gramList,
  done = axiomaticDictionary.done;

// hcot tu  tu di tu

function approvedEnWords(word) {
  if (rootList["X" + word] !== undefined) {
    return true;
  }
  return false;
}

function blacklistRecovery(word) {
  var bentry = blacklist["X" + word];
  var result = [];
  if (bentry) {
    // assumed dictionary results in pyash word
    if (Array.isArray(bentry)) {
      //console.log(bentry.filter(approvedEnWords));
      result = bentry.filter(approvedEnWords);
    }
  }
  return result;
}

function cardinal() {
  function getInput(suggestArray) {
    var question = word + " " + JSON.stringify(suggestArray) +
      "\n default: " + suggestArray[0] + "\n>";
    var input = "";
    var i = 0;
    for (; i < 5; i++) {
      input = readline.question(question);
      // check input is valid, if not ask again.
      if (input === "" || rootList["X" + input] !== undefined) {
        return input;
      }
      console.log("failed to get valid response");
    }
  }
  var suggestArray = [];
  if (done === undefined) {
    done = [];
  }
  axiomaticWords.forEach(function(word) {
    // check if axiomatic word is a root word
    if (axiomaticDictionary["X" + word] !== undefined) {
      return;
    }
    if (rootList["X" + word] !== undefined) {
      axiomaticDictionary["X" + word] = word;
      done.push(word);
      console.log(word + " " +  word);
    } else {
      // check if word already added, then return
      if (blacklist["X" + word] !== undefined) {
        suggestArray = blacklistRecovery(word);
      }
      if (suggestArray.length === 1) {
        axiomaticDictionary["X" + word] = suggestArray[0];
        done.push(word);
      } else if (suggestArray.length > 1 || suggestArray.length === 0) {
        // ask user to confirm
        var question = word + " " + JSON.stringify(suggestArray) +
          "\n default: " + suggestArray[0] + "\n>";
        var input = "";
        var i = 0;
        for (; i < 5; i++) {
          input = readline.question(question);
          // check input is valid, if not ask again.
          if (input === "" || rootList["X" + input] !== undefined) {
            break;
          }
          console.log("failed to get valid response");
        }
        if (input.length === 0) {
          axiomaticDictionary["X" + word] = suggestArray[0];
          done.push(word);
          console.log(word + " " + suggestArray[0]);
        } else {
          axiomaticDictionary["X" + word] = input;
          done.push(word);
          console.log(input);

        }
      }
    }
    axiomaticDictionary.done = done;
    io.fileWrite("axiomaticDictionary.json", JSON.stringify(
      axiomaticDictionary));
  });
}
cardinal();
