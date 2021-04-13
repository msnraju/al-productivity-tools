import * as vscode from "vscode";

export class WorkspaceHelper {
  static getWorkSpaceFolders() {
    const wsFolders = [];

    if (vscode.workspace.workspaceFolders) {
      for (const folder of vscode.workspace.workspaceFolders) {
        wsFolders.push(folder.uri.fsPath);
      }
    }
    return wsFolders;
  }
}
