import * as vscode from "vscode";
import { ObjectReader } from "../al-objects/al-readers/object-reader";
import { ALFormatter } from "../al-objects/al-formatter";

export default class ALCodeCop {
  static fixALCodeCopIssues() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    try {
      const document = editor.document;

      // Get the word within the selection
      const content = document.getText();
      const lines = content.split("\n");
      const start = new vscode.Position(0, 0);
      const end = new vscode.Position(
        lines.length,
        lines[lines.length - 1].length
      );
      const range = new vscode.Range(start, end);

      const newContent = ObjectReader.convert(content);
      editor.edit((editBuilder) => {
        editBuilder.replace(range, newContent);
      });
    } catch (err) {
      vscode.window.showErrorMessage(
        "An error occurred while reading this AL file!"
      );
    }
  }

  static fixALCodeCopIssuesInWorkspace() {
    if (!vscode.workspace.workspaceFolders) return;

    try {
      vscode.workspace.workspaceFolders.forEach((folder) => {
        ALFormatter.readALFiles(folder.uri.fsPath);
      });
    } catch (err) {
      vscode.window.showInformationMessage(
        "An error occurred while standardizing AL files in this workspace!"
      );
    }
  }
}
