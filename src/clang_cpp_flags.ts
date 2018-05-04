"use strict";

import * as vscode from "vscode";
import * as console from "console";
import * as fs from "fs";

import { CmakeCompileCmd } from './cmakecompilecmd';

export class clang_cpp_flags {
	cmakeTools = vscode.extensions.getExtension("vector-of-bool.cmake-tools");
	compileCommandsPath: string;
	workspaceSettingsPath: string;
	active: boolean = false;
	clangCFlagsName = "clang.cflags";
	clangCxxFlagsName = "clang.cxxflags";

	compileCommands: any;
	clangCxxFlags: string[] = [];
	clangCFlags: string[] = [];
	workspaceSettings: any;

	constructor(compileCommandsPath: string, workspaceSettingsPath: string) {
		if (!compileCommandsPath || !workspaceSettingsPath) {
			return;
		}

		this.compileCommandsPath = compileCommandsPath;
		this.workspaceSettingsPath = workspaceSettingsPath;
		this.validateEnvironment();

		const onChange = () => this.updateClangCompilerFlags();

		// update on build config change
		this.cmakeTools.exports.reconfigured(() => {
			onChange();
		});
		// update on default target change
		this.cmakeTools.exports.targetChangedEvent(() => {
			onChange();
		});

		// first update
		onChange();
		this.active = true;
	}

	validateEnvironment() {
		if (!this.cmakeTools.isActive) {
			const msg = "CMake Tools is not active";
			console.error(msg);
			vscode.window.showErrorMessage(msg);
		}
	}

	dispose() {}

	isActive(): boolean {
		return this.active;
	}

	updateClangCompilerFlags() {
		try {
			this.updateCompileCommands();
			this.updateClangCompilerFlagsInternal();
		} catch (e) {
			console.log(e);
		}
	}

	updateCompileCommands() {
		const compileCommandsString = fs.readFileSync(
			this.compileCommandsPath,
			"utf8"
		);
		this.compileCommands = JSON.parse(compileCommandsString);
	}

	updateClangCompilerFlagsInternal() {
		if (!this.compileCommands) {
			return;
		}

		this.updateLangFlags();
		this.updateWorkspaceSettings();
		this.writeWorkspaceSettings();
	}

	updateLangFlags() {
		// Transform each entry in the `compile_commands.json` file into a
		// `CmakeCompileCmd` instance.
		let parsedCmds : CmakeCompileCmd[] = this.compileCommands.map(
			(aCmakeCmd : string) : CmakeCompileCmd => {
				return new CmakeCompileCmd(aCmakeCmd);
			}
		);

		// Instantiate sets that will help eliminate duplicates parsed from
		// `compile_commands.json`
		let cFlagsSet = new Set();
		let cxxFlagsSet = new Set();

		// Based on the best-guess source language detected, populate the
		// option sets that will eventually be fed back to CLang Adpater
		// configuration.
		parsedCmds.forEach(
			(aParsedCmd : CmakeCompileCmd) : void => {
				if (aParsedCmd.language === CmakeCompileCmd.LANG_C) {
					aParsedCmd.cppFlags.forEach(aFlag => cFlagsSet.add(aFlag));
					aParsedCmd.cFlags.forEach(aFlag => cFlagsSet.add(aFlag));
				} else if (aParsedCmd.language === CmakeCompileCmd.LANG_CXX) {
					aParsedCmd.cppFlags.forEach(aFlag => cxxFlagsSet.add(aFlag));
					aParsedCmd.cxxFlags.forEach(aFlag => cxxFlagsSet.add(aFlag));
				}
			}
		);

		// Extract the result of the deduplication into the fields that will be
		// written to the CLang Adapter configuration.
		this.clangCFlags = Array.from(cFlagsSet);
		this.clangCxxFlags = Array.from(cxxFlagsSet);
	}

	updateWorkspaceSettings() {
		if (!this.clangCFlags.length && !this.clangCxxFlags.length) {
			this.workspaceSettings = undefined;
			return;
		}

		let origWorkspaceSettings = fs.readFileSync(this.workspaceSettingsPath, 'utf8');

		if (origWorkspaceSettings.length != 0) {
			try {
				this.workspaceSettings = JSON.parse(origWorkspaceSettings);
			} catch (ex) {
				console.warn("Could not read settings.json. Not updating.");
				this.workspaceSettings = undefined;
			}
		} else {
			this.workspaceSettings = JSON.parse('{}');
		}

		delete this.workspaceSettings[this.clangCFlagsName];
		delete this.workspaceSettings[this.clangCxxFlagsName];

		this.workspaceSettings[this.clangCFlagsName] = this.clangCFlags;
		this.workspaceSettings[this.clangCxxFlagsName] = this.clangCxxFlags;
	}

	writeWorkspaceSettings() {
		if (this.workspaceSettings) {
			fs.writeFileSync(
				this.workspaceSettingsPath,
				JSON.stringify(this.workspaceSettings, null, 4)
			);
		}
	}
}
