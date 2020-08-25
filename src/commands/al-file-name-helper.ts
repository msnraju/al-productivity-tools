import * as fs from "fs";
import * as path from "path";
import ALObjectTypes from "../al-objects/al-object-types";
import IObjectDefinition from "../al-objects/object-definition";

export default class ALFileNameHelper {
  static async getALFileName(file: string) {
    return new Promise<string>(async (resolve, reject) => {
      fs.readFile(file, async (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        const content = data.toString("utf8");
        const lines = content.split(/\r?\n/g);
        lines.forEach(async (line) => {
          line = line.trim();
          if (line.startsWith("//") || !line) return;

          const object = this.getObject(line);
          if (object) {
            const suffix = ALObjectTypes.getALFileSuffix(object.type);
            let newObjectName = object.name.replace(/[^a-zA-Z0-9]*/g, "");

            const newFileName = `${newObjectName}.${suffix}.al`;
            const folder = path.dirname(file);
            const newFilePath = `${folder}\\${newFileName}`;
            resolve(newFilePath);
          }
        });
      });
    });
  }

  static async renameALFiles(
    filePath: string,
    renameCb: (oldName: string, newName: string) => void
  ) {
    return new Promise(async (resolve, reject) => {
      fs.readdir(filePath, (err, files) => {
        if (err) {
          reject(err);
          return;
        }

        files.forEach(async (file) => {
          const fileName = `${filePath}\\${file}`;

          fs.lstat(fileName, async (err, stats) => {
            if (err) {
              reject(err);
              return;
            }

            if (stats.isDirectory()) {
              await this.renameALFiles(fileName, renameCb);
            } else {
              const ext = path.extname(file).toLowerCase();

              if (ext === ".al") {
                const newFile = await this.getALFileName(fileName);
                renameCb(fileName, newFile);
                resolve(newFile);
              }
            }
          });
        });
      });
    });
  }

  static async getObjects(filePath: string): Promise<IObjectDefinition[]> {
    return new Promise(async (resolve, reject) => {
      let objects: IObjectDefinition[] = [];

      fs.readdir(filePath, async (err, files) => {
        if (err) {
          reject(err);
          return;
        }

        files.forEach(async (file) => {
          const fileName = `${filePath}\\${file}`;

          fs.lstat(fileName, async (err, stats) => {
            if (err) {
              reject(err);
              return;
            }

            if (stats.isDirectory()) {
              const innerObjects = await this.getObjects(fileName);
              objects = [...objects, ...innerObjects];
            } else {
              const ext = path.extname(file).toLowerCase();
              if (ext === ".al") {
                const fileObjects = await this.getObjectsInFile(fileName);
                objects = [...objects, ...fileObjects];
              }
            }
          });
        });

        resolve(objects);
      });
    });
  }

  private static async getObjectsInFile(
    file: string
  ): Promise<IObjectDefinition[]> {
    return new Promise((resolve, reject) => {
      fs.readFile(file, (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        const objects: IObjectDefinition[] = [];
        const content = data.toString("utf8");
        const lines = content.split(/\r?\n/g);

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.startsWith("//") || !line) continue;

          const object = this.getObject(line);
          if (object) {
            object.uri = file;
            objects.push(object);
          }
        }

        resolve(objects);
      });
    });
  }

  private static getObject(line: string): IObjectDefinition | undefined {
    const ExtensionExpr = /(tableextension|pageextension|enumextension)\s+(\d*|id)\s+("(.*)"|(.*))\s+extends\s+("(.*)"|(.*))/i;
    const AppObjectExpr = /(table|page|codeunit|report|query|xmlport|enum)\s+(\d*|id)\s+("(.*)"|(.*))/i;
    const ObjectExpr = /(controladdin|interface)\s+("(.*)"|(.*))/i;

    if (ExtensionExpr.test(line)) {
      const match = ExtensionExpr.exec(line);
      if (match)
        return {
          type: match[1],
          id: match[2],
          name: (match[4] || "") + (match[5] || ""),
          extension: true,
          extends: (match[7] || "") + (match[8] || ""),
        };
    } else if (AppObjectExpr.test(line)) {
      const match = AppObjectExpr.exec(line);
      if (match)
        return {
          type: match[1],
          id: match[2],
          name: (match[4] || "") + (match[5] || ""),
        };
    } else if (ObjectExpr.test(line)) {
      const match = ObjectExpr.exec(line);
      if (match)
        return {
          type: match[1],
          name: (match[3] || "") + (match[4] || ""),
        };
    }
  }
}
