import fs = require("fs");
import path = require("path");
import ObjectFormatter from "./object-formatter";

export default class ALFormatter {
  static readALFiles(folderPath: string) {
    folderPath = path.resolve(folderPath);

    const files = fs.readdirSync(folderPath);
    files.forEach((file) => {
      const fileName = `${folderPath}\\${file}`;
      if (fs.lstatSync(fileName).isDirectory()) {
        this.readALFiles(fileName);
      } else if (file.toLowerCase().endsWith(".al")) {
        this.readALFile(fileName);
      }
    });
  }

  static readALFile(filePath: string) {
    filePath = path.resolve(filePath);
    const data = fs.readFileSync(filePath);
    const content = data.toString();
    const newContent = ObjectFormatter.format(content);
    fs.writeFileSync(filePath, newContent);
  }

  static start() {
    this.readALFiles("./assets/AppObject");
    console.log("All Done!");
  }
}
