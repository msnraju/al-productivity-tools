import path = require("path");
import * as jszip from "jszip";
import fs = require("fs");
import parser = require("fast-xml-parser");
import IALPackage from "./models/al-package.model";
import ITranslation from "./models/al-translation.model";

export default class ALPackage {
  static getTranslations(wsFolders: string[]): ITranslation[] {
    const translations: ITranslation[] = [];
    wsFolders.forEach((folder) => {
      ALPackage.readTranslations(folder, translations);
    });

    return translations;
  }

  private static readTranslations(
    folder: string,
    translations: ITranslation[]
  ) {
    const options = {
      attributeNamePrefix: "@_",
      attrNodeName: "attr", //default is 'false'
      textNodeName: "#text",
      ignoreAttributes: true,
      ignoreNameSpace: false,
      allowBooleanAttributes: false,
      parseNodeValue: true,
      parseAttributeValue: false,
      trimValues: true,
      cdataTagName: "__cdata", //default is 'false'
      cdataPositionChar: "\\c",
      parseTrueNumberOnly: false,
      arrayMode: false, //"strict"
      stopNodes: ["parse-me-as-string"],
    };

    const transFolder = path.resolve(`${folder}/.dutch-trans`);
    if (fs.existsSync(transFolder)) {
      const files = fs.readdirSync(transFolder);
      files.forEach((file) => {
        const ext = path.extname(file).toLowerCase();
        if (ext.toLowerCase() !== ".xml") {
          return;
        }

        try {
          var jsonObj = ALPackage.getJsonTranslations(
            transFolder,
            file,
            options
          );
          const units = jsonObj.xliff.file.body.group["trans-unit"];
          translations.push(...units);
        } catch (err) {
          throw err;
        }
      });
    }
  }

  private static getJsonTranslations(
    transFolder: string,
    file: string,
    options: {
      attributeNamePrefix: string;
      attrNodeName: string; //default is 'false'
      textNodeName: string;
      ignoreAttributes: boolean;
      ignoreNameSpace: boolean;
      allowBooleanAttributes: boolean;
      parseNodeValue: boolean;
      parseAttributeValue: boolean;
      trimValues: boolean;
      cdataTagName: string; //default is 'false'
      cdataPositionChar: string;
      parseTrueNumberOnly: boolean;
      arrayMode: boolean; //"strict"
      stopNodes: string[];
    }
  ) {
    const fileFullPath = path.resolve(`${transFolder}/${file}`);
    const xmlData = fs.readFileSync(fileFullPath, { encoding: "utf8" });
    const tempObj = parser.getTraversalObj(xmlData, options);
    var jsonObj = parser.convertToJson(tempObj, options);
    return jsonObj;
  }

  static getALPackagesFromSymbols(wsFolders: string[]): IALPackage[] {
    const packages: IALPackage[] = [];
    wsFolders.forEach((folder) => {
      ALPackage.readSymbols(folder, packages);
    });

    return packages;
  }

  private static readSymbols(folder: string, packages: IALPackage[]) {
    const symbolsFolder = path.resolve(`${folder}/.symbols`);
    const files = fs.readdirSync(symbolsFolder);
    files.forEach((file) => {
      const ext = path.extname(file).toLowerCase();
      if (ext.toLowerCase() !== ".json") {
        return;
      }

      try {
        const fileFullPath = path.resolve(`${symbolsFolder}/${file}`);
        const content = fs.readFileSync(fileFullPath, { encoding: "utf8" });
        const symbols = JSON.parse(content);
        packages.push({ file: file, symbols: symbols });
      } catch (err) {
        throw err;
      }
    });
  }

  static getALPackages(wsFolders: string[]): Promise<IALPackage[]> {
    const promises: Promise<IALPackage>[] = [];
    wsFolders.forEach((folder) => {
      const packageFolder = path.resolve(`${folder}/.alpackages`);
      const files = fs.readdirSync(packageFolder);
      files.forEach((file) => {
        const ext = path.extname(file).toLowerCase();
        if (ext.toLowerCase() !== ".app") {
          return;
        }

        const fileFullPath = path.resolve(`${packageFolder}/${file}`);
        promises.push(
          ALPackage.readAppFile(fileFullPath).then((alPackage) => {
            // console.log(alPackage.symbols.Name);
            return alPackage;
          })
        );
      });
    });

    return Promise.all(promises);
  }

  private static readAppFile(fileFullPath: string): Promise<IALPackage> {
    return new Promise<IALPackage>((resolve, reject) => {
      fs.readFile(fileFullPath, function (err, data) {
        if (err) {
          reject(err);
          return;
        }

        jszip
          .loadAsync(data, {
            createFolders: true,
          })
          .then((zip) => {
            ALPackage.getZipFileContent(zip, "SymbolReference.json").then(
              (content) => {
                try {
                  if (content[0] !== "{") {
                    content = content.slice(1);
                  }

                  const symbols = JSON.parse(content);
                  resolve({ symbols: symbols, file: "SymbolReference.json" });
                } catch (err) {
                  console.log(err);
                }
              },
              reject
            );

            // let files = Object.keys(zip.files);
            // files.forEach(entry => { });
          });
      });
    });
  }

  private static getZipFileContent(zip: jszip, entry: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      let file = zip.files[entry];
      if (file.dir) {
        throw new Error(`${entry} is a folder.`);
      }

      var string = "";
      const stream = file.nodeStream();

      stream.on("data", function (data) {
        string += data.toString();
        console.log("stream data " + data);
      });

      stream.on("error", function (err) {
        console.log(err);
      });

      stream.on("end", function () {
        console.log("final output " + string);
        resolve(string);
      });
    });
  }
}
