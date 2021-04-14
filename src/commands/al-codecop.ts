import * as vscode from "vscode";
import ALFormatter from "../al-objects/al-formatter";
import KeyValueMap from "../al-objects/maps/key-value-map";
import ObjectFormatter from "../al-objects/object-formatter";
import { AppSymbolsCache } from "../al-packages/app-symbols-cache";
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

    const extFunctions = config.get("extensionFunctions") as string[];
    const functionsMap: KeyValueMap = new KeyValueMap();
    extFunctions.forEach((func) => {
      functionsMap[func.toLowerCase()] = func;
    });

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
      setDefaultApplicationArea: config.get(
        "setDefaultApplicationArea"
      ) as boolean,
      setDefaultDataClassification: config.get(
        "setDefaultDataClassification"
      ) as boolean,
      qualifyWithRecPrefix: config.get("qualifyWithRecPrefix") as boolean,
      extensionFunctions: functionsMap,
      symbols: [],
    };

    return settings;
  }

  static async fixALCodeCopIssues() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    try {
      const document = editor.document;
      const content = document.getText();
      const lines = content.split("\n");
      const settings = ALCodeCop.getFormatSettings();
      settings.symbols = await AppSymbolsCache.getSymbols();
      const formattedContent = ObjectFormatter.format(content, settings);

      if (content !== formattedContent) {
        const start = new vscode.Position(0, 0);
        const end = new vscode.Position(
          lines.length,
          lines[lines.length - 1].length
        );
        const range = new vscode.Range(start, end);
        editor.edit((editBuilder) => {
          editBuilder.replace(range, formattedContent);
        });
      }

      vscode.window.showInformationMessage(`CodeCop issues fixed."`);
    } catch (err) {
      vscode.window.showErrorMessage(
        "An error occurred while reading this AL file!"
      );
    }
  }

  static async fixALCodeCopIssuesInWorkspace() {
    if (!vscode.workspace.workspaceFolders) {
      return;
    }

    const settings = ALCodeCop.getFormatSettings();
    settings.symbols = await AppSymbolsCache.getSymbols();

    let errors: IFormatError[] = [];
    vscode.workspace.workspaceFolders.forEach((folder) => {
      ALFormatter.formatAllALFiles(folder.uri.fsPath, settings, errors)
        .then(() => {
          vscode.window.showInformationMessage(
            `CodeCop issues fixed after ignoring ${errors.length} files."`
          );
        })
        .catch((reason) => {
          vscode.window.showErrorMessage(
            "An error occurred while fixing CodeCop issues!"
          );
        });
    });
  }
}
