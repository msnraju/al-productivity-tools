import * as fs from "fs";
import * as path from "path";
import JSZip = require("jszip");
import { WorkspaceHelper } from "../helpers/workspace-helper";

export class ZipUtil {
  static extractALPackages() {
    try {
      const wsFolders = WorkspaceHelper.getWorkSpaceFolders();
      const filePath: string = path.resolve(wsFolders[0] + "\\.alpackages");
      fs.readdirSync(filePath)
        .filter((p) => path.extname(p).toLowerCase() === ".app")
        .forEach((filePath) => {
          ZipUtil.extractALPackage(filePath);
        });
    } catch (err) {
      console.log(err);
    }
  }

  private static extractALPackage(filePath: string) {
    fs.readFile(filePath, function (err, data) {
      if (!err) {
        throw err;
      }

      var zip = new JSZip();
      zip.loadAsync(data).then(function (contents) {
        Object.keys(contents.files).forEach(function (filename) {
          const file = zip.file(filename);
          if (file) {
            file.async("nodebuffer").then(function (content) {
              var dest = path + filename;
              fs.writeFileSync(dest, content);
            });
          }
        });
      });
    });
  }
}
