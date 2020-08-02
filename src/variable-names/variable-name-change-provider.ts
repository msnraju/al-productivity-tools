import * as vscode from "vscode";
import { WordShortForms, NameShortForms } from "./name-short-forms";
import _ = require("lodash");

export class VariableNameChangeProvider implements vscode.CodeActionProvider {
  public static readonly providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix,
  ];

  public provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range
  ): vscode.CodeAction[] | undefined {
    const variable = this.getVariable(document, range);
    if (!variable) {
      return;
    }

    const names = this.getVariableNames(variable);
    if (!names || names.length === 0) return;

    const fixes = [];
    // const fix = new vscode.CodeAction(name, vscode.CodeActionKind.);
    for (let i = 0; i < names.length; i++) {
      if (names[i] === variable.name) continue;

      const fix = this.createFix(document, range, names[i], variable);
      if (i === 1 || names.length === 1) fix.isPreferred = true;
      fixes.push(fix);
    }

    return fixes;
  }

  private getVariableNames(variable: any) {
    let prefix = "";
    switch (variable.dataType.toLowerCase()) {
      case "record":
        if (variable.temporary) prefix = "Temp";
      case "codeunit":
      case "report":
      case "query":
      case "xmlport":
      case "enum":
        const words = this.nameToWords(variable.objectName);
        const names = [`${prefix}${this.getFullName(words)}`];

        if (NameShortForms[variable.objectName]) {
          const fullShortForm = `${prefix}${
            NameShortForms[variable.objectName]
          }`;
          if (names.indexOf(fullShortForm) === -1) names.push(fullShortForm);
        }

        const short = `${prefix}${this.getShortName(words)}`;
        if (names.indexOf(short) === -1) names.push(short);

        const shortest = `${prefix}${this.getShortestName(words)}`;
        if (names.indexOf(shortest) === -1) names.push(shortest);

        return names;
      default:
        return null;
    }
  }

  private nameToWords(name: string) {
    let name2 = (name || "").replace(/[^a-zA-Z0-9 ]*/g, "");
    return name2.split(/\s+/g);
  }

  private getFullName(words: Array<string>) {
    return words.map((word) => this.titleCase(word)).join("");
  }

  private titleCase(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  private getShortName(words: Array<string>): string {
    if (words.length > 1) {
      const last = words[words.length - 1];
      words = words.slice(0, words.length - 1);
      return [this.getShortestName(words), this.titleCase(last)].join("");
    } else return words.map((word) => this.getShortWord(word)).join("");
  }

  private getShortestName(words: Array<string>) {
    return words.map((word) => this.getShortWord(word)).join("");
  }

  private getShortWord(word: string) {
    const shortWord = WordShortForms[word.toLowerCase()];
    if (shortWord) {
      return this.titleCase(shortWord);
    }

    return this.titleCase(word);
  }

  private getVariable(document: vscode.TextDocument, range: vscode.Range) {
    const start = range.start;
    const line = document.lineAt(start.line);
    const text = line.text.trim();
    const expression = /((\w*)\s*:)\s*(\w*)\s+(".*"|\w*)\s*(temporary)?\s*;?.*/i;

    if (!expression.test(text)) return;
    const match = expression.exec(text);
    if (!match) return;

    let objectName = match[4] || "";
    if (objectName.startsWith('"'))
      objectName = objectName.substr(1, objectName.length - 2);

    return {
      matchText: match[1],
      name: match[2],
      objectName: objectName,
      dataType: match[3],
      temporary: (match[5] || "").toLowerCase() === "temporary",
    };
  }

  private createFix(
    document: vscode.TextDocument,
    range: vscode.Range,
    name: string,
    variable: any
  ): vscode.CodeAction {
    const title = `Change variable name to: ${name}`;
    const fix = new vscode.CodeAction(title, vscode.CodeActionKind.QuickFix);
    fix.edit = new vscode.WorkspaceEdit();

    const line = document.lineAt(range.start.line);
    const pos = line.text.indexOf(variable.matchText);
    const start = new vscode.Position(range.start.line, pos);
    
    fix.edit.replace(
      document.uri,
      new vscode.Range(start, start.translate(0, variable.name.length)),
      `${name}`
    );
    return fix;
  }
}
