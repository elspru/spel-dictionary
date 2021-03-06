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
//  su pre-sort de
//  su list of english words to make into root words be input ya
//  and su frequency list of english words be input ya
//  su be sort ob first list to correspond to second list ya
//  su each word in sequence root word generate ya
//
//  su basic root word finding algorithm de
//  su english concept word be input argument ya
//  su word definitions be modified ya
//  su source language translation via trans 
//      ob Chinese (Sino-Tibetan) 1030 and
//      ob English (IE, West Germanic) 840 and
//      ob Spanish (IE, Romance) 490 and
//      ob Hindi  (IE, Indo-Aryan) 380 and
//      ob Arabic (Afro-Asiatic) 490 and
//      ob Indonesian (Austronesian) and
//      ob Russian (IE, Slavic) and
//      ob Swahili (Niger-Congo) and
//      ob Swedish (IE, North Germanic) and
//      ob Turkish (Turkic) and
//      ob Finnish (Uralic) and
//      ob Farsi (IE, Indo-Iranian) and
//      ob Tamil (Dravidian) and
//      ob Georgian (Kartvelian) and
//      ob Welsh (IE, Celtic) and
//      ob Greek (IE, Hellenic) ya
//  su translations be stored in dataset ya
//  su phoneme translation via espeak ya
//  su phoneme translations be stored in dataset ya
//  su phoneme equivalncy function by language weight be output 
//      ob phoneme frequency and
//      ob starting consonants and
//      ob middle consonants and
//      ob ending consonants and
//      ob dominant vowel ya
//  su list of possible words be generated ya
//  su list of available words be found from word definitions ya
//  su possible and available words be intersected ya
//  su top word be used for definition ya


var io = require("../../lib/io"),
    hof = require("../../lib/hof"),
    specialWords = [],
    rootBlacklist,
    Entry = function () {
    //      ob Chinese (Sino-Tibetan) 1030 and
        this.zh = "";
    //      ob English (IE, West Germanic) 840 and
        this.en = "";
    //      ob Spanish (IE, Romance) 490 and
        this.es = "";
    //      ob Hindi  (IE, Indo-Aryan) 380 and
        this.hi = "";
    //      ob Arabic (Afro-Asiatic) 490 and
        this.ar = "";
    //      ob Indonesian (Austronesian) and
        this.id = "";
    //      ob Russian (IE, Slavic) and
        this.ru = "";
    //      ob Swahili (Niger-Congo) and
        this.sw = "";
    //      ob Swedish (IE, North Germanic) and
        this.sv = "";
    //      ob Turkish (Turkic) and
        this.tr = "";
    //      ob Finnish (Uralic) and
        this.fi = "";
    //      ob Farsi (IE, Indo-Iranian) and
        this.fa = "";
    //      ob Tamil (Dravidian) and
        this.ta = "";
    //      ob Georgian (Kartvelian) and
        this.ka = "";
    //      ob Welsh (IE, Celtic) and
        this.cy = "";
    //      ob Greek (IE, Hellenic) ya
        this.el = "";
    },
    allTransLangs = [
        "zh", "en", "hi", "sw",   "id", "es", "ar", "bn", 
        "ru", "ko", "pt", "tr",   "pa", /*"vi",*/ "de", "fa", 

        "fr", "mr", "ta", "te",   "gu", "ur", "am", "it", 
        "pl", "kn", "ml", "my",   "ro", "az", "nl", "hu", 

        "ku", "si", "ne", "el",   "cs", "sv", /*"ka",*/ "th",
        "fi", 
        ],
    allPhonLangs = ["en", "zh", "hi", "sw", "de", "sv", "ar",
        "id", "vi", "tr", "ru", "ta", "fa", "fr", "pt", "it",
        "fi", "el", /*"ka",*/ "cy", "pl", "sr", "lt", "zhy", "es",
        "th"],
    PhonEntry = function () {
        this.en = "";
        //allPhonLangs.forEach(function (code) {
        //    this[code] = "";
        //});
    };

function removeBlacklisted(wordLines, blacklist) {
    return wordLines.filter(function (line) {
        var word = line[0];
        if (blacklist.indexOf(word) === -1) {
            return true;
        } 
        console.log(word + " removed");
        return false;
    });
}
function stringToWordLines(string) {
    function lineToWords(line) {
        return line.split(" ");
    }
    var lines = string.split("\n"),
        wordLines = lines.map(lineToWords);
    return wordLines;
}

function wordLinesToString(wordLines) {
    function joinWords(lineArray) {
        return lineArray.join(" ");
    }
    var lines = wordLines.map(joinWords),
        string = lines.join("\n");
    return string;
}

function wordOfEachLine(wordIndex, wordLines) {
    console.log("wordLines " + Array.isArray(wordLines));
    return wordLines.map(function (line) {
        return line[wordIndex];
    });
}

