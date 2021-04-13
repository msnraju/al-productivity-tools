import * as fs from "fs";
import * as path from "path";
import JSZip = require("jszip");
import { WorkspaceHelper } from "../helpers/workspace-helper";
import _ = require("lodash");

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

  private static extractAppFiles(
    packagePath: string,
    symbolsPath: string
  ): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const promises: Promise<string[]>[] = [];
      fs.readdirSync(packagePath)
        .filter((p) => path.extname(p).toLowerCase() === ".app")
        .forEach((file) => {
          const promise = ZipUtil.extractALPackage(
            packagePath,
            file,
            symbolsPath
          );
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

  private static extractALPackage(
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

        ZipUtil.extractZipFile(data, destFolder)
          .then((files) => {
            resolve(files);
          })
          .catch((reason) => {
            reject(reason);
          });
      });
    });
  }

  private static extractZipFile(
    data: Buffer,
    destFolder: string
  ): Promise<string[]> {
    return new Promise((resolve, reject) => {
      try {
        var zip = new JSZip();
        zip.loadAsync(data, { createFolders: true }).then(function (contents) {
          try {
            const files = Object.keys(contents.files);
            const promises: Promise<string>[] = [];
            files.forEach(function (filename) {
              const promise = ZipUtil.saveZipFile(zip, filename, destFolder);
              promises.push(promise);
            });

            Promise.all(promises).then((files) => {
              resolve(files);
            });
          } catch (err) {
            reject(err);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  private static saveZipFile(
    zip: JSZip,
    filename: string,
    destFolder: string
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
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
            reject(`${filename} is not a folder or a file.`);
          }
        }
      } catch (err) {
        reject(err);
      }
    });
  }
}
