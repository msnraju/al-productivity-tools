import * as vscode from "vscode";
import { languages, workspace } from "vscode";
import ALFormatter from "../al-objects/al-formatter";
import ObjectFormatter from "../al-objects/object-formatter";
import IFormatError from "../helpers/models/format-error.model";
import IFormatSetting from "../helpers/models/format-settings.model";

export default class ALCodeCop {
  static importTooltips() {
    vscode.window
      .showOpenDialog({
        canSelectFiles: true,
        filters: { Excel: ["xlsx"] },
      })
      .then((v) => {
        vscode.window.showInformationMessage("file selected");
      });
  }

  private static getFormatSettings(): IFormatSetting {
    const config = vscode.workspace.getConfiguration("msn");
    const settings: IFormatSetting = {
      renameFileNameOnSave: config.get("renameFileNameOnSave") as boolean,
      wrapProcedure: config.get("wrapProcedure") as boolean,
      sortVariables: config.get("sortVariables") as boolean,
      sortProcedures: config.get("sortProcedures") as boolean,
      convertKeywordsToAL: config.get("convertKeywordsToAL") as boolean,
      appendParenthesisAfterProcedures: config.get(
        "appendParenthesisAfterProcedures"
      ) as boolean,
      removeUnusedLocalProcedures: config.get(
        "removeUnusedLocalProcedures"
      ) as boolean,
      removeUnusedLocalVariables: config.get(
        "removeUnusedLocalVariables"
      ) as boolean,
      removeUnusedGlobalVariables: config.get(
        "removeUnusedGlobalVariables"
      ) as boolean,
      removeUnusedParameters: config.get("removeUnusedParameters") as boolean,
      autoCorrectVariableNames: config.get(
        "autoCorrectVariableNames"
      ) as boolean,
      setDefaultDataClassification: config.get(
        "setDefaultDataClassification"
      ) as boolean,
    };

    return settings;
  }

  static fixALCodeCopIssues() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

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
      const settings = ALCodeCop.getFormatSettings();

      const formattedContent = ObjectFormatter.format(content, settings);

      if (content != formattedContent) {
        editor.edit((editBuilder) => {
          editBuilder.replace(range, formattedContent);
        });
      }
    } catch (err) {
      vscode.window.showErrorMessage(
        "An error occurred while reading this AL file!"
      );
    }
  }

  static fixALCodeCopIssuesInWorkspace() {
    if (!vscode.workspace.workspaceFolders) {
      return;
    }

    try {
      const settings = ALCodeCop.getFormatSettings();
      let errors: IFormatError[] = [];
      vscode.workspace.workspaceFolders.forEach((folder) => {
        ALFormatter.formatAllALFiles(folder.uri.fsPath, settings, errors);
      });

      if (errors.length > 0) {
        let message = "";
        errors.forEach((err) => {
          message += `file: ${err.file}, error: ${err.message}\r\n`;
        });

        vscode.window.showInformationMessage(
          `CodeCop issues fixed after ignoring ${errors.length} files."`
        );
      }
    } catch (err) {
      vscode.window.showErrorMessage(
        "An error occurred while fixing CodeCop issues!"
      );
    }
  }
}
