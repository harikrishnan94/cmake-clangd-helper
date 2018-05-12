'use strict';

import * as path from "path";
import { cppArgParse, CppArgInfo } from "./cpp_arg_parse";
import { cArgParse, CArgInfo } from "./c_arg_parse";
import { cxxArgParse, CxxArgInfo } from "./cxx_arg_parse";

/**
 * Class that transforms a CMake `compile_commands` entry.
 * 
 * @description The transformation takes as much information as possible from
 * the CMake `compile_commands` entry, distills only what is required for
 * the CLang Adapter VSCode extension to work, and makes the distilled
 * information available via fields.
 * 
 * @author Rolando J. Nieves
 */
export class CmakeCompileCmd {
    /**
     * Symbol used to identify C language entries.
     */
    public static LANG_C : string = "c";
    /**
     * Symbol used to identify C++ language entries.
     */
    public static LANG_CXX : string = "c++";
    /**
     * Symbol used to identify Objective-C language entries.
     */
    public static LANG_OBJC : string = "objc";
    /**
     * Result of best effort source file language.
     * @description Should only be one of:
     * - `CmakeCompileCmd.LANG_C`: C source file
     * - `CmakeCompileCmd.LANG_CXX`: C++ source file
     * - `CmakeCompileCmd.LANG_OBJC`: Objective-C source file
     */
    public language : string = null;
    /**
     * Pre-processor flags parsed from this `compile_commands` entry.
     * @description As of this writing, will only contain macro definitions
     * and standard include path entries.
     */
    public cppFlags : string [] = [];
    /**
     * C compiler flags parsed from this `compile_commands` entry.
     * @description As of this writing, will only contain language standard
     * selection, and cross-compilation related flags such as target system
     * root directory and "target triple" specification.
     */
    public cFlags : string [] = [];
    /**
     * C++ compiler flags parsed from this `compile_commands` entry.
     * @description As of this writing, will only contain language standard
     * selection, C++ standard library selection (applicable only to CLang),
     * and cross-compilation related flags such as target system root
     * directory and "target triple" specification.
     */
    public cxxFlags : string [] = [];
    /**
     * Objective-C compiler flags parsed from this `compile_commands` entry.
     * @description None parsed as of this writing.
     */
    public objcFlags : string [] = [];

    /**
     * Parse `compile_commands` entry and store information in own fields.
     * 
     * @description This constructor expects all the fields produced by CMake
     * to be present and of the correct type.
     * 
     * @param {any} cmakeJsonObj JavaScript object constructed after parsing
     *        `compile_commands` entry.
     * 
     * @throws {Error} If any of the fields are missing or of the wrong type.
     */
    constructor(
        cmakeJsonObj : any
    ) {
        // Validate the incoming object to make sure it contains at a minimum
        // the requisite fields in the correct type.
        if (!("directory" in cmakeJsonObj) || (typeof cmakeJsonObj.directory !== typeof "")) {
            throw Error("CMake compile command must contain string 'directory' field.");
        }

        if (!("command" in cmakeJsonObj) || (typeof cmakeJsonObj.command !== typeof "")) {
            throw Error("CMake compile command must contain string 'command' field.");
        }

        if (!("file" in cmakeJsonObj) || (typeof cmakeJsonObj.file !== typeof "")) {
            throw Error("CMake compile command must contain string 'file' field.");
        }

        // Parse as much information as possible from the incoming object.
        let preprocArgs : CppArgInfo = cppArgParse(cmakeJsonObj.command);
        let cArgs : CArgInfo = cArgParse(cmakeJsonObj.command);
        let cxxArgs : CxxArgInfo = cxxArgParse(cmakeJsonObj.command);

        // Build up the array of preprocessor flags we're interested in: macro
        // definitions and the include path.
        preprocArgs.macroDefines.forEach(
            (aMacroDef : string) : void => {
                this.cppFlags.push("-D" + aMacroDef);
            }
        );
        preprocArgs.includePath.forEach(
            (anIncludeDir : string) : void => {
                // It seems that when using the CMake Ninja generator, CMake
                // places a premium on using relative paths, apparently
                // simplifying its dependency tracking. That's not usually a
                // problem, except that the working directory under which the
                // CLang scanner is run is not always compatible with the
                // relative paths. Thus, we use the "directory" field and the
                // CMake-provided relative path to build an absolute path.
                if (!path.isAbsolute(anIncludeDir)) {
                    anIncludeDir = path.resolve(cmakeJsonObj.directory, anIncludeDir);
                }
                this.cppFlags.push("-I" + anIncludeDir);
            }
        );

        // Build up the array of C compiler flags we're interested in: language
        // standard, cross compilation system root, and cross compilation
        // target triple. The last one is currently only available when CLang
        // is used to compile the project.
        if (cArgs.langStandard) {
            this.cFlags.push("-std=" + cArgs.langStandard);
        }
        if (cArgs.systemRoot) {
            this.cFlags.push("--sysroot=" + cArgs.systemRoot);
        }
        if (cArgs.crossTarget) {
            this.cFlags.push("-target");
            this.cFlags.push(cArgs.crossTarget);
        }

        // Build up the array of C++ compiler flags we're interested in:
        // language standard, cross compilation system root, cross
        // compilation target triple, and C++ standard library to use.
        // The last two are currently only available when CLang is used to 
        // compile the project.
        if (cxxArgs.langStandard) {
            this.cxxFlags.push("-std=" + cxxArgs.langStandard);
        }
        if (cxxArgs.systemRoot) {
            this.cxxFlags.push("--sysroot=" + cxxArgs.systemRoot);
        }
        if (cxxArgs.crossTarget) {
            this.cxxFlags.push("-target");
            this.cxxFlags.push(cxxArgs.crossTarget);
        }
        if (cxxArgs.cxxStdLibrary) {
            this.cxxFlags.push("-stdlib=" + cxxArgs.cxxStdLibrary);
        }

        // Attempt to decipher the compilation language based on the
        // translation unit (i.e., file) extension.
        let fileExt = path.extname(cmakeJsonObj.file);
        if (fileExt == ".c") {
            this.language = CmakeCompileCmd.LANG_C;
        } else if ((fileExt == ".cc") || (fileExt == ".cxx") || (fileExt == ".cpp")) {
            this.language = CmakeCompileCmd.LANG_CXX
        } else if (fileExt == ".m") {
            this.language = CmakeCompileCmd.LANG_OBJC;
        }
    }
}