import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import JSZip = require("jszip");
import { WorkspaceHelper } from "../helpers/workspace-helper";
import _ = require("lodash");
import { AppSymbols } from "../symbol-references";

export class ZipUtil {
  static extractALPackages() {
    try {
      const wsFolders = WorkspaceHelper.getWorkSpaceFolders();
      const packagePath: string = path.resolve(wsFolders[0], ".alpackages");
      const symbolsPath: string = path.resolve(wsFolders[0], ".symbols");
      if (!fs.existsSync(symbolsPath)) {
        fs.mkdirSync(symbolsPath);
      }

      ZipUtil.extractAppFiles(packagePath, symbolsPath)
        .then((files) => {
          console.log(files);
        })
        .catch((reason) => {
          console.log(reason);
        });
    } catch (err) {
      console.log(err);
    }
  }

  static getSymbolsWithProgress() {
    return new Promise<AppSymbols[]>((resolve, reject) => {
      vscode.window
        .withProgress(
          {
            location: vscode.ProgressLocation.Window,
            cancellable: false,
            title: "Loading Symbol References",
          },
          async (progress) => {
            progress.report({ increment: 0 });
            const symbols = await ZipUtil.getSymbols();
            progress.report({ increment: 100 });
            return symbols;
          }
        )
        .then((symbols) => {
          resolve(symbols);
        });
    });
  }

  static getSymbols(): Promise<AppSymbols[]> {
    return new Promise<AppSymbols[]>((resolve, reject) => {
      try {
        const wsFolders = WorkspaceHelper.getWorkSpaceFolders();
        const packagePath: string = path.resolve(wsFolders[0], ".alpackages");

        const promises: Promise<AppSymbols>[] = [];
        const appFiles = ZipUtil.getAppFiles(packagePath).map((appFile) => {
          return path.resolve(packagePath, appFile);
        });

        const currAppFiles = fs
          .readdirSync(wsFolders[0])
          .filter((p) => path.extname(p).toLowerCase() === ".app");
        const currAppFile = _.last(currAppFiles);
        if (currAppFile) {
          appFiles.push(path.resolve(wsFolders[0], currAppFile));
        }

        appFiles.forEach((appFile) => {
          const promise = ZipUtil.extractSymbolReferences(appFile);
          promises.push(promise);
        });

        Promise.all(promises)
          .then((symbols) => {
            resolve(symbols);
          })
          .catch((reason) => {
            reject(reason);
          });
      } catch (err) {
        reject(err);
      }
    });
  }

  private static extractAppFiles(
    packagePath: string,
    symbolsPath: string
  ): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const promises: Promise<string[]>[] = [];

      ZipUtil.getAppFiles(packagePath).forEach((file) => {
        const promise = ZipUtil.extractAppFile(packagePath, file, symbolsPath);
        promises.push(promise);
      });

      Promise.all(promises)
        .then((files) => {
          resolve(_.flatten(files));
        })
        .catch((reason) => {
          reject(reason);
        });
    });
  }

  private static getAppFiles(packagePath: string) {
    return fs
      .readdirSync(packagePath)
      .filter((p) => path.extname(p).toLowerCase() === ".app");
  }

  private static extractAppFile(
    packagePath: string,
    file: string,
    symbolsPath: string
  ): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      const filePath = path.resolve(packagePath, file);
      fs.readFile(filePath, function (err, data) {
        if (err) {
          reject(err);
          return;
        }

        var extension = path.extname(file);
        const folderName = path.basename(filePath, extension);
        const destFolder = path.resolve(symbolsPath, folderName);
        if (!fs.existsSync(destFolder)) {
          fs.mkdirSync(destFolder);
        }

        ZipUtil.extractFiles(data, destFolder)
          .then((files) => {
            resolve(files);
          })
          .catch((reason) => {
            reject(reason);
          });
      });
    });
  }

  private static extractFiles(
    data: Buffer,
    destFolder: string
  ): Promise<string[]> {
    return new Promise((resolve, reject) => {
      var zip = new JSZip();
      zip.loadAsync(data, { createFolders: false }).then(function (contents) {
        const promises: Promise<string>[] = [];
        const files = Object.keys(contents.files);
        files.forEach(function (filename) {
          const promise = ZipUtil.saveZipFile(zip, filename, destFolder);
          promises.push(promise);
        });

        Promise.all(promises)
          .then((files) => {
            resolve(files);
          })
          .catch((reason) => {
            reject(reason);
          });
      });
    });
  }

  private static saveZipFile(
    zip: JSZip,
    filename: string,
    destFolder: string
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const file = zip.file(filename);
      if (file) {
        file.async("nodebuffer").then(function (content) {
          const dest = path.resolve(destFolder, filename);
          fs.writeFileSync(dest, content, { flag: "w" });
          resolve(dest);
        });
      } else {
        const folder = zip.folder(filename);
        if (folder) {
          const zipFolderPath = path.resolve(destFolder, filename);
          if (!fs.existsSync(zipFolderPath)) {
            fs.mkdirSync(zipFolderPath);
          }

          resolve(zipFolderPath);
        } else {
          reject(new Error(`${filename} is not a folder or a file.`));
        }
      }
    });
  }

  private static extractSymbolReferences(
    filePath: string
  ): Promise<AppSymbols> {
    return new Promise<AppSymbols>((resolve, reject) => {
      filePath = path.resolve(filePath);
      fs.readFile(filePath, function (err, data) {
        if (err) {
          reject(err);
        }

        ZipUtil.extractSymbolReference(data)
          .then((v) => {
            resolve(v);
          })
          .catch((reason) => {
            reject(reason);
          });
      });
    });
  }

  private static extractSymbolReference(data: Buffer): Promise<AppSymbols> {
    return new Promise((resolve, reject) => {
      var zip = new JSZip();
      zip.loadAsync(data, { createFolders: false }).then(function (contents) {
        const symbolReferenceFile = Object.keys(contents.files).find(
          (f) => f === "SymbolReference.json"
        );

        if (!symbolReferenceFile) {
          reject(`SymbolReference.json file not found.`);
          return;
        }

        const file = zip.file(symbolReferenceFile);
        if (file) {
          file
            .async("nodebuffer")
            .then((data) => {
              try {
                let content = data.toString("ascii", 3);
                content = content.replace(/[^\x1F-\x7F]+/g, "");
                const json = JSON.parse(content);
                resolve(json);
              } catch (err) {
                reject(err);
              }
            })
            .catch((reason) => {
              reject(reason);
            });
        }
      });
    });
  }
}
