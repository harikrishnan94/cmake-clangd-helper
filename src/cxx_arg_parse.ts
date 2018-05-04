'use strict';

// These were acquired from the LLVM CLang Github repository at:
// clang/include/clang/Frontend/LangStandards.def
const KNOWN_CXX_LANG_STDS : string[] = [
    "c++98",
    "c++03",
    "gnu++98",
    "gnu++03",
    "c++11",
    "c++0x",
    "gnu++11",
    "gnu++0x",
    "c++14",
    "c++1y",
    "gnu++14",
    "gnu++1y",
    "c++17",
    "c++1z",
    "gnu++17",
    "gnu++1z",
    "c++2a",
    "gnu++2a"
];

export interface CxxArgInfo {
    langStandard : string;
    systemRoot : string;
    crossTarget : string;
    cxxStdLibrary : string;
}

export function cxxArgParse(commandLine : string) : CxxArgInfo {
    let result = {
        langStandard: null,
        systemRoot: null,
        crossTarget: null,
        cxxStdLibrary: null
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
                if (KNOWN_CXX_LANG_STDS.indexOf(stdCandidate) != -1) {
                    result.langStandard = stdCandidate;
                }
            } else if (aCmdArg.startsWith("--sysroot=")) {
                result.systemRoot = aCmdArg.substr(10);
            } else if (aCmdArg == "-target") {
                targetIncoming = true;
            } else if (aCmdArg.startsWith("-stdlib=")) {
                result.cxxStdLibrary = aCmdArg.substr(8);
            } else if (aCmdArg.startsWith("--target=")) {
                result.crossTarget = aCmdArg.substr(9);
            }
        }
    );

    return result;
}