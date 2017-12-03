# CMake Clang Helper

This extension is similar to
[vscode-cmake-tools-helper]('https://github.com/maddouri/vscode-cmake-tools-helper').
It brings the power of following two extensions together.

* [vscode-clang (`mitaki28.vscode-clang`)](https://marketplace.visualstudio.com/items?itemName=mitaki28.vscode-clang)
	by mitaki28: Provides C and C++ language support (auto-completion and
	diagnostics)
* [CMake Tools (`vector-of-bool.cmake-tools`)](https://marketplace.visualstudio.com/items?itemName=vector-of-bool.cmake-tools)
	by vector-of-bool: Provides support for CMake-based projects (configure,
	build, etc.)

**CMake Clang Helper** enables vscode-clang to **automatically** know the
information parsed by CMake Tools (such as **include directories** and
**defines**) and use it to provide auto-completion and diagnostics.

## Features

* Automatically updates clang.cxxflags in `settings.json` with the current CMake
	target's information (**include directories** and **defines**)

## Prerequisites

* `cmake.compile_commands.json` set to `compile_commands.json` path.
* `cmake-tools`
