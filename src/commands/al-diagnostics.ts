import * as Excel from "exceljs";
import * as vscode from "vscode";
import fs = require("fs");
import _ = require("lodash");
import { languages } from "vscode";
import IDiagnosticProblem from "./models/diagnostic-problem.model";
import IDiagnosticsSummary from "./models/diagnostics-summary.model";
import CodeAnalyzerRules from "../code-analyzers/code-analyzer-rules";
import IDiagnosticTooltipProblem from "./models/diagnostic-tooltip-problem.model";
import ObjectReader from "../al-objects/al-readers/object-reader";
import CodeIndex from "../al-objects/code-index";
import ICodeIndex from "../al-objects/models/code-index.model";
import IObjectContext from "../al-objects/components/models/object-context.model";
import IControl from "../al-objects/components/models/control.model";
import IAction from "../al-objects/components/models/action.model";
import ALPackage from "../al-packages/al-package";
import IALPackage from "../al-packages/models/al-package.model";
import StringHelper from "../helpers/string-helper";
import ALPackageHelper from "../al-packages/al-package-helper";
import { SymbolReferences } from "../al-packages/models/symbol-reference.model";
import ObjectWriter from "../al-objects/formatters/object-writer";
import IFormatSetting from "../helpers/models/format-settings.model";

export default class ALDiagnostics {
  private static readonly TooltipRuleCode: string = 'AA0218';
  private static readonly tooltipHeaders = [
    { header: "File", key: "file" },
    { header: "Type", key: "type" },
    { header: "Name", key: "name" },
    { header: "Caption", key: "caption" },
    { header: "Dutch Caption", key: "dutchCaption" },
  ];

  static exportMissingTooltips() {
    try {

      const dataSet: IDiagnosticTooltipProblem[] = [];
      const wsFolders = ALDiagnostics.getWorkSpaceFolders();
      const translations = ALPackage.getTranslations(wsFolders);
      const packages = ALPackage.getALPackagesFromSymbols(wsFolders);

      const problems = languages.getDiagnostics();
      for (const [fileUri, diagnostics] of problems) {
        let filePath = fileUri.fsPath;
        for (const folder of wsFolders) {
          filePath = filePath.replace(folder, "");
        }

        if (filePath.startsWith("\\") || filePath.startsWith("/")) {
          filePath = filePath.substring(1);
        }

        const tooltipDiagnostics = diagnostics.filter(i => i.code === ALDiagnostics.TooltipRuleCode);
        if (tooltipDiagnostics.length === 0) {
          continue;
        }

        const data = fs.readFileSync(fileUri.fsPath);
        const content = data.toString();
        const codeIndex: ICodeIndex = new CodeIndex();
        let objectContent: IObjectContext = ObjectReader.read(content, codeIndex);

        const msgExpr = /The Tooltip property for (PageField|PageAction) (.*) must be filled./;
        for (const diagnostic of tooltipDiagnostics) {
          const match = msgExpr.exec(diagnostic.message) || ['', ''];
          const type = match[1];
          const name = match[2];
          let caption: string = "";
          let dutchCaption: string = "";

          switch (type) {
            case 'PageField':
              caption = ALDiagnostics.getFieldCaption(packages, objectContent, name);
              break;
            case 'PageAction':
              caption = ALDiagnostics.getActionCaption(objectContent, name);
              break;
          }

          if (caption) {
            const transilation = translations.find(p => p.source && (p.source + '').toLowerCase() === caption.toLowerCase());
            if (transilation) {
              dutchCaption = transilation.target;
            }
          }

          dataSet.push({
            file: filePath,
            code: diagnostic.code + "",
            type: type,
            name: name,
            caption: caption,
            dutchCaption: dutchCaption,
            startLineNo: diagnostic.range.start.line,
            endLineNo: diagnostic.range.end.line,
            startPosition: diagnostic.range.start.character,
            endPosition: diagnostic.range.end.character,
            severity: ALDiagnostics.severityToString(diagnostic.severity),
          });
        }
      }

      ALDiagnostics.exportTooltipsToExcel(dataSet, wsFolders[0]);
    } catch (err) {
      vscode.window.showErrorMessage(`Export missing tooltips failed.\n\n${err}`);
    }
  }

