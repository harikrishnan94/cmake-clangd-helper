'use strict';

/**
 * Known C++ language standards supported by CLang
 * 
 * @description These were acquired from the LLVM CLang Github repository at:
 * - `clang/include/clang/Frontend/LangStandards.def`
 * Accurate as of 2018-05-04
 */
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

/**
 * Data container for identified C++ compiler flags.
 * 
 * @description As of this writing, the only flags that will be stored on
 * instances that implement this interface are:
 * - C++ Language standard (from the menu of known supported standards to date)
 * - Cross compilation system root directory
 * - Cross compilation "target triple" identifier.
 * - C++ Standard Library to use
 * 
 * @author Rolando J. Nieves
 */
export interface CxxArgInfo {
    /**
     * C++ language standard detected in compile command line.
     */
    langStandard : string;
    /**
     * Cross compilation system root directory detected in compile command line.
     */
    systemRoot : string;
    /**
     * Cross compilation "target triple" identified detected in compile command line.
     * 
     * @description This field will only be populated if the project using this
     * extension is actually built using CLang.
     */
    crossTarget : string;
    /**
     * C++ standard library detected in compile command line.
     * 
     * @description This field will only be populated if the project using this
     * extension is actually built using CLang.
     */
    cxxStdLibrary : string;
}

/**
 * Create `CxxArgInfo` instance using information from compilation command line
 * 
 * @description As of this writing, the only flags that will be detected by
 * this function are:
 * - `-std=<arg>`: C++ language standard. `<arg>` must identify a standard
 *   supported by CLang as of this writing.
 * - `--sysroot=<arg>`: Cross compilation system root directory. `<arg>` is
 *   taken as-is.
 * - `-target <arg>`: Cross compilation "target triple." Also detected as
 *   `--target=<arg>`. `<arg>` is taken as-is.
 * - `-stdlib=<arg>`: C++ standard library. `<arg>` is taken as-is.
 * 
 * @param {string} commandLine Compile command to parse.
 * 
 * @author Rolando J. Nieves
 */
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
                // We will only accept C language standards supported by CLang
                // as of this writing.
                if (KNOWN_CXX_LANG_STDS.indexOf(stdCandidate) != -1) {
                    result.langStandard = stdCandidate;
                }
            } else if (aCmdArg.startsWith("--sysroot=")) {
                result.systemRoot = aCmdArg.substr(10);
            } else if (aCmdArg == "-target") {
                // Variation of target triple option split into two arguments.
                // Next iteration will pick up the actual value. The only
                // protection that exists against an improperly constructed
                // compile command that is missing the actual value is that
                // the function will not cause a runtime error.
                targetIncoming = true;
            } else if (aCmdArg.startsWith("-stdlib=")) {
                result.cxxStdLibrary = aCmdArg.substr(8);
            } else if (aCmdArg.startsWith("--target=")) {
                // Variation of target triple that is all in one argument.
                result.crossTarget = aCmdArg.substr(9);
            }
        }
    );

    return result;
}