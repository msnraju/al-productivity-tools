export default interface IDiagnosticProblem {
  file: string;
  code: string;
  message: string;
  startLineNo: number;
  endLineNo: number;
  startPosition: number;
  endPosition: number;
  severity: string;
}
