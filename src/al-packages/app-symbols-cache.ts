import { AppSymbols } from "../symbol-references";
import { ZipUtil } from "./zip-util";

export class AppSymbolsCache {
  private static loaded: boolean;
  private static inprogress: boolean;
  private static inprogressPromise: Promise<AppSymbols[]>;
  private static symbols: AppSymbols[];

  static getSymbols(): Promise<AppSymbols[]> {
    if (this.inprogress === true) {
      return this.inprogressPromise;
    }

    this.inprogressPromise = new Promise<AppSymbols[]>((resolve, reject) => {
      if (this.loaded && this.symbols) {
        resolve(this.symbols);
        return;
      }

      this.inprogress = true;
      this.loaded = false;
      ZipUtil.getSymbolsWithProgress()
        .then((symbols) => {
          this.inprogress = false;
          this.loaded = true;
          this.symbols = symbols;
          resolve(symbols);
          this.inprogress = false;
        })
        .catch((reason) => {
          this.inprogress = false;
          this.symbols = [];
          reject(reason);
        });
    });

    return this.inprogressPromise;
  }
}
