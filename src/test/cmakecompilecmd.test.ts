import * as assert from 'assert';

import { CmakeCompileCmd } from '../cmakecompilecmd';

/**
 * Test suite for the `CmakeCompileCmd` class.
 * 
 * @author Rolando J. Nieves
 */
suite("CmakeCompileCmd Class", () => {
    test("Valid Entry Just Language Harvested (C)", () => {
        let cmakeCompileCmd = {
            directory: "/home/me/Documents/Projects/MyProject/build",
            command: "gcc -g -O2 -c -o main.o main.c",
            file: "/home/me/Documents/Projects/MyProject/src/main.c"
        };

        let unitUnderTest : CmakeCompileCmd = new CmakeCompileCmd(cmakeCompileCmd);
        assert.equal(unitUnderTest.cFlags.length, 0, "C compiler flag count");
        assert.equal(unitUnderTest.cppFlags.length, 0, "Preprocessor flag count");
        assert.equal(unitUnderTest.cxxFlags.length, 0, "C++ compiler flag count");
        assert.equal(unitUnderTest.objcFlags.length, 0, "Objective-C compiler flag count");
        assert.strictEqual(unitUnderTest.language, CmakeCompileCmd.LANG_C, "Source file language");
    });

    test("Valid Entry Just Language Harvested (C++)", () => {
        let cmakeCompileCmd = {
            directory: "/home/me/Documents/Projects/MyProject/build",
            command: "g++ -g -O2 -c -o main.o main.cpp",
            file: "/home/me/Documents/Projects/MyProject/src/main.cpp"
        };

        let unitUnderTest : CmakeCompileCmd = new CmakeCompileCmd(cmakeCompileCmd);
        assert.equal(unitUnderTest.cFlags.length, 0, "C compiler flag count");
        assert.equal(unitUnderTest.cppFlags.length, 0, "Preprocessor flag count");
        assert.equal(unitUnderTest.cxxFlags.length, 0, "C++ compiler flag count");
        assert.equal(unitUnderTest.objcFlags.length, 0, "Objective-C compiler flag count");
        assert.strictEqual(unitUnderTest.language, CmakeCompileCmd.LANG_CXX, "Source file language");
    });

    test("Valid Entry Just Language Harvested (Objective-C)", () => {
        let cmakeCompileCmd = {
            directory: "/home/me/Documents/Projects/MyProject/build",
            command: "gcc -g -O2 -c -o main.o main.m",
            file: "/home/me/Documents/Projects/MyProject/src/main.m"
        };

        let unitUnderTest : CmakeCompileCmd = new CmakeCompileCmd(cmakeCompileCmd);
        assert.equal(unitUnderTest.cFlags.length, 0, "C compiler flag count");
        assert.equal(unitUnderTest.cppFlags.length, 0, "Preprocessor flag count");
        assert.equal(unitUnderTest.cxxFlags.length, 0, "C++ compiler flag count");
        assert.equal(unitUnderTest.objcFlags.length, 0, "Objective-C compiler flag count");
        assert.strictEqual(unitUnderTest.language, CmakeCompileCmd.LANG_OBJC, "Source file language");
    });

    test("Weird but Valid Entry Nothing Harvested", () => {
        let cmakeCompileCmd = {
            directory: "/home/me/Documents/Projects/MyProject/build",
            command: "gcc -x c -g -O2 -c -o main.o main.what",
            file: "/home/me/Documents/Projects/MyProject/src/main.what"
        };

        let unitUnderTest : CmakeCompileCmd = new CmakeCompileCmd(cmakeCompileCmd);
        assert.equal(unitUnderTest.cFlags.length, 0, "C compiler flag count");
        assert.equal(unitUnderTest.cppFlags.length, 0, "Preprocessor flag count");
        assert.equal(unitUnderTest.cxxFlags.length, 0, "C++ compiler flag count");
        assert.equal(unitUnderTest.objcFlags.length, 0, "Objective-C compiler flag count");
        assert.strictEqual(unitUnderTest.language, null, "Source file language");
    });

    test("Invalid Entry Directory Missing", () => {
        let cmakeCompileCmd = {
            command: "gcc -g -O2 -c -o main.o main.c",
            file: "/home/me/Documents/Projects/MyProject/src/main.c"
        };

        assert.throws(() => {
            let unitUnderTest : CmakeCompileCmd = new CmakeCompileCmd(cmakeCompileCmd);
        }, (err : any) : boolean => {
            return (err instanceof Error) && (err.toString() == "Error: CMake compile command must contain string 'directory' field.");
        }, "Missing directory field.");
    });

    test("Invalid Entry Directory Wrong Type", () => {
        let cmakeCompileCmd = {
            directory: 0,
            command: "gcc -g -O2 -c -o main.o main.c",
            file: "/home/me/Documents/Projects/MyProject/src/main.c"
        };

        assert.throws(() => {
            let unitUnderTest : CmakeCompileCmd = new CmakeCompileCmd(cmakeCompileCmd);
        }, (err : any) : boolean => {
            return (err instanceof Error) && (err.toString() == "Error: CMake compile command must contain string 'directory' field.");
        }, "Invalid directory field.");
    });

    test("Invalid Entry Command Missing", () => {
        let cmakeCompileCmd = {
            directory: "/home/me/Documents/Projects/MyProject/build",
            file: "/home/me/Documents/Projects/MyProject/src/main.c"
        };

        assert.throws(() => {
            let unitUnderTest : CmakeCompileCmd = new CmakeCompileCmd(cmakeCompileCmd);
        }, (err : any) : boolean => {
            return (err instanceof Error) && (err.toString() == "Error: CMake compile command must contain string 'command' field.");
        }, "Missing command field.");
    });

    test("Invalid Entry Command Wrong Type", () => {
        let cmakeCompileCmd = {
            directory: "/home/me/Documents/Projects/MyProject/build",
            command: 0,
            file: "/home/me/Documents/Projects/MyProject/src/main.c"
        };

        assert.throws(() => {
            let unitUnderTest : CmakeCompileCmd = new CmakeCompileCmd(cmakeCompileCmd);
        }, (err : any) : boolean => {
            return (err instanceof Error) && (err.toString() == "Error: CMake compile command must contain string 'command' field.");
        }, "Invalid command field.");
    });

    test("Invalid Entry File Missing", () => {
        let cmakeCompileCmd = {
            directory: "/home/me/Documents/Projects/MyProject/build",
            command: "gcc -g -O2 -c -o main.o main.c"
        };

        assert.throws(() => {
            let unitUnderTest : CmakeCompileCmd = new CmakeCompileCmd(cmakeCompileCmd);
        }, (err : any) : boolean => {
            return (err instanceof Error) && (err.toString() == "Error: CMake compile command must contain string 'file' field.");
        }, "Missing file field.");
    });

    test("Invalid Entry File Wrong Type", () => {
        let cmakeCompileCmd = {
            directory: "/home/me/Documents/Projects/MyProject/build",
            command: "gcc -g -O2 -c -o main.o main.c",
            file: 0
        };

        assert.throws(() => {
            let unitUnderTest : CmakeCompileCmd = new CmakeCompileCmd(cmakeCompileCmd);
        }, (err : any) : boolean => {
            return (err instanceof Error) && (err.toString() == "Error: CMake compile command must contain string 'file' field.");
        }, "Invalid file field.");
    });

    test("Typical Native Compile Harvest (GCC, C)", () => {
        let cmakeCompileCmd = {
            directory: "/home/me/Documents/Projects/MyProject/build",
            command: "gcc -D_DEBUG -D_POSIX_C_SOURCE=200112L -I. -I../src -I/opt/coredx/target/include -std=gnu11 -g -O2 -c -o main.o main.c",
            file: "/home/me/Documents/Projects/MyProject/src/main.c"
        };

        let unitUnderTest : CmakeCompileCmd = new CmakeCompileCmd(cmakeCompileCmd);
        assert.equal(unitUnderTest.cFlags.length, 1, "C compiler flag count");
        assert.equal(unitUnderTest.cFlags[0], "-std=gnu11", "C compiler language standard.");
        assert.equal(unitUnderTest.cppFlags.length, 5, "Preprocessor flag count");
        [
            "-D_DEBUG",
            "-D_POSIX_C_SOURCE=200112L",
            "-I/home/me/Documents/Projects/MyProject/build",
            "-I/home/me/Documents/Projects/MyProject/src",
            "-I/opt/coredx/target/include"
        ].forEach((aCppArg : string, index : number) => {
            assert.equal(unitUnderTest.cppFlags[index], aCppArg, "Preprocessor argument '" + aCppArg + "'");
        });
        assert.equal(unitUnderTest.cxxFlags.length, 0, "C++ compiler flag count");
        assert.equal(unitUnderTest.objcFlags.length, 0, "Objective-C compiler flag count");
        assert.strictEqual(unitUnderTest.language, CmakeCompileCmd.LANG_C, "Source file language");
    });

    test("Typical Cross Compile Harvest (GCC, C)", () => {
        let cmakeCompileCmd = {
            directory: "/home/me/Documents/Projects/MyProject/build",
            command: "armv7-none-linux-gnueabi-gcc -D_DEBUG -D_POSIX_C_SOURCE=200112L --sysroot=/opt/yocto/sysroots/armv7-none-linux-gnueabi -I. -I../src -I/opt/coredx/target/include -std=gnu11 -g -O2 -c -o main.o main.c",
            file: "/home/me/Documents/Projects/MyProject/src/main.c"
        };

        let unitUnderTest : CmakeCompileCmd = new CmakeCompileCmd(cmakeCompileCmd);
        assert.equal(unitUnderTest.cFlags.length, 2, "C compiler flag count");
        [
            "-std=gnu11",
            "--sysroot=/opt/yocto/sysroots/armv7-none-linux-gnueabi",
        ].forEach((aCFlag : string, index : number) => {
            assert.equal(unitUnderTest.cFlags[index], aCFlag, "C Compiler flag '" + aCFlag + "'");
        });
        assert.equal(unitUnderTest.cppFlags.length, 5, "Preprocessor flag count");
        [
            "-D_DEBUG",
            "-D_POSIX_C_SOURCE=200112L",
            "-I/home/me/Documents/Projects/MyProject/build",
            "-I/home/me/Documents/Projects/MyProject/src",
            "-I/opt/coredx/target/include"
        ].forEach((aCppArg : string, index : number) => {
            assert.equal(unitUnderTest.cppFlags[index], aCppArg, "Preprocessor argument '" + aCppArg + "'");
        });
        assert.equal(unitUnderTest.cxxFlags.length, 1, "C++ compiler flag count");
        assert.equal(unitUnderTest.cxxFlags[0], "--sysroot=/opt/yocto/sysroots/armv7-none-linux-gnueabi");
        assert.equal(unitUnderTest.objcFlags.length, 0, "Objective-C compiler flag count");
        assert.strictEqual(unitUnderTest.language, CmakeCompileCmd.LANG_C, "Source file language");
    });

    test("Typical Cross Compile Harvest (CLang, C)", () => {
        let cmakeCompileCmd = {
            directory: "/home/me/Documents/Projects/MyProject/build",
            command: "clang -D_DEBUG -D_POSIX_C_SOURCE=200112L -target armv7-none-linux-gnueabi --sysroot=/opt/yocto/sysroots/armv7-none-linux-gnueabi -I. -I../src -I/opt/coredx/target/include -std=c11 -g -O2 -c -o main.o main.c",
            file: "/home/me/Documents/Projects/MyProject/src/main.c"
        };

        let unitUnderTest : CmakeCompileCmd = new CmakeCompileCmd(cmakeCompileCmd);
        assert.equal(unitUnderTest.cFlags.length, 4, "C compiler flag count");
        [
            "-std=c11",
            "--sysroot=/opt/yocto/sysroots/armv7-none-linux-gnueabi",
            "-target",
            "armv7-none-linux-gnueabi",
        ].forEach((aCFlag : string, index : number) => {
            assert.equal(unitUnderTest.cFlags[index], aCFlag, "C Compiler flag '" + aCFlag + "'");
        });
        assert.equal(unitUnderTest.cppFlags.length, 5, "Preprocessor flag count");
        [
            "-D_DEBUG",
            "-D_POSIX_C_SOURCE=200112L",
            "-I/home/me/Documents/Projects/MyProject/build",
            "-I/home/me/Documents/Projects/MyProject/src",
            "-I/opt/coredx/target/include"
        ].forEach((aCppArg : string, index : number) => {
            assert.equal(unitUnderTest.cppFlags[index], aCppArg, "Preprocessor argument '" + aCppArg + "'");
        });
        assert.equal(unitUnderTest.cxxFlags.length, 3, "C++ compiler flag count");
        [
            "--sysroot=/opt/yocto/sysroots/armv7-none-linux-gnueabi",
            "-target",
            "armv7-none-linux-gnueabi"
        ].forEach((aCxxFlag : string, index : number) => {
            assert.equal(unitUnderTest.cxxFlags[index], aCxxFlag, "C++ Compiler flag '" + aCxxFlag + "'");
        });
        assert.equal(unitUnderTest.objcFlags.length, 0, "Objective-C compiler flag count");
        assert.strictEqual(unitUnderTest.language, CmakeCompileCmd.LANG_C, "Source file language");
    });

    test("Typical Native Compile Harvest (GCC, C++)", () => {
        let cmakeCompileCmd = {
            directory: "/home/me/Documents/Projects/MyProject/build",
            command: "g++ -D_DEBUG -D_POSIX_C_SOURCE=200112L -I. -I../src -I/opt/coredx/target/include -std=gnu++11 -g -O2 -c -o main.o main.cpp",
            file: "/home/me/Documents/Projects/MyProject/src/main.cpp"
        };

        let unitUnderTest : CmakeCompileCmd = new CmakeCompileCmd(cmakeCompileCmd);
        assert.equal(unitUnderTest.cFlags.length, 0, "C compiler flag count");
        assert.equal(unitUnderTest.cppFlags.length, 5, "Preprocessor flag count");
        [
            "-D_DEBUG",
            "-D_POSIX_C_SOURCE=200112L",
            "-I/home/me/Documents/Projects/MyProject/build",
            "-I/home/me/Documents/Projects/MyProject/src",
            "-I/opt/coredx/target/include"
        ].forEach((aCppArg : string, index : number) => {
            assert.equal(unitUnderTest.cppFlags[index], aCppArg, "Preprocessor argument '" + aCppArg + "'");
        });
        assert.equal(unitUnderTest.cxxFlags.length, 1, "C++ compiler flag count");
        assert.equal(unitUnderTest.cxxFlags[0], "-std=gnu++11", "C++ Compiler flag '-std=gnu++11'");
        assert.equal(unitUnderTest.objcFlags.length, 0, "Objective-C compiler flag count");
        assert.strictEqual(unitUnderTest.language, CmakeCompileCmd.LANG_CXX, "Source file language");
    });

    test("Typical Cross Compile Harvest (GCC, C++)", () => {
        let cmakeCompileCmd = {
            directory: "/home/me/Documents/Projects/MyProject/build",
            command: "armv7-none-linux-gnueabi-g++ -D_DEBUG -D_POSIX_C_SOURCE=200112L --sysroot=/opt/yocto/sysroots/armv7-none-linux-gnueabi -I. -I../src -I/opt/coredx/target/include -std=gnu++11 -g -O2 -c -o main.o main.cxx",
            file: "/home/me/Documents/Projects/MyProject/src/main.cxx"
        };

        let unitUnderTest : CmakeCompileCmd = new CmakeCompileCmd(cmakeCompileCmd);
        assert.equal(unitUnderTest.cFlags.length, 1, "C compiler flag count");
        [
            "--sysroot=/opt/yocto/sysroots/armv7-none-linux-gnueabi"
        ].forEach((aCFlag : string, index : number) => {
            assert.equal(unitUnderTest.cFlags[index], aCFlag, "C Compiler flag '" + aCFlag + "'");
        });
        assert.equal(unitUnderTest.cppFlags.length, 5, "Preprocessor flag count");
        [
            "-D_DEBUG",
            "-D_POSIX_C_SOURCE=200112L",
            "-I/home/me/Documents/Projects/MyProject/build",
            "-I/home/me/Documents/Projects/MyProject/src",
            "-I/opt/coredx/target/include"
        ].forEach((aCppArg : string, index : number) => {
            assert.equal(unitUnderTest.cppFlags[index], aCppArg, "Preprocessor argument '" + aCppArg + "'");
        });
        assert.equal(unitUnderTest.cxxFlags.length, 2, "C++ compiler flag count");
        [
            "-std=gnu++11",
            "--sysroot=/opt/yocto/sysroots/armv7-none-linux-gnueabi"
        ].forEach((aCxxFlag : string, index : number) => {
            assert.equal(unitUnderTest.cxxFlags[index], aCxxFlag, "C++ Compiler flag '" + aCxxFlag + "'");
        });
        assert.equal(unitUnderTest.objcFlags.length, 0, "Objective-C compiler flag count");
        assert.strictEqual(unitUnderTest.language, CmakeCompileCmd.LANG_CXX, "Source file language");
    });

    test("Typical Cross Compile Harvest (CLang, C++)", () => {
        let cmakeCompileCmd = {
            directory: "/home/me/Documents/Projects/MyProject/build",
            command: "clang++ -D_DEBUG -D_POSIX_C_SOURCE=200112L -target armv7-none-linux-gnueabi --sysroot=/opt/yocto/sysroots/armv7-none-linux-gnueabi -I. -I../src -I/opt/coredx/target/include -std=c++11 -g -O2 -c -o main.o main.cc",
            file: "/home/me/Documents/Projects/MyProject/src/main.cc"
        };

        let unitUnderTest : CmakeCompileCmd = new CmakeCompileCmd(cmakeCompileCmd);
        assert.equal(unitUnderTest.cFlags.length, 3, "C compiler flag count");
        [
            "--sysroot=/opt/yocto/sysroots/armv7-none-linux-gnueabi",
            "-target",
            "armv7-none-linux-gnueabi"
        ].forEach((aCFlag : string, index : number) => {
            assert.equal(unitUnderTest.cFlags[index], aCFlag, "C Compiler flag '" + aCFlag + "'");
        });
        assert.equal(unitUnderTest.cFlags[0], "--sysroot=/opt/yocto/sysroots/armv7-none-linux-gnueabi");
        assert.equal(unitUnderTest.cppFlags.length, 5, "Preprocessor flag count");
        [
            "-D_DEBUG",
            "-D_POSIX_C_SOURCE=200112L",
            "-I/home/me/Documents/Projects/MyProject/build",
            "-I/home/me/Documents/Projects/MyProject/src",
            "-I/opt/coredx/target/include"
        ].forEach((aCppArg : string, index : number) => {
            assert.equal(unitUnderTest.cppFlags[index], aCppArg, "Preprocessor argument '" + aCppArg + "'");
        });
        assert.equal(unitUnderTest.cxxFlags.length, 4, "C++ compiler flag count");
        [
            "-std=c++11",
            "--sysroot=/opt/yocto/sysroots/armv7-none-linux-gnueabi",
            "-target",
            "armv7-none-linux-gnueabi"
        ].forEach((aCxxFlag : string, index : number) => {
            assert.equal(unitUnderTest.cxxFlags[index], aCxxFlag, "C++ Compiler flag '" + aCxxFlag + "'");
        });
        assert.equal(unitUnderTest.objcFlags.length, 0, "Objective-C compiler flag count");
        assert.strictEqual(unitUnderTest.language, CmakeCompileCmd.LANG_CXX, "Source file language");
    });
});
