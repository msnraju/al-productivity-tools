import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import LineByLine = require("n-readlines");
import ALObjectTypes from "../al-objects/al-object-types";
import { IObjectDefinition } from "../al-objects/object-definition";

export default class ALFileNameFixer {
  static fixALFileNamingNotation() {
    if (!vscode.workspace.workspaceFolders) return;

    try {
      vscode.workspace.workspaceFolders.forEach((workspaceFolder) => {
        this.fixFileNames(workspaceFolder.uri.fsPath);
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

  static fixALCurrentFileNamingNotation() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    try {
      editor.document.save().then(() => {        
        this.renameFile(editor.document.fileName);
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

  private static renameFile(file: string): string | undefined {
    const liner = new LineByLine(file);
    let buffer: Buffer | false;
    while ((buffer = liner.next())) {
      const line = buffer.toString("utf-8").trim();
      if (line.startsWith("//") || !line) continue;

      const object = this.getObject(line);
      if (object) {
        liner.close();

        const suffix = ALObjectTypes.getALObjectSuffix(object.type);
        let newObjectName = object.name.replace(/[^a-zA-Z0-9 ]*/g, "");

        const newFileName = `${newObjectName}.${suffix}.al`;
        const folder = path.basename(path.dirname(file));
        const newFilePath = `${folder}\\${newFileName}`;
        fs.renameSync(file, newFilePath);
        return newFilePath;
      }
    }
  }

  private static getObject(line: string): IObjectDefinition | undefined {
    const ExtensionExpr = /(tableextension|pageextension|enumextension)\s+(\d*|id)\s+("(.*)"|(.*))\s+extends\s+("(.*)"|(.*))/i;
    const AppObjectExpr = /(table|page|codeunit|report|query|xmlport|enum)\s+(\d*|id)\s+("(.*)"|(.*))/i;
    const ObjectExpr = /(controladdin|interface)\s+("(.*)"|(.*))/i;

    if (ExtensionExpr.test(line)) {
      const match = ExtensionExpr.exec(line);
      if (match)
        return {
          type: match[1],
          id: match[2],
          name: (match[4] || "") + (match[5] || ""),
          extension: true,
          extends: (match[7] || "") + (match[8] || ""),
        };
    } else if (AppObjectExpr.test(line)) {
      const match = AppObjectExpr.exec(line);
      if (match)
        return {
          type: match[1],
          id: match[2],
          name: (match[4] || "") + (match[5] || ""),
        };
    } else if (ObjectExpr.test(line)) {
      const match = ObjectExpr.exec(line);
      if (match)
        return {
          type: match[1],
          name: (match[3] || "") + (match[4] || ""),
        };
    }
  }

  private static fixFileNames(path: string) {
    fs.readdir(path, (err, files) => {
      if (err) {
        return console.log("Unable to scan directory: " + err);
      }

      //listing all files using forEach
      files.forEach(async (file) => {
        const fileName = `${path}\\${file}`;
        if (fs.lstatSync(fileName).isDirectory()) {
          this.fixFileNames(fileName);
        } else {
          if (file.toLowerCase().endsWith(".al")) this.renameFile(fileName);
        }
      });
    });
  }
}