function returnIfUnique(transEntry, allDefinObj, index,
        mainWords, thesaurus, blacklist, transObj) {
    var word,
        values,
        matchingDefs,
        //maxDefs = 1,
        //newTransEntry = {},
        foundDuplicateDefs = 0,
        result,
        foundBlanks = 0,
        //transDefs,
        enDef = transEntry.en.toLowerCase(),
        directBorrows = 0,
        thesaurusEntry = [],
        thesaurusWord = "";
    allTransLangs.forEach(function (key) {
        values = allDefinObj[key];
        word = transEntry[key];
        if (word === "") {
            //console.log(key + " " + word + " blank");
            foundBlanks += 1;
            thesaurusEntry.push("(blank in) " + key + ":");
        }
        matchingDefs = 
                values.expand(function (defWord, defIndex) {
            if (word === defWord) {
                // get word from main words
                thesaurusWord = mainWords[defIndex];
                // add to thesaurus
                if (thesaurusEntry.indexOf(thesaurusWord) < 0 &&
                        thesaurusWord &&
                        thesaurusWord.toLowerCase() !== enDef) {
                    if (transObj["X" + enDef][key] !== undefined &&
                        transObj["X" + enDef][key] !== "") {
                      thesaurusEntry.push(key + ": " + transObj["X" + enDef][
                                          key].replace(/\s/g,""));
                      thesaurusEntry.push(thesaurusWord);
                    }
                } 
                return defIndex;
            }
            return null;
           
        });
        if (word === undefined) {
            return;
        }
        word = word.replace(/\s/g, "");
        //word = word.replace(/-/g, "");
        enDef = enDef.replace(/\s/g, "");
        //enDef = enDef.replace(/-/g, "");
        if (word && enDef &&
                word.toLowerCase() === enDef.toLowerCase() &&
                key !== "en") {
            directBorrows += 1;
        }
        if (matchingDefs.length <= 0 ||
                matchingDefs[0] === index) {
            Function.prototype();
        } else {
            //console.log(key + " " + word + " " +
            //    matchingDefs + " " + index);
            /* check if preceding words are implemented */
            matchingDefs.forEach(function (defIndex) {
                var defWord = mainWords[defIndex];
                if (thesaurus["X" + defWord] !== undefined) {
                  if ((enDef !== "fish" && key !== "my" )&&
                      specialWords.indexOf(enDef) === -1) {
                    foundDuplicateDefs += 1;
                  }
                }
            });
        }
    });

    if (foundBlanks > 0) {
        result = "BLANK"; 
        thesaurusEntry.push("BLANK:");
        blacklist["X" + enDef] = thesaurusEntry;
        //console.log(enDef + " blank");
        //console.log(thesaurusEntry);
    } else if (directBorrows >
            Math.round(allTransLangs.length /
            Math.pow(1.618, 2))) {
        result = "BORROW"; 
        thesaurusEntry.push("OVER_BORROWED:" + directBorrows);
        blacklist["X" + enDef] = thesaurusEntry;
    } else if (thesaurusEntry.length/2 > 
                allTransLangs.length/Math.pow(1.618,2)) {
        result = "AMBIGIOUS"; 
        thesaurusEntry.push("AMBIGIOUS:" + thesaurusEntry.length);
        blacklist["X" + enDef] = thesaurusEntry;
    } else if (rootBlacklist.indexOf(enDef) !== -1 ||
        /\W/.test(enDef.replace(/-/g,""))) {
        result = "BLIST"; 
        thesaurusEntry.push("BLIST:");
        blacklist["X" + enDef] = thesaurusEntry;
    } else if (foundDuplicateDefs === 0) {
        result = transEntry;
        thesaurus["X"+ enDef] = thesaurusEntry;
    } else {
        thesaurusEntry.push("DUPLICATE:");
        blacklist["X" + enDef] = thesaurusEntry;
        result = "DUPLICATE";
    }
    return result;
}

function makeAllDefinObj(transObj, mainWords) {
    var definObj = {},
        transEntry = {};
    allTransLangs.forEach(function (langCode) {
        definObj[langCode] = [];
    });
    mainWords.forEach(function (word) {
        transEntry = transObj["X"+word];
        if (transEntry !== undefined) {
            allTransLangs.forEach(function (langCode) {
                definObj[langCode].push(transEntry[langCode]);
            });
        } else {
            // keep same number of entries for thesaurus
            allTransLangs.forEach(function (langCode) {
                definObj[langCode].push(null);
            });
        }
    });
    return definObj;
}

function formatThesaurus(thesaurus, mainWords) {
    var result = "";
    mainWords.forEach(function (word) { 
        var entry = thesaurus["X" + word];
        if (thesaurus["X" + word]) {
            result += word + ": ";
            if (Array.isArray(entry)) {
                result += entry.join(", ");
            }
            result += "\n";
        }
    });
    return result;
}

function formatSuggestList(thesaurus, blacklist, mainWords) {
    function approvedWords(word) {
        if (thesaurus["X" + word] !== undefined) {
            return true;
        }
        return false;
    }
    var result = "";
    mainWords.forEach(function (word) { 
        var bentry = blacklist["X" + word];
        if (thesaurus["X" + word]) {
            Function.prototype();
        } else if (blacklist["X" + word]) {
            result += word + ": ";
            if (Array.isArray(bentry)) {
                result += bentry.filter(approvedWords).join(", ");
            }
            result += "\n";
        }
    });
    return result;
}

