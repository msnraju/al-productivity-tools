import { Helper } from "../helper";

export default class PropertiesWriter {
  static write(properties: string[], indentation: number): string[] {
    const lines: string[] = [];
    if (!properties || properties.length === 0) return lines;

    const pad = Helper.pad(indentation);
    properties.forEach((property) => {
      lines.push(`${pad}${property}`);
    });

    lines.push("");
    return lines;
  }
}
