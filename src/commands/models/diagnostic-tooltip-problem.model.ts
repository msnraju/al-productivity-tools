export default interface IDiagnosticTooltipProblem {
    file: string;
    code: string;
    type: string;
    name: string;
    caption: string;
    dutchCaption: string;
    startLineNo: number;
    endLineNo: number;
    startPosition: number;
    endPosition: number;
    severity: string;
  }
  