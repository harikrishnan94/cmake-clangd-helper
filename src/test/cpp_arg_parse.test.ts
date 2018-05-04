import * as assert from 'assert';

import { CppArgInfo, cppArgParse } from '../cpp_arg_parse';

suite("Preprocessor Argument Parsing Tests", () => {
    test("Simple with Nothing Harvested", () => {
        let compilerCommandString : string = "gcc -g -O2 -c -o somefile.o somefile.c";
        let parseResult : CppArgInfo = cppArgParse(compilerCommandString);
        assert.equal(parseResult.includePath.length, 0, "Preprocessor include path count");
        assert.equal(parseResult.macroDefines.length, 0, "Preprocessor macro definitions count");
    });

    test("Success with Single Include Directory (Absolute)", () => {
        let compilerCommandString : string = "gcc -g -O2 -I/opt/coredx/target/include -c -o somefile.o somefile.c";
        let parseResult : CppArgInfo = cppArgParse(compilerCommandString);
        assert.equal(parseResult.includePath.length, 1, "Preprocessor include path count");
        [ "/opt/coredx/target/include" ].forEach((aPath : string, index: number) => {
            assert.equal(parseResult.includePath[index], aPath, "A preprocessor include path '" + aPath + "'");
        });
        assert.equal(parseResult.macroDefines.length, 0, "Preprocessor macro definitions count");
    });

    test("Success with Single Include Directory (Relative)", () => {
        let compilerCommandString : string = "gcc -g -O2 -I../src -c -o somefile.o somefile.c";
        let parseResult : CppArgInfo = cppArgParse(compilerCommandString);
        assert.equal(parseResult.includePath.length, 1, "Preprocessor include path count");
        [ "../src" ].forEach((aPath : string, index: number) => {
            assert.equal(parseResult.includePath[index], aPath, "A preprocessor include path '" + aPath + "'");
        });
        assert.equal(parseResult.macroDefines.length, 0, "Preprocessor macro definitions count");
    });

    test("Failed Parse with Alternative Valid Syntax", () => {
        let compilerCommandString : string = "gcc -g -O2 -I . -c -o somefile.o somefile.c";
        let parseResult : CppArgInfo = cppArgParse(compilerCommandString);
        assert.equal(parseResult.includePath.length, 0, "Preprocessor include path count");
        assert.equal(parseResult.macroDefines.length, 0, "Preprocessor macro definitions count");
    });

    test("Success with Multiple Include Directories (Absolute)", () => {
        let compilerCommandString : string = "gcc -g -O2 -I/opt/coredx/target/include -I/opt/X11/include -c -o somefile.o somefile.c";
        let parseResult : CppArgInfo = cppArgParse(compilerCommandString);
        assert.equal(parseResult.includePath.length, 2, "Preprocessor include path count");
        [ "/opt/coredx/target/include", "/opt/X11/include" ].forEach((aPath : string, index: number) => {
            assert.equal(parseResult.includePath[index], aPath, "A preprocessor include path '" + aPath + "'");
        });
        assert.equal(parseResult.macroDefines.length, 0, "Preprocessor macro definitions count");
    });

    test("Success with Multiple Include Directories (Relative)", () => {
        let compilerCommandString : string = "gcc -g -O2 -I../src -I. -c -o somefile.o somefile.c";
        let parseResult : CppArgInfo = cppArgParse(compilerCommandString);
        assert.equal(parseResult.includePath.length, 2, "Preprocessor include path count");
        [ "../src", "." ].forEach((aPath : string, index: number) => {
            assert.equal(parseResult.includePath[index], aPath, "A preprocessor path include '" + aPath + "'");
        });
        assert.equal(parseResult.macroDefines.length, 0, "Preprocessor macro definitions count");
    });

    test("Success with Multiple Include Directories (Mix)", () => {
        let compilerCommandString : string = "gcc -g -O2 -I/opt/coredx/target/include -I/opt/X11/include -I. -I../src -c -o somefile.o somefile.c";
        let parseResult : CppArgInfo = cppArgParse(compilerCommandString);
        assert.equal(parseResult.includePath.length, 4, "Preprocessor include path count");
        [ "/opt/coredx/target/include", "/opt/X11/include", ".", "../src" ].forEach((aPath : string, index : number) => {
            assert.equal(parseResult.includePath[index], aPath, "A preprocessor include path '" + aPath + "'");
        });
        assert.equal(parseResult.macroDefines.length, 0, "Preprocessor macro definitions count");
    });

    test("Success with Single Macro Definition (Simple)", () => {
        let compilerCommandString : string = "gcc -g -O2 -DMyProject_EXPORTS -c -o somefile.o somefile.c";
        let parseResult : CppArgInfo = cppArgParse(compilerCommandString);
        assert.equal(parseResult.includePath.length, 0, "Preprocessor include path count");
        assert.equal(parseResult.macroDefines.length, 1, "Preprocessor macro definitions count");
        [ "MyProject_EXPORTS" ].forEach((aMacroDef : string, index: number) => {
            assert.equal(parseResult.macroDefines[index], aMacroDef, "A preprocessor macro definition '" + aMacroDef + "'");
        });
    });

    test("Success with Multiple Macro Definitions (Simple)", () => {
        let compilerCommandString : string = "gcc -g -O2 -DMyProject_EXPORTS -D_DEBUG -c -o somefile.o somefile.c";
        let parseResult : CppArgInfo = cppArgParse(compilerCommandString);
        assert.equal(parseResult.includePath.length, 0, "Preprocessor include path count");
        assert.equal(parseResult.macroDefines.length, 2, "Preprocessor macro definitions count");
        [ "MyProject_EXPORTS", "_DEBUG" ].forEach((aMacroDef : string, index: number) => {
            assert.equal(parseResult.macroDefines[index], aMacroDef, "A preprocessor macro definition '" + aMacroDef + "'");
        });
    });

    test("Success with Single Macro Definition (Assignment)", () => {
        let compilerCommandString : string = "gcc -g -O2 -D_POSIX_C_SOURCE=200112L -c -o somefile.o somefile.c";
        let parseResult : CppArgInfo = cppArgParse(compilerCommandString);
        assert.equal(parseResult.includePath.length, 0, "Preprocessor include path count");
        assert.equal(parseResult.macroDefines.length, 1, "Preprocessor macro definitions count");
        [ "_POSIX_C_SOURCE=200112L" ].forEach((aMacroDef : string, index: number) => {
            assert.equal(parseResult.macroDefines[index], aMacroDef, "A preprocessor macro definition '" + aMacroDef + "'");
        });
    });

    test("Success with Multiple Macro Definitions (Assignment)", () => {
        let compilerCommandString : string = "gcc -g -O2 -D_POSIX_C_SOURCE=200112L -DMYPROJECT_MAX_COUNT=20 -c -o somefile.o somefile.c";
        let parseResult : CppArgInfo = cppArgParse(compilerCommandString);
        assert.equal(parseResult.includePath.length, 0, "Preprocessor include path count");
        assert.equal(parseResult.macroDefines.length, 2, "Preprocessor macro definitions count");
        [ "_POSIX_C_SOURCE=200112L", "MYPROJECT_MAX_COUNT=20" ].forEach((aMacroDef : string, index: number) => {
            assert.equal(parseResult.macroDefines[index], aMacroDef, "A preprocessor macro definition '" + aMacroDef + "'");
        });
    });

    test("Success with Multiple Macro Definitions (Mix)", () => {
        let compilerCommandString : string = "gcc -g -O2 -DMyProject_EXPORTS -D_DEBUG -D_POSIX_C_SOURCE=200112L -DMYPROJECT_MAX_COUNT=20 -c -o somefile.o somefile.c";
        let parseResult : CppArgInfo = cppArgParse(compilerCommandString);
        assert.equal(parseResult.includePath.length, 0, "Preprocessor include path count");
        assert.equal(parseResult.macroDefines.length, 4, "Preprocessor macro definitions count");
        [ "MyProject_EXPORTS", "_DEBUG", "_POSIX_C_SOURCE=200112L", "MYPROJECT_MAX_COUNT=20" ].forEach((aMacroDef : string, index: number) => {
            assert.equal(parseResult.macroDefines[index], aMacroDef, "A preprocessor macro definition '" + aMacroDef + "'");
        });
    });

    test("Maximum Harvest", () => {
        let compilerCommandString : string = "gcc -g -O2 -DMyProject_EXPORTS -D_DEBUG -D_POSIX_C_SOURCE=200112L -DMYPROJECT_MAX_COUNT=20 -I/opt/coredx/target/include -I/opt/X11/include -I. -I../src -c -o somefile.o somefile.c";
        let parseResult : CppArgInfo = cppArgParse(compilerCommandString);
        assert.equal(parseResult.includePath.length, 4, "Preprocessor include path count");
        [ "/opt/coredx/target/include", "/opt/X11/include", ".", "../src" ].forEach((aPath : string, index : number) => {
            assert.equal(parseResult.includePath[index], aPath, "A preprocessor include path '" + aPath + "'");
        });
        assert.equal(parseResult.macroDefines.length, 4, "Preprocessor macro definitions count");
        [ "MyProject_EXPORTS", "_DEBUG", "_POSIX_C_SOURCE=200112L", "MYPROJECT_MAX_COUNT=20" ].forEach((aMacroDef : string, index: number) => {
            assert.equal(parseResult.macroDefines[index], aMacroDef, "A preprocessor macro definition '" + aMacroDef + "'");
        });
    });
});