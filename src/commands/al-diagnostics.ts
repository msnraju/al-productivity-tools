import * as Excel from "exceljs";
import * as vscode from "vscode";
import _ = require("lodash");
import { languages } from "vscode";
import IDiagnosticProblem from "./models/diagnostic-problem.model";
import IDiagnosticsSummary from "./models/diagnostics-summary.model";
import CodeAnalyzerRules from "../code-analyzers/code-analyzer-rules";

export default class ALDiagnostics {
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

  private static exportToExcel(
    dataSet: IDiagnosticProblem[],
    basePath: string
  ) {
    let workbook = new Excel.Workbook();
    ALDiagnostics.exportDiagnosticsData(workbook, dataSet);
    ALDiagnostics.exportDiagnosticsSummary(workbook, dataSet);

    const fileName = `${basePath}\\.vscode\\Diagnostics.xlsx`;
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