  static importMissingTooltips() {
    try {
      if (!vscode.workspace.workspaceFolders) {
        return;
      }

      const workspaceFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
      const filename = workspaceFolder + "\\.vscode\\Tooltips.xlsx";

      ALDiagnostics.getTooltipsData(filename)
        .then(data => {
          try {
            const tooltipsData = _.groupBy(data, p => p.file);
            for (const file in tooltipsData) {
              const fullPath = workspaceFolder + "\\" + file;
              const newContent = ALDiagnostics.updateTooltips(fullPath, tooltipsData[file]);
              fs.writeFileSync(fullPath, newContent);
            }

            vscode.window.showInformationMessage("Missing tooltips imported successfully.");
          } catch (err) {
            vscode.window.showErrorMessage(`Import missing tooltips failed.\n\n${err}`);
          }
        });
    } catch (err) {
      vscode.window.showErrorMessage(`Import missing tooltips failed.\n\n${err}`);
    }
  }

  private static updateTooltips(file: string, data: IDiagnosticTooltipProblem[]) {
    const buffer = fs.readFileSync(file);
    const content = buffer.toString();
    const codeIndex: ICodeIndex = new CodeIndex();
    const objectContent: IObjectContext = ObjectReader.read(content, codeIndex);

    data.forEach(diagnostic => {
      switch (diagnostic.type) {
        case 'PageField':
          if (objectContent.layout) {
            const control = ALDiagnostics.findInControls(objectContent.layout.controls, diagnostic.name);
            if (control) {
              control.properties.push({
                name: "Tooltip",
                property: `Tooltip = '${diagnostic.caption}';`
              });
            }
          }
          break;
        case 'PageAction':
          if (objectContent.actionsContainer) {
            const action = ALDiagnostics.findInActions(objectContent.actionsContainer.actions, diagnostic.name);
            if (action) {
              action.properties.push({
                name: "Tooltip",
                property: `Tooltip = '${diagnostic.caption}';`
              });
            }
          }
          break;
      }
    });

    const settings: IFormatSetting = {
      renameFileNameOnSave: false,
      wrapProcedure: false,
      sortVariables: false,
      sortProcedures: false,
      convertKeywordsToAL: false,
      appendParenthesisAfterProcedures: false,
      removeUnusedLocalProcedures: false,
      removeUnusedLocalVariables: false,
      removeUnusedGlobalVariables: false,
      removeUnusedParameters: false,
      autoCorrectVariableNames: false,
      setDefaultDataClassification: false,
      extensionFunctions: {},
    };

    return ObjectWriter.write(objectContent, settings, codeIndex);
  }

