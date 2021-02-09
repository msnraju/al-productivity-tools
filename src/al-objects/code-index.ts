import _ = require("lodash");
import IToken from "../tokenizers/models/token.model";
import ICodeIndex from "./models/code-index.model";

export default class CodeIndex implements ICodeIndex {
  tokens: string[];

  constructor() {
    this.tokens = [];
  }

  private addToTokens(token: string) {
    let value = token.toLowerCase();

    const match = /"(.*)"/.exec(value);
    if (match) {
      value = match[1].toLowerCase();
    } else {
      value = value.toLowerCase();
    }

    if (this.tokens.indexOf(value) === -1) {
      this.tokens.push(value);
    }
  }

  pushCodeTokens(tokens: IToken[]) {
    tokens
      .filter((token) => token.type === "string" || token.type === "name")
      .forEach((token) => {
        this.addToTokens(token.value);
      });
  }

  findToken(value: string): boolean {
    value = value.toLowerCase();
    const match = /"(.*)"/.exec(value);
    if (match) {
      value = match[1];
    }

    return this.tokens.indexOf(value) !== -1;
  }
}
