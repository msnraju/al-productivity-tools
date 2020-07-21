import * as fs from "fs";
import LineByLine = require("n-readlines");

export default class FixALFileName {
  static async fixFileNames(folderName: string) {
    fs.readdir(folderName, function (err, files) {
      if (err) {
        return console.log("Unable to scan directory: " + err);
      }

      //listing all files using forEach
      files.forEach(async function (file) {
        const fileName = `${folderName}\\${file}`;
        if (fs.lstatSync(fileName).isDirectory()) {
          await FixALFileName.fixFileNames(fileName);
        } else {
          if (file.toLocaleUpperCase().endsWith(".AL"))
            await FixALFileName.renameFileName(folderName, file);
        }
      });
    });
  }

  static async renameFileName(folder: string, file: string) {
    let newFileName = "";
    const liner = new LineByLine(`${folder}\\${file}`);
    let buffer: Buffer | false;
    while ((buffer = liner.next())) {
      const line = buffer.toString("utf-8").trim();
      if (line.startsWith("//") || !line) continue;

      const headerExpr = line.indexOf(' extends ') != -1 ?
          /(\w*) (\d*) ("(.*)"|(.*)) extends (.*)/ : 
          /(\w*) (\d*) ("(.*)"|(.*))/;

      if (headerExpr.test(line)) {
        const match = headerExpr.exec(line);
        if (match) {
          let type = match[1];

          switch (type.toLowerCase()) {
            case "table":
              type = "Table";
              break;
            case "page":
              type = "Page";
              break;
            case "codeunit":
              type = "Codeunit";
              break;
            case "report":
              type = "Report";
              break;
            case "query":
              type = "Query";
              break;
            case "xmlport":
              type = "XmlPort";
              break;
            case "enum":
              type = "Enum";
              break;
            case "enumextension":
              type = "EnumExt";
              break;
            case "tableextension":
              type = "TableExt";
              break;
            case "pageextension":
              type = "PageExt";
              break;
          }

          const name = (match[5] || "") + (match[4] || "");
          newFileName = `${name.replace(/[^a-zA-Z0-9]/g, "")}.${type}.al`;
          liner.close();
          fs.rename(
            `${folder}\\${file}`,
            `${folder}\\${newFileName}`,
            () => {}
          );
          break;
        }
      }
    }
  }
}
