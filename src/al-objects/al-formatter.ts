import fs = require("fs");
import path = require("path");
import IFormatSetting from "../helpers/models/format-settings.model";
import ObjectFormatter from "./object-formatter";

export default class ALFormatter {
  static formatAllALFiles(folderPath: string, formatSetting: IFormatSetting) {
    folderPath = path.resolve(folderPath);

    const files = fs.readdirSync(folderPath);
    files.forEach((file) => {
      const fileName = `${folderPath}\\${file}`;
      if (fs.lstatSync(fileName).isDirectory()) {
        this.formatAllALFiles(fileName, formatSetting);
      } else if (file.toLowerCase().endsWith(".al")) {
        this.formatALFile(fileName, formatSetting);
      }
    });
  }

  private static formatALFile(filePath: string, formatSetting: IFormatSetting) {
    filePath = path.resolve(filePath);
    const data = fs.readFileSync(filePath);
    const content = data.toString();
    const newContent = ObjectFormatter.format(content, formatSetting);
    fs.writeFileSync(filePath, newContent);
  }

  // static start() {
  //   this.formatAllALFiles("./assets/AppObject");
  //   console.log("All Done!");
  // }
}
