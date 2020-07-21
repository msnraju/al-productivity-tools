// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { ALFormatter } from "./al-readers/al-formatter";
import { ObjectReader } from "./al-readers/object-reader";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "al-productivity-tools" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "al-productivity-tools.standardizeALCode",
    () => {
      // The code you place here will be executed every time your command is executed
      try {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
          const document = editor.document;
          const selection = editor.selection;

          // Get the word within the selection
          const content = document.getText();
          const lines = content.split("\n");
          const s = new vscode.Position(0, 0);
          const e = new vscode.Position(
            lines.length,
            lines[lines.length - 1].length
          );
          const range = new vscode.Range(s, e);

          const newContent = ObjectReader.convert(content);
          editor.edit((editBuilder) => {
            editBuilder.replace(range, newContent);
          });
        }
      } catch (err) {
        vscode.window.showErrorMessage(
          "An error occurred while reading this AL file!"
        );
      }
    }
  );

  context.subscriptions.push(disposable);

  let disposable2 = vscode.commands.registerCommand(
    "al-productivity-tools.standardizeALFiles",
    () => {
      try {
        // The code you place here will be executed every time your command is executed
        if (vscode.workspace.workspaceFolders)
          ALFormatter.readALFiles(
            vscode.workspace.workspaceFolders[0].uri.fsPath
          );

        // Display a message box to the user
      } catch (err) {
        vscode.window.showInformationMessage(
			"An error occurred while standardizing AL files in this workspace!"
        );
      }
    }
  );

  context.subscriptions.push(disposable2);
}

// this method is called when your extension is deactivated
export function deactivate() {}
