'use strict';

// These were acquired from the LLVM CLang Github repository at:
// clang/include/clang/Frontend/LangStandards.def
const KNOWN_C_LANG_STDS : string[] = [
    "c89",
    "c90",
    "iso9899:1990",
    "iso9899:199409",
    "gnu89",
    "gnu90",
    "c99",
    "iso9899:1999",
    "c9x",
    "iso9899:199x",
    "gnu99",
    "gnu9x",
    "c11",
    "iso9899:2011",
    "c1x",
    "iso9899:201x",
    "gnu11",
    "gnu1x",
    "c17",
    "iso9899:2017",
    "gnu17"
];

export interface CArgInfo {
    langStandard : string;
    systemRoot : string;
    crossTarget: string;
}

export function cArgParse(commandLine : string) : CArgInfo {
    let result = {
        langStandard: null,
        systemRoot: null,
        crossTarget: null
    }
    let stdCandidate : string = null;
    let targetIncoming : boolean = false;

    commandLine.split(" ").forEach(
        (aCmdArg : string) : void => {
            if (targetIncoming) {
                result.crossTarget = aCmdArg.trim();
                targetIncoming = false;
            } else if (aCmdArg.startsWith("-std=")) {
                stdCandidate = aCmdArg.substr(5);
                if (KNOWN_C_LANG_STDS.indexOf(stdCandidate) != -1) {
                    result.langStandard = stdCandidate;
                }
            } else if (aCmdArg.startsWith("--sysroot=")) {
                result.systemRoot = aCmdArg.substr(10);
            } else if (aCmdArg == "-target") {
                targetIncoming = true;
            } else if (aCmdArg.startsWith("--target=")) {
                result.crossTarget = aCmdArg.substr(9);
            }
        }
    );

    return result;
}