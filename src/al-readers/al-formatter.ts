import fs = require("fs");
import path = require("path");
import { ObjectReader } from "./object-reader";

export class ALFormatter {
  static readALFiles(folderPath: string) {
    folderPath = path.resolve(folderPath);

    const files = fs.readdirSync(folderPath);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = `${folderPath}\\${file}`;
      if (fs.lstatSync(fileName).isDirectory()) {
        this.readALFiles(fileName);
      } else {
        if (file.toLocaleUpperCase().endsWith(".AL")) {
          console.log(`reading ${file}`);
          this.readALFile(fileName);
        }
      }
    }
  }

  static readALFile(filePath: string) {
    filePath = path.resolve(filePath);
    const data = fs.readFileSync(filePath);
    const content = data.toString();
    const newContent = ObjectReader.convert(content);
    fs.writeFileSync(filePath, newContent);
  }

  static start() {
    this.readALFiles("./assets/AppObject");
    // this.readALFile(
    //   './assets/AppObject/Report/AddContacts.Report.al'
    // );
    console.log("All Done!");
  }
}
