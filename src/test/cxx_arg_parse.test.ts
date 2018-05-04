import * as assert from 'assert';

import { CxxArgInfo, cxxArgParse } from '../cxx_arg_parse';

suite("C++ Compiler Argument Parsing Tests", () => {
    test("Simple with Nothing Harvested", () => {
        let compilerCommandString : string = "g++ -g -O2 -I. -I../src -c -o somefile.o somefile.cpp";
        let parseResult : CxxArgInfo = cxxArgParse(compilerCommandString);
        assert.equal(parseResult.langStandard, null, "C++ language standard");
        assert.equal(parseResult.systemRoot, null, "C++ cross compilation system root");
        assert.equal(parseResult.crossTarget, null, "C++ cross compilation target triple");
        assert.equal(parseResult.cxxStdLibrary, null, "C++ standard library");
    });

    test("Success with Valid Language Standard Harvested", () => {
        let compilerCommandString : string = "g++ -g -O2 -I. -I../src -std=gnu++11 -c -o somefile.o somefile.cpp";
        let parseResult : CxxArgInfo = cxxArgParse(compilerCommandString);
        assert.equal(parseResult.langStandard, "gnu++11", "C++ language standard");
        assert.equal(parseResult.systemRoot, null, "C++ cross compilation system root");
        assert.equal(parseResult.crossTarget, null, "C++ cross compilation target triple");
        assert.equal(parseResult.cxxStdLibrary, null, "C++ standard library");
    });

    test("Tolerate Invalid Language Standard Value", () => {
        let compilerCommandString : string = "g++ -g -O2 -I. -I../src -std=bogus -c -o somefile.o somefile.cpp";
        let parseResult : CxxArgInfo = cxxArgParse(compilerCommandString);
        assert.equal(parseResult.langStandard, null, "C++ language standard");
        assert.equal(parseResult.systemRoot, null, "C++ cross compilation system root");
        assert.equal(parseResult.crossTarget, null, "C++ cross compilation target triple");
        assert.equal(parseResult.cxxStdLibrary, null, "C++ standard library");
    });

    test("Tolerate Invalid Language Standard Flag", () => {
        let compilerCommandString : string = "g++ -g -O2 -I. -I../src --std=gnu++11 -c -o somefile.o somefile.cpp";
        let parseResult : CxxArgInfo = cxxArgParse(compilerCommandString);
        assert.equal(parseResult.langStandard, null, "C++ language standard");
        assert.equal(parseResult.systemRoot, null, "C++ cross compilation system root");
        assert.equal(parseResult.crossTarget, null, "C++ cross compilation target triple");
        assert.equal(parseResult.cxxStdLibrary, null, "C++ standard library");
    });

    test("Success with Valid C++ Standard Library Harvested (CLang)", () => {
        let compilerCommandString : string = "clang++ -g -O2 -I. -I../src -std=gnu++11 -stdlib=libstdc++ -c -o somefile.o somefile.cpp";
        let parseResult : CxxArgInfo = cxxArgParse(compilerCommandString);
        assert.equal(parseResult.langStandard, "gnu++11", "C++ language standard");
        assert.equal(parseResult.systemRoot, null, "C++ cross compilation system root");
        assert.equal(parseResult.crossTarget, null, "C++ cross compilation target triple");
        assert.equal(parseResult.cxxStdLibrary, "libstdc++", "C++ standard library");
    });

    test("Tolerate Invalid C++ Standard Library Flag Op. 1 (CLang)", () => {
        let compilerCommandString : string = "clang++ -g -O2 -I. -I../src --std=gnu++11 --stdlib=libstdc++ -c -o somefile.o somefile.cpp";
        let parseResult : CxxArgInfo = cxxArgParse(compilerCommandString);
        assert.equal(parseResult.langStandard, null, "C++ language standard");
        assert.equal(parseResult.systemRoot, null, "C++ cross compilation system root");
        assert.equal(parseResult.crossTarget, null, "C++ cross compilation target triple");
        assert.equal(parseResult.cxxStdLibrary, null, "C++ standard library");
    });

    test("Tolerate Invalid C++ Standard Library Flag Op. 2 (CLang)", () => {
        let compilerCommandString : string = "clang++ -g -O2 -I. -I../src --std=gnu++11 -stdlib libstdc++ -c -o somefile.o somefile.cpp";
        let parseResult : CxxArgInfo = cxxArgParse(compilerCommandString);
        assert.equal(parseResult.langStandard, null, "C++ language standard");
        assert.equal(parseResult.systemRoot, null, "C++ cross compilation system root");
        assert.equal(parseResult.crossTarget, null, "C++ cross compilation target triple");
        assert.equal(parseResult.cxxStdLibrary, null, "C++ standard library");
    });

    test("Success with Valid System Root Harvested", () => {
        let compilerCommandString : string = "g++ -g -O2 -I. -I../src --sysroot=/opt/yocto/sysroots/armv7-none-linux-gnueabi -c -o somefile.o somefile.cpp";
        let parseResult : CxxArgInfo = cxxArgParse(compilerCommandString);
        assert.equal(parseResult.langStandard, null, "C++ language standard");
        assert.equal(parseResult.systemRoot, "/opt/yocto/sysroots/armv7-none-linux-gnueabi", "C++ cross compilation system root");
        assert.equal(parseResult.crossTarget, null, "C++ cross compilation target triple");
        assert.equal(parseResult.cxxStdLibrary, null, "C++ standard library");
    });

    test("Tolerate Invalid System Root Flag", () => {
        let compilerCommandString : string = "g++ -g -O2 -I. -I../src -sysroot /opt/yocto/sysroots/armv7-none-linux-gnueabi -c -o somefile.o somefile.cpp";
        let parseResult : CxxArgInfo = cxxArgParse(compilerCommandString);
        assert.equal(parseResult.langStandard, null, "C++ language standard");
        assert.equal(parseResult.systemRoot, null, "C++ cross compilation system root");
        assert.equal(parseResult.crossTarget, null, "C++ cross compilation target triple");
        assert.equal(parseResult.cxxStdLibrary, null, "C++ standard library");
    });

    test("Success with Valid Target Triple Harvested Op. 1 (CLang)", () => {
        let compilerCommandString : string = "clang++ -g -O2 -I. -I../src -target armv7-none-linux-gnueabi -c -o somefile.o somefile.cpp";
        let parseResult : CxxArgInfo = cxxArgParse(compilerCommandString);
        assert.equal(parseResult.langStandard, null, "C++ language standard");
        assert.equal(parseResult.systemRoot, null, "C++ cross compilation system root");
        assert.equal(parseResult.crossTarget, "armv7-none-linux-gnueabi", "C++ cross compilation target triple");
        assert.equal(parseResult.cxxStdLibrary, null, "C++ standard library");
    });

    test("Success with Valid Target Triple Harvested Op. 2 (CLang)", () => {
        let compilerCommandString : string = "clang++ -g -O2 -I. -I../src --target=armv7-none-linux-gnueabi -c -o somefile.o somefile.cpp";
        let parseResult : CxxArgInfo = cxxArgParse(compilerCommandString);
        assert.equal(parseResult.langStandard, null, "C++ language standard");
        assert.equal(parseResult.systemRoot, null, "C++ cross compilation system root");
        assert.equal(parseResult.crossTarget, "armv7-none-linux-gnueabi", "C++ cross compilation target triple");
        assert.equal(parseResult.cxxStdLibrary, null, "C++ standard library");
    });

    test("Tolerate Invalid Target Triple Flag Op. 2 (CLang)", () => {
        let compilerCommandString : string = "clang++ -g -O2 -I. -I../src --target armv7-none-linux-gnueabi -c -o somefile.o somefile.cpp";
        let parseResult : CxxArgInfo = cxxArgParse(compilerCommandString);
        assert.equal(parseResult.langStandard, null, "C++ language standard");
        assert.equal(parseResult.systemRoot, null, "C++ cross compilation system root");
        assert.equal(parseResult.crossTarget, null, "C++ cross compilation target triple");
        assert.equal(parseResult.cxxStdLibrary, null, "C++ standard library");
    });

    test("Failed Parse with Missing Target Triple (CLang)", () => {
        let compilerCommandString : string = "clang++ -g -O2 -I. -I../src -target -c -o somefile.o somefile.cpp";
        let parseResult : CxxArgInfo = cxxArgParse(compilerCommandString);
        assert.equal(parseResult.langStandard, null, "C++ language standard");
        assert.equal(parseResult.systemRoot, null, "C++ cross compilation system root");
        assert.equal(parseResult.crossTarget, "-c", "C++ cross compilation target triple");
        assert.equal(parseResult.cxxStdLibrary, null, "C++ standard library");
    });

    test("Tolerate Invalid Target Triple Flag Op. 1 (CLang)", () => {
        let compilerCommandString : string = "clang++ -g -O2 -I. -I../src -target=armv7-none-linux-gnueabi -c -o somefile.o somefile.cpp";
        let parseResult : CxxArgInfo = cxxArgParse(compilerCommandString);
        assert.equal(parseResult.langStandard, null, "C++ language standard");
        assert.equal(parseResult.systemRoot, null, "C++ cross compilation system root");
        assert.equal(parseResult.crossTarget, null, "C++ cross compilation target triple");
        assert.equal(parseResult.cxxStdLibrary, null, "C++ standard library");
    });

    test("Typical Cross Compilation Line (GCC)", () => {
        let compilerCommandString : string = "armv7-none-linux-gnueabi-g++ -g -O2 -I. -I../src --sysroot=/opt/yocto/sysroots/armv7-none-linux-gnueabi -c -o somefile.o somefile.cpp";
        let parseResult : CxxArgInfo = cxxArgParse(compilerCommandString);
        assert.equal(parseResult.langStandard, null, "C++ language standard");
        assert.equal(parseResult.systemRoot, "/opt/yocto/sysroots/armv7-none-linux-gnueabi", "C++ cross compilation system root");
        assert.equal(parseResult.crossTarget, null, "C++ cross compilation target triple");
        assert.equal(parseResult.cxxStdLibrary, null, "C++ standard library");
    });

    test("Typical Cross Compilation Line (CLang)", () => {
        let compilerCommandString : string = "clang++ -g -O2 -I. -I../src -target armv7-none-linux-gnueabi --sysroot=/opt/yocto/sysroots/armv7-none-linux-gnueabi -c -o somefile.o somefile.cpp";
        let parseResult : CxxArgInfo = cxxArgParse(compilerCommandString);
        assert.equal(parseResult.langStandard, null, "C++ language standard");
        assert.equal(parseResult.systemRoot, "/opt/yocto/sysroots/armv7-none-linux-gnueabi", "C++ cross compilation system root");
        assert.equal(parseResult.crossTarget, "armv7-none-linux-gnueabi", "C++ cross compilation target triple");
        assert.equal(parseResult.cxxStdLibrary, null, "C++ standard library");
    });

    test("Typical Cross Compilation Line (GCC)", () => {
        let compilerCommandString : string = "armv7-none-linux-gnueabi-g++ -g -O2 -I. -I../src --sysroot=/opt/yocto/sysroots/armv7-none-linux-gnueabi -c -o somefile.o somefile.cpp";
        let parseResult : CxxArgInfo = cxxArgParse(compilerCommandString);
        assert.equal(parseResult.langStandard, null, "C++ language standard");
        assert.equal(parseResult.systemRoot, "/opt/yocto/sysroots/armv7-none-linux-gnueabi", "C++ cross compilation system root");
        assert.equal(parseResult.crossTarget, null, "C++ cross compilation target triple");
        assert.equal(parseResult.cxxStdLibrary, null, "C++ standard library");
    });

    test("Typical Cross Compilation Line (CLang)", () => {
        let compilerCommandString : string = "clang++ -g -O2 -I. -I../src -target armv7-none-linux-gnueabi --sysroot=/opt/yocto/sysroots/armv7-none-linux-gnueabi -c -o somefile.o somefile.cpp";
        let parseResult : CxxArgInfo = cxxArgParse(compilerCommandString);
        assert.equal(parseResult.langStandard, null, "C++ language standard");
        assert.equal(parseResult.systemRoot, "/opt/yocto/sysroots/armv7-none-linux-gnueabi", "C++ cross compilation system root");
        assert.equal(parseResult.crossTarget, "armv7-none-linux-gnueabi", "C++ cross compilation target triple");
        assert.equal(parseResult.cxxStdLibrary, null, "C++ standard library");
    });

    test("Maximum Harvest (GCC)", () => {
        let compilerCommandString : string = "armv7-none-linux-gnueabi-g++ -g -O2 -I. -I../src -std=gnu++17 --sysroot=/opt/yocto/sysroots/armv7-none-linux-gnueabi -c -o somefile.o somefile.cpp";
        let parseResult : CxxArgInfo = cxxArgParse(compilerCommandString);
        assert.equal(parseResult.langStandard, "gnu++17", "C++ language standard");
        assert.equal(parseResult.systemRoot, "/opt/yocto/sysroots/armv7-none-linux-gnueabi", "C++ cross compilation system root");
        assert.equal(parseResult.crossTarget, null, "C++ cross compilation target triple");
        assert.equal(parseResult.cxxStdLibrary, null, "C++ standard library");
    });

    test("Maximum Harvest (CLang)", () => {
        let compilerCommandString : string = "clang++ -g -O2 -I. -I../src -target armv7-none-linux-gnueabi -std=gnu++17 -stdlib=libc++ --sysroot=/opt/yocto/sysroots/armv7-none-linux-gnueabi -c -o somefile.o somefile.cpp";
        let parseResult : CxxArgInfo = cxxArgParse(compilerCommandString);
        assert.equal(parseResult.langStandard, "gnu++17", "C++ language standard");
        assert.equal(parseResult.systemRoot, "/opt/yocto/sysroots/armv7-none-linux-gnueabi", "C++ cross compilation system root");
        assert.equal(parseResult.crossTarget, "armv7-none-linux-gnueabi", "C++ cross compilation target triple");
        assert.equal(parseResult.cxxStdLibrary, "libc++", "C++ standard library");
    });
});