function main() {
    var fileContents = io.fileRead("sortedComboList-mid.txt"),
        wordLines = stringToWordLines(fileContents),
        mainWords = wordOfEachLine(0, wordLines),
        blackFileContents = io.fileRead("rootBlacklist.txt"), // + 
                            //io.fileRead("nationTerms.txt"),
        blackLines = stringToWordLines(blackFileContents),
        blacklistWords = wordOfEachLine(0, blackLines),
        //wordLines = removeBlacklisted(wordLines, blacklist),
        //transJSON = io.fileRead("genTransX.json.2"),
        transEntry,
        uniqueJSON = io.fileRead("unique.json"),
        inObj = JSON.parse(uniqueJSON),
        transJSON = io.fileRead("genTransX.json.bak"),
        transObj = JSON.parse(transJSON),
        thesaurus = inObj.thesaurus,
        blacklist = inObj.blacklist,
        //usedWords = mainWords.slice(0),
        uniqObj = inObj.uniqObj,
        uniqEntry,
        uniqText,
        atomWords =  (io.fileRead("atoms.txt") +"\n" + 
                      io.fileRead("calendar.txt") +"\n" +
                      io.fileRead("numbers.txt")).split("\n"),
        //thesaurus = {},
        //blacklist = {},
        outObj = {},
        allDefObj = makeAllDefinObj(transObj, mainWords);
  specialWords = atomWords;
    rootBlacklist = blacklistWords;
    if (Array.isArray(rootBlacklist) === false) {
        console.log("bl " + JSON.stringify(blacklistWords));
        throw "blist not array";
    }
    mainWords.forEach(function (word, index) {
        if (thesaurus["X" + word] || blacklist["X" + word]) { return; }
        uniqEntry = undefined;
        transEntry = transObj["X" +word];
        // be add ob sub entry for each lang ya
        if (transEntry === undefined) {
            //console.log(word + " undefined ");
            uniqEntry = "UNDEF";
        } else {
            uniqEntry = 
                returnIfUnique(transEntry, allDefObj, index, 
                    mainWords, thesaurus, blacklist, transObj); 
        }
        if (uniqEntry === "BLANK") {
            console.log(word + " blank ");
            //usedWords[usedWords.indexOf(word)] = null;
            allDefObj = makeAllDefinObj(transObj, mainWords);
        } else if (uniqEntry === "BORROW") {
            console.log(word + " over borrowed ");
            //usedWords[usedWords.indexOf(word)] = null;
            allDefObj = makeAllDefinObj(transObj, mainWords);
        } else if (uniqEntry === "UNDEF") {
            console.log(word + " undefined ");
            //usedWords[usedWords.indexOf(word)] = null;
            allDefObj = makeAllDefinObj(transObj, mainWords);
        } else if (uniqEntry === "BLIST") {
            console.log(word + " BLIST");
            //usedWords[usedWords.indexOf(word)] = null;
            allDefObj = makeAllDefinObj(transObj, mainWords);
        } else if (uniqEntry === "DUPLICATE") {
            console.log(word + " DUPLICATE");
            //usedWords[usedWords.indexOf(word)] = null;
            allDefObj = makeAllDefinObj(transObj, mainWords);
        } else if (uniqEntry === "AMBIGIOUS") {
            console.log(word + " AMBIGIOUS");
            //usedWords[usedWords.indexOf(word)] = null;
            allDefObj = makeAllDefinObj(transObj, mainWords);
        } else if (uniqEntry !== null) {
             console.log(word + " is unique");
            uniqObj["X" + word] = uniqEntry;
        } 
    });
    io.fileWrite("genTransUniq-mid.json", JSON.stringify(uniqObj));
    uniqText = Object.keys(uniqObj).map(function (word) {
        function findIfGram(word, wordLines) {
            var returnLine, i, line, lineWord;
            for (i = 0; i < wordLines.length; i++) {
                line = wordLines[i];
                lineWord = line[0];
                if (lineWord === word &&
                        line[1] === "g") {
                    returnLine = " " + line.slice(1).join(" ");
                    return returnLine;
                }
            }
            return "";
        }
        word = word.substring(1);
        var gram = findIfGram(word, wordLines);
        return word + gram;
    }).join("\n");
    io.fileWrite("comboUniqList-mid.txt", uniqText);
    io.fileWrite("thesaurus-mid.txt", formatThesaurus(thesaurus,
            mainWords));
    io.fileWrite("blacklist-mid.txt", formatThesaurus(blacklist,
            mainWords));
    io.fileWrite("suggestList-mid.txt", formatSuggestList(thesaurus, 
        blacklist, mainWords));
    outObj.mainWords = mainWords;
    //outObj.usedWords = usedWords;
    outObj.thesaurus = thesaurus;
    outObj.blacklist = blacklist;
    outObj.uniqObj = uniqObj;
    io.fileWrite("unique-mid.json", JSON.stringify(outObj));
}

main();
