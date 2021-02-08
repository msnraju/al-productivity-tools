import * as vscode from "vscode";
import * as path from "path";
import ALFileCommands from "./al-file-commands";

export default class WorkspaceEvents {
  static async onDidSaveTextDocument(doc: vscode.TextDocument) {
    if (path.extname(doc.fileName).toLowerCase() != ".al") {
      return;
    }

    const config = vscode.workspace.getConfiguration("msn", doc.uri);
    const renameFileNameOnSave = config.get("renameFileNameOnSave") as boolean;

    if (renameFileNameOnSave) {
      await ALFileCommands.renameALFile();
    }
  }

  static onDidOpenTextDocument(e: vscode.TextDocument) {
    // vscode.window.showInformationMessage("opening text document");
  }
}
