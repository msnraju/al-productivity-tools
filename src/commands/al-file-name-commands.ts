import * as vscode from "vscode";
import ALFileNameHelper from "./al-file-name-helper";

export default class ALFileNameCommands {
  static fixALFileNamingNotation() {
    if (!vscode.workspace.workspaceFolders) return;

    try {
      vscode.workspace.workspaceFolders.forEach((workspaceFolder) => {
        ALFileNameHelper.renameALFiles(workspaceFolder.uri.fsPath);
      });

      vscode.window.showInformationMessage(
        "AL file names corrected as per the best practices"
      );
    } catch (err) {
      vscode.window.showInformationMessage(
        "An error occurred while standardizing AL files in this workspace!"
      );
    }
  }

  static async fixALCurrentFileNamingNotation() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    // if (vscode.workspace.workspaceFolders) {
    //   vscode.workspace.workspaceFolders.forEach((workspaceFolder) => {
    //     ALFileNameHelper.getObjects(workspaceFolder.uri.fsPath).then(
    //       (objects) => {
    //         console.log(objects);
    //       }
    //     );
    //   });
    // }

    const position = editor.selection.active;

    try {
      editor.document.save().then(async (value) => {
        const oldFile = editor.document.fileName;
        const newFile = await ALFileNameHelper.renameALFile(
          editor.document.fileName
        );

        if (oldFile !== newFile) {
          vscode.commands
            .executeCommand("workbench.action.closeActiveEditor")
            .then(() => {
              var openPath = vscode.Uri.parse("file:///" + newFile);

              vscode.workspace.openTextDocument(openPath).then((doc) => {
                vscode.window.showTextDocument(doc).then(() => {
                  if (vscode.window.activeTextEditor) {
                    const editor = vscode.window.activeTextEditor;
                    editor.selection = new vscode.Selection(position, position);
                    editor.revealRange(new vscode.Range(position, position));
                  }

                  vscode.window.showInformationMessage(
                    "AL file names corrected as per the best practices"
                  );
                });
              });
            });
        }
      });
    } catch (err) {
      vscode.window.showInformationMessage(
        "An error occurred while standardizing AL files in this workspace!"
      );
    }
  }
}
