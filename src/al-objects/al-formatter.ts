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
    return new Promise<void>((resolve, reject) => {
      const promises: Promise<void>[] = [];

      folderPath = path.resolve(folderPath);
      const files = fs.readdirSync(folderPath);
      files.forEach((file) => {
        const fileName = path.resolve(folderPath, file);
        if (fs.lstatSync(fileName).isDirectory()) {
          const promise = this.formatAllALFiles(
            fileName,
            formatSetting,
            errors
          );
          promises.push(promise);
        } else if (file.toLowerCase().endsWith(".al")) {
          const promise = this.formatALFile(fileName, formatSetting, errors);
          promises.push(promise);
        }
      });

      Promise.all(promises).then(() => {
        resolve();
      });
    });
  }

  private static formatALFile(
    filePath: string,
    formatSetting: IFormatSetting,
    errors: IFormatError[]
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        filePath = path.resolve(filePath);
        const data = fs.readFileSync(filePath);
        const content = data.toString();
        const newContent = ObjectFormatter.format(content, formatSetting);
        fs.writeFileSync(filePath, newContent);
      } catch (err) {
        errors.push(err);
      }

      resolve();
    });
  }
}
