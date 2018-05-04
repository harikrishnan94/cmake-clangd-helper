'use strict';

/**
 * Data container for identified preprocessor flags.
 * 
 * @description As of this writing, the only flags that will be stored on
 * instances that implement this interface are:
 * - Standard include path entries. Note that this does not include directories
 *   added to the SYSTEM include path with `-isystem`.
 * - Macro definitions. Note that this code does not attempt to evaluate any
 *   shell expansions, such as those enclosed in `$()`.
 * 
 * @author Rolando J. Nieves
 */
export interface CppArgInfo {
    /**
     * List of standard include patch entries.
     */
    includePath : string[];
    /**
     * List of macro definitions.
     */
    macroDefines : string[];
};

/**
 * Create `CppArgInfo` instance using information from compilation command line.
 * 
 * @description As of this writing, the only flags that will be detected by
 * this function are:
 * - `-I<arg>`: Addition to standard include path. Only the form that manifests
 *   as a single command line argument is supported. Although `-I <arg>` is
 *   legal, this function does not support it as of this writing.
 * - `-D<arg>`: Addition to list of preprocessor macros.
 * 
 * @param {string} commandLine Compile command to parse.
 * 
 * @author Rolando J. Nieves
 */
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
                // We only add an entry if it actually has any content.
                if (candidateDir.length) {
                    result.includePath.push(candidateDir);
                }
            } else if (aCmdArg.startsWith("-D")) {
                let candidateDef : string = aCmdArg.substr(2).trim();
                // We only add an entry if it actually has any content.
                if (candidateDef.length) {
                    result.macroDefines.push(candidateDef);
                }
            }
        }
    );

    return result;
}