'use strict';

export interface CppArgInfo {
    includePath : string[];
    macroDefines : string[];
};

export function cppArgParse(commandLine : string) : CppArgInfo {
    let result = {
        includePath: [],
        macroDefines: []
    };
    let anIncludePath : string = null;
    let aMacroDef : string = null;

    commandLine.split(" ").forEach(
        (aCmdArg : string) : void => {
            if (aCmdArg.startsWith("-I")) {
                let candidateDir : string = aCmdArg.substr(2).trim();
                if (candidateDir.length) {
                    result.includePath.push(candidateDir);
                }
            } else if (aCmdArg.startsWith("-D")) {
                let candidateDef : string = aCmdArg.substr(2).trim();
                if (candidateDef.length) {
                    result.macroDefines.push(candidateDef);
                }
            }
        }
    );

    return result;
}