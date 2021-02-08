import fs = require("fs");
import path = require("path");
import IFormatError from "../helpers/models/format-error.model";
import IFormatSetting from "../helpers/models/format-settings.model";
import ObjectFormatter from "./object-formatter";

export default class ALFormatter {
  static formatAllALFiles(
    folderPath: string,
    formatSetting: IFormatSetting,
    errors: IFormatError[]
  ) {
    folderPath = path.resolve(folderPath);
    const files = fs.readdirSync(folderPath);
    files.forEach((file) => {
      try {
        const fileName = `${folderPath}\\${file}`;
        if (fs.lstatSync(fileName).isDirectory()) {
          this.formatAllALFiles(fileName, formatSetting, errors);
        } else if (file.toLowerCase().endsWith(".al")) {
          this.formatALFile(fileName, formatSetting);
        }
      } catch (err) {
        errors.push({ file: file, message: err.message });
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
