"use strict";

import * as vscode from "vscode";
import * as console from "console";
import * as fs from "fs";

export class clang_cpp_flags {
	cmakeTools = vscode.extensions.getExtension("vector-of-bool.cmake-tools");
	compileCommandsPath: string;
	workspaceSettingsPath: string;
	active: boolean = false;
	defaultIgnoreFlags: string[] = ["-c", "-o"];
	clangCFlagsName = "clang.cflags";
	clangCppFlagsName = "clang.cxxflags";
	cLanguageStandard = "-std=c11";
	cppLanguageStandard = "-std=c++1z";

	compileCommands: any;
	clangCppFlags: string[] = [];
	clangCFlags: string[] = [];
	workspaceSettings: any;

	constructor(compileCommandsPath: string, workspaceSettingsPath: string) {
		if (!compileCommandsPath || !workspaceSettingsPath) {
			return;
		}

		this.compileCommandsPath = compileCommandsPath;
		this.workspaceSettingsPath = workspaceSettingsPath;
		this.validateEnvironment();

		const onChange = () => this.updateClangCppFlags();

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

	updateClangCppFlags() {
		try {
			this.updateCompileCommands();
			this.updateClangCppFlagsInternal();
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

	updateClangCppFlagsInternal() {
		if (!this.compileCommands) {
			return;
		}

		this.updateCppFlags();
		this.updateWorkspaceSettings();
		this.writeWorkspaceSettings();
	}

	updateCppFlags() {
		let cppFlags: string[] = [];

		this.compileCommands.forEach(sourceCompileInfo => {
			if (sourceCompileInfo != undefined) {
				let compileCommand = sourceCompileInfo["command"];
				if (compileCommand != undefined) {
					compileCommand.split(" ").forEach(compileFlag => {
						if (this.isFlagRequired(compileFlag)) {
							cppFlags.push(compileFlag);
						}
					});
				}
			}
		});

		cppFlags = Array.from(new Set(cppFlags));

		this.clangCFlags = Array.from(cppFlags);
		this.clangCppFlags = Array.from(cppFlags);

		this.clangCFlags.push(this.cLanguageStandard);
		this.clangCppFlags.push(this.cppLanguageStandard);
	}

	updateWorkspaceSettings() {
		if (this.clangCFlags.length == 0) {
			this.workspaceSettings = undefined;
			return;
		}

		let origWorkspaceSettings = fs.readFileSync(this.workspaceSettingsPath, 'utf8');

		if (origWorkspaceSettings.length != 0) {
			this.workspaceSettings = JSON.parse(origWorkspaceSettings);
		} else {
			this.workspaceSettings = JSON.parse('{}');
		}

		delete this.workspaceSettings[this.clangCFlagsName];
		delete this.workspaceSettings[this.clangCppFlagsName];

		this.workspaceSettings[this.clangCFlagsName] = this.clangCFlags;
		this.workspaceSettings[this.clangCppFlagsName] = this.clangCppFlags;
	}

	writeWorkspaceSettings() {
		if (this.workspaceSettings) {
			fs.writeFileSync(
				this.workspaceSettingsPath,
				JSON.stringify(this.workspaceSettings, null, 4)
			);
		}
	}

	isFlagRequired(compileFlag: string): boolean {
		if (!compileFlag.startsWith("-")) {
			return false;
		}
		if (this.defaultIgnoreFlags.indexOf(compileFlag) > -1) {
			return false;
		}
		if (this.isOptimizationFlag(compileFlag)) {
			return false;
		}
		if (this.isLanguageStandardFlag(compileFlag)) {
			return false;
		}

		return true;
	}

	isLanguageStandardFlag(compileFlag: string): boolean {
		return compileFlag.startsWith("-std=");
	}

	isOptimizationFlag(compileFlag: string): boolean {
		return compileFlag.startsWith("-O");
	}
}
