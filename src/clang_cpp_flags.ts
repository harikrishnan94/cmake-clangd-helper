"use strict";

import * as vscode from "vscode";
import { Disposable } from "vscode";
import * as console from "console";
import * as fs from "fs";

export class clang_cpp_flags {
	cmakeTools = vscode.extensions.getExtension("vector-of-bool.cmake-tools");
	compileCommandsPath: string;
	workspaceSettingsPath: string;
	active: boolean = false;
	defaultIgnoreFlags: string[] = ["-c", "-o", "-g"];

	compileCommands: any;
	activeSourceFile: string;
	cppFlagName: string;
	cppFlags: string[] = [];
	workspaceSettings: any;

	constructor(compileCommandsPath: string, workspaceSettingsPath: string) {
		if (!compileCommandsPath || !workspaceSettingsPath) {
			return;
		}

		this.compileCommandsPath = compileCommandsPath;
		this.workspaceSettingsPath = workspaceSettingsPath;
		this.validateEnvironment();

		let subscriptions: Disposable[] = [];
		vscode.window.onDidChangeActiveTextEditor(
			this.updateClangCppFlags,
			this,
			subscriptions
		);

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
		this.updateActiveSourceFile();
		this.updateCompileCommands();
		this.updateClangCppFlagsInternal();
	}

	updateCompileCommands() {
		if (!this.activeSourceFile) {
			return;
		}

		const compileCommandsString = fs.readFileSync(
			this.compileCommandsPath,
			"utf8"
		);
		this.compileCommands = JSON.parse(compileCommandsString);
	}

	updateActiveSourceFile() {
		this.activeSourceFile = this.getActiveSourceFile();

		if (!this.isCFile() && !this.isCppFile()) {
			this.activeSourceFile = undefined;
		}
	}

	updateClangCppFlagsInternal() {
		if (!this.compileCommands) {
			return;
		}

		this.updateCppFlags();
		this.updateClangFlagName();
		this.updateWorkspaceSettings();
		this.writeWorkspaceSettings();
	}

	updateCppFlags() {
		const compileCommand = this.getCompileCommandForSourceFile(
			this.activeSourceFile
		);
		let cppFlags: string[] = [];

		if (compileCommand != undefined) {
			compileCommand.split(" ").forEach(compileFlag => {
				if (this.isFlagRequired(compileFlag)) {
					cppFlags.push(compileFlag);
				}
			});
		}

		this.cppFlags = cppFlags;
	}

	isCppFile() {
		return (
			this.activeSourceFile &&
			(this.activeSourceFile.endsWith(".h") ||
				this.activeSourceFile.endsWith(".hpp") ||
				this.activeSourceFile.endsWith(".hxx") ||
				this.activeSourceFile.endsWith(".cpp") ||
				this.activeSourceFile.endsWith(".cxx"))
		);
	}

	isCFile() {
		return (
			this.activeSourceFile &&
			(this.activeSourceFile.endsWith(".h") ||
				this.activeSourceFile.endsWith(".c"))
		);
	}

	updateClangFlagName() {
		if (this.isCppFile()) {
			this.cppFlagName = "clang.cxxflags";
		} else {
			this.cppFlagName = "clang.cflags";
		}
	}

	updateWorkspaceSettings() {
		if (!this.cppFlags || !this.cppFlagName) {
			return;
		}

		this.workspaceSettings = JSON.parse(
			fs.readFileSync(this.workspaceSettingsPath, "utf8")
		);

		this.workspaceSettings[this.cppFlagName];
		this.workspaceSettings[this.cppFlagName] = this.cppFlags;
	}

	writeWorkspaceSettings() {
		fs.writeFileSync(
			this.workspaceSettingsPath,
			JSON.stringify(this.workspaceSettings, null, 4)
		);
	}

	getCompileCommandForSourceFile(sourceFile: string): string {
		for (let sourceCompileInfo of this.compileCommands) {
			if (sourceCompileInfo["file"] === sourceFile) {
				return sourceCompileInfo["command"];
			}
		}

		return undefined;
	}

	getActiveSourceFile(): string {
		if (vscode.window.activeTextEditor)
			return vscode.window.activeTextEditor.document.fileName;

		return undefined;
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

		return true;
	}

	isOptimizationFlag(compileFlag: string): boolean {
		return compileFlag.startsWith("-O");
	}
}