  private static getTooltipsData(filename: string): Promise<IDiagnosticTooltipProblem[]> {
    return new Promise<IDiagnosticTooltipProblem[]>((resolve, reject) => {
      const data: IDiagnosticTooltipProblem[] = [];
      let header: boolean = true;
      const workbook = new Excel.Workbook();
      workbook.xlsx.readFile(filename)
        .then(function () {
          var worksheet = workbook.getWorksheet("Tooltips");
          worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
            if (header) {
              header = false;
              return;
            }

            data.push({
              file: row.getCell(1).value?.toString() || "",
              type: row.getCell(2).value?.toString() || "",
              name: row.getCell(3).value?.toString() || "",
              caption: row.getCell(4).value?.toString() || "",
              dutchCaption: row.getCell(5).value?.toString() || "",
              startLineNo: 0,
              endLineNo: 0,
              startPosition: 0,
              endPosition: 0,
              code: "",
              severity: ""
            });

          });

          resolve(data);
        });
    });
  }

  private static getWorkSpaceFolders() {
    const wsFolders = [];

    if (vscode.workspace.workspaceFolders) {
      for (const folder of vscode.workspace.workspaceFolders) {
        wsFolders.push(folder.uri.fsPath);
      }
    }
    return wsFolders;
  }

  private static getActionCaption(objectContent: IObjectContext, name: string): string {
    if (!objectContent.actionsContainer || !objectContent.actionsContainer.actions) {
      return "";
    }

    const action = ALDiagnostics.findInActions(objectContent.actionsContainer.actions, name);
    if (action) {
      const caption = action.properties.find(c => c.name.toLowerCase() === 'caption');
      if (caption) {
        const captionExpr = /Caption\s?=\s?'(.*)'\s*;/i;
        const match = captionExpr.exec(caption.property);
        if (match) {
          return match[1];
        }
      }
    }

    return "";
  }

  private static findInActions(actions: IAction[], name: string): IAction | undefined {
    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      if (action.type.toLowerCase() === 'action' && action.name === name) {
        return action;
      }

      if (action.actions && action.actions.length > 0) {
        const actionFound = ALDiagnostics.findInActions(action.actions, name);
        if (actionFound) {
          return actionFound;
        }
      }
    }
  }

  private static getFieldCaption(packages: IALPackage[], objectContent: IObjectContext, name: string): string {
    if (!objectContent.layout || !objectContent.layout.controls) {
      return "";
    }

    const control = ALDiagnostics.findInControls(objectContent.layout.controls, name);
    if (!control) {
      throw new Error('Control not found');
    }

    const caption = control.properties.find(c => c.name.toLowerCase() === 'caption');
    if (caption) {
      const captionExpr = /Caption\s?=\s?'(.*)'\s*;/i;
      const match = captionExpr.exec(caption.property);
      if (!match) {
        throw new Error('Caption Expression Error');
      }

      return match[1];
    } else {
      // get caption from base object
      let page: SymbolReferences.Page | undefined;
      let sourceTable = "";
      switch (objectContent.declaration.type.toLowerCase()) {
        case "pageextension":
          page = ALPackageHelper.findPage(packages, objectContent.declaration.baseObject);
          break;
        case "page":
          page = ALPackageHelper.findPage(packages, objectContent.declaration.id);
          break;
      }

      if (!page) {
        throw new Error('Page not found');
      }

      sourceTable = page.Properties.find(p => p.Name === 'SourceTable')?.Value || '';

      if (!sourceTable) {
        throw new Error('SourceTable not found');
      }

      const fieldName = StringHelper.removeQuotes(control.sourceExpr);
      const table = ALPackageHelper.findTable(packages, sourceTable);
      if (!table) {
        throw new Error('Table not found');
      }

      let field = table.Fields.find(p => p.Name === fieldName);
      if (!field) {
        const fields = ALPackageHelper.findTableExtensionFields(packages, table.Name);
        field = fields?.find(p => p.Name === fieldName);
        if (!field) {
          // this should be variable or function or expression
          return '';
        }
      }

      const caption = field.Properties?.find(p => p.Name === "Caption");
      if (!caption) {
        return '';
      }

      return caption.Value;
    }
  }

  private static findInControls(controls: IControl[], name: string): IControl | undefined {
    for (let i = 0; i < controls.length; i++) {
      const control = controls[i];
      if (control.type.toLowerCase() === 'field' && control.name === name) {
        return control;
      }

      if (control.controls && control.controls.length > 0) {
        const controlFound = ALDiagnostics.findInControls(control.controls, name);
        if (controlFound) {
          return controlFound;
        }
      }
    }
  }

  static exportDiagnostics() {
    const dataSet: IDiagnosticProblem[] = [];
    const wsFolders = [];

    if (vscode.workspace.workspaceFolders) {
      for (const folder of vscode.workspace.workspaceFolders) {
        wsFolders.push(folder.uri.fsPath);
      }
    }

    const problems = languages.getDiagnostics();
    for (const [fileUri, diagnostics] of problems) {
      let filePath = fileUri.fsPath;
      for (const folder of wsFolders) {
        filePath = filePath.replace(folder, "");
      }

      if (filePath.startsWith("\\") || filePath.startsWith("/")) {
        filePath = filePath.substring(1);
      }

      for (const diagnostic of diagnostics) {
        dataSet.push({
          file: filePath,
          code: diagnostic.code + "",
          message: diagnostic.message,
          startLineNo: diagnostic.range.start.line,
          endLineNo: diagnostic.range.end.line,
          startPosition: diagnostic.range.start.character,
          endPosition: diagnostic.range.end.character,
          severity: ALDiagnostics.severityToString(diagnostic.severity),
        });
      }
    }

    ALDiagnostics.exportToExcel(dataSet, wsFolders[0]);
  }

  private static severityToString(severity: vscode.DiagnosticSeverity): string {
    switch (severity) {
      case vscode.DiagnosticSeverity.Error:
        return "Error";
      case vscode.DiagnosticSeverity.Warning:
        return "Warning";
      case vscode.DiagnosticSeverity.Information:
        return "Information";
      case vscode.DiagnosticSeverity.Hint:
        return "Hint";
      default:
        return severity + "";
    }
  }

  private static exportTooltipsToExcel(
    dataSet: IDiagnosticTooltipProblem[],
    basePath: string
  ) {
    let workbook = new Excel.Workbook();
    ALDiagnostics.exportTooltipsData(workbook, dataSet);

    const fileName = `${basePath}\\MissingTooltips.xlsx`;
    workbook.xlsx
      .writeFile(fileName)
      .then(() => {
        vscode.window.showInformationMessage(
          `Missing Tooltips exported to ${fileName}`
        );
      })
      .catch((r) => {
        vscode.window.showErrorMessage(
          `An error occurred while exporting missing tooltips.\n\n${r.message}"`
        );
      });
  }

  private static exportTooltipsData(
    workbook: Excel.Workbook,
    dataSet: IDiagnosticTooltipProblem[]
  ) {
    let worksheet = workbook.addWorksheet("Tooltips");

    worksheet.columns = ALDiagnostics.tooltipHeaders as any;

    worksheet.columns[0].width = 50;
    worksheet.columns[1].width = 10;
    worksheet.columns[2].width = 30;
    worksheet.columns[3].width = 50;
    worksheet.columns[3].width = 50;
    worksheet.addRows(dataSet);

    ALDiagnostics.formatHeader(worksheet);
  }


  private static exportToExcel(
    dataSet: IDiagnosticProblem[],
    basePath: string
  ) {
    let workbook = new Excel.Workbook();
    ALDiagnostics.exportDiagnosticsData(workbook, dataSet);
    ALDiagnostics.exportDiagnosticsSummary(workbook, dataSet);

    const fileName = `${basePath}\\Diagnostics.xlsx`;
    workbook.xlsx
      .writeFile(fileName)
      .then(() => {
        vscode.window.showInformationMessage(
          `Diagnostics report saved as ${fileName}`
        );
      })
      .catch((r) => {
        vscode.window.showErrorMessage(
          `An error occurred while generating diagnostics report.\n\n${r.message}"`
        );
      });
  }

  private static exportDiagnosticsSummary(
    workbook: Excel.Workbook,
    dataSet: IDiagnosticProblem[]
  ) {
    const summaryDataSet: IDiagnosticsSummary[] = [];
    const rules = CodeAnalyzerRules;

    const dataGroupedByCode = _.groupBy(dataSet, (d) => d.code);
    for (const code in dataGroupedByCode) {
      let rule = _.find(rules, (d) => d.id === code);
      const firstItem = dataGroupedByCode[code][0];
      if (!rule && firstItem) {
        rule = {
          id: code,
          title: firstItem.message,
          category: "",
          defaultSeverity: firstItem.severity,
        };
      }

      summaryDataSet.push({
        code: code,
        count: dataGroupedByCode[code].length,
        message: rule?.title || "",
        severity: firstItem.severity || rule?.defaultSeverity || "",
      });
    }

    let worksheet = workbook.addWorksheet("Summary Report");
    const headers = [
      { header: "Code", key: "code" },
      { header: "Count", key: "count" },
      { header: "Message", key: "message" },
      { header: "Severity", key: "severity" },
    ];
    worksheet.columns = headers as any;
    worksheet.columns[0].width = 10;
    worksheet.columns[1].width = 10;
    worksheet.columns[2].width = 80;
    worksheet.columns[3].width = 10;

    const sortedDataSet = _.sortBy(summaryDataSet, (d) => -d.count);
    worksheet.addRows(sortedDataSet);

    ALDiagnostics.formatHeader(worksheet);
  }

  private static exportDiagnosticsData(
    workbook: Excel.Workbook,
    dataSet: IDiagnosticProblem[]
  ) {
    let worksheet = workbook.addWorksheet("Diagnostics");
    const headers = [
      { header: "File", key: "file" },
      { header: "Code", key: "code" },
      { header: "Message", key: "message" },
      { header: "Severity", key: "severity" },
      { header: "Start Line No.", key: "startLineNo" },
      { header: "End Line No.", key: "endLineNo" },
      { header: "Start Position", key: "startPosition" },
      { header: "End Position", key: "endPosition" },
    ];

    worksheet.columns = headers as any;

    worksheet.columns[0].width = 50;
    worksheet.columns[1].width = 10;
    worksheet.columns[2].width = 80;
    worksheet.columns[3].width = 10;
    worksheet.columns[4].width = 10;
    worksheet.columns[5].width = 10;
    worksheet.columns[6].width = 10;
    worksheet.columns[7].width = 10;
    worksheet.addRows(dataSet);

    ALDiagnostics.formatHeader(worksheet);
  }

  private static formatHeader(worksheet: Excel.Worksheet) {
    const header = worksheet.getRow(1);
    for (var i = 1; i <= worksheet.columns.length; i++) {
      const cell = header.getCell(i);
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "cccccc" },
      };

      cell.font = { bold: true };
    }
  }
}
