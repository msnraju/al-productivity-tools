import * as vscode from "vscode";
import * as path from "path";
import ALFileNameCommands from "./al-file-name-commands";

export default class WorkspaceEvents {
  static async onDidSaveTextDocument(doc: vscode.TextDocument) {
    if (path.extname(doc.fileName).toLowerCase() != ".al") return;
    
    const config = vscode.workspace.getConfiguration("msn", doc.uri);
    const fixALFileNameOnSave = config.get("fixALFileNameOnSave") as boolean;

    if (fixALFileNameOnSave)
      await ALFileNameCommands.renameALFile();
  }

  static onDidOpenTextDocument(e: vscode.TextDocument) {
    // vscode.window.showInformationMessage("opening text document");
  }
}
