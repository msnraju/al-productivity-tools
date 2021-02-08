import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import ALFileHelper from "./al-file-helper";
import simpleGit from "simple-git";
import { v4 as uuidv4 } from "uuid";

export default class ALFileCommands {
  static insertGuid() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    const pos = editor.selection.active;
    editor.edit((editBuilder) => {
      editBuilder.delete(editor.selection);
      editBuilder.insert(pos, uuidv4());
    });
  }

  static fixALFileNamingNotation() {
    if (!vscode.workspace.workspaceFolders) return;

    try {
      vscode.workspace.workspaceFolders.forEach((folder) => {
        let git = false;
        if (fs.lstatSync(path.join(folder.uri.fsPath, ".git")).isDirectory()) {
          git = true;
        }

        ALFileHelper.renameALFiles(folder.uri.fsPath, (oldFile, newFile) => {
          this.renameALFileInternal(oldFile, newFile, git, folder.uri.fsPath);
        });
      });

      vscode.window.showInformationMessage(
        "AL file names corrected as per the best practices"
      );
    } catch (err) {
      vscode.window.showErrorMessage(
        "An error occurred while standardizing AL files in this workspace."
      );
    }
  }

  static async fixALCurrentFileNamingNotation() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;
    if (path.extname(editor.document.fileName).toLowerCase() != ".al") return;

    try {
      if (editor.document.isDirty) {
        await editor.document.save();
      }

      await ALFileCommands.renameALFile();
    } catch (err) {
      vscode.window.showErrorMessage(
        "An error occurred while standardizing AL file name."
      );
    }
  }

  static async renameALFile() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;
    if (path.extname(editor.document.fileName).toLowerCase() != ".al") return;

    const oldFile = editor.document.fileName;
    const newFile = await ALFileHelper.getALFileName(editor.document.fileName);

    if (oldFile.toLowerCase() === newFile.toLowerCase()) return;

    const folder = vscode.workspace.getWorkspaceFolder(editor.document.uri);
    if (
      folder &&
      fs.lstatSync(path.join(folder.uri.fsPath, ".git")).isDirectory()
    ) {
      this.renameALFileInternal(
        oldFile,
        newFile,
        true,
        folder.uri.fsPath,
        this.openNewALFile
      );
    } else
      this.renameALFileInternal(
        oldFile,
        newFile,
        false,
        "",
        this.openNewALFile
      );
  }

  private static renameALFileInternal(
    oldFile: string,
    newFile: string,
    git: boolean,
    gitPath: string,
    openNewFile: ((newFile: string) => void) | undefined = undefined
  ) {
    if (oldFile === newFile) {
      return;
    }

    if (git)
      simpleGit(gitPath).mv(oldFile, newFile, () => {
        if (openNewFile) openNewFile(newFile);
      });
    else {
      fs.renameSync(oldFile, newFile);
      if (openNewFile) openNewFile(newFile);
    }
  }

  private static openNewALFile(newFile: string) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;
    const position = editor.selection.active;

    vscode.commands
      .executeCommand("workbench.action.closeActiveEditor")
      .then(() => {
        var openPath = vscode.Uri.parse("file:///" + newFile);

        vscode.workspace.openTextDocument(openPath).then((doc) => {
          vscode.window.showTextDocument(doc).then(() => {
            ALFileCommands.setCursorPosition(position);
          });
        });
      });
  }

  private static setCursorPosition(position: vscode.Position) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    editor.selection = new vscode.Selection(position, position);
    editor.revealRange(new vscode.Range(position, position));
  }
}
