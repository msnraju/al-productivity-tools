import { isArray } from "lodash";
import StringHelper from "./string-helper";

export default class StringBuilder {
  private buffer: string[];

  constructor() {
    this.buffer = [];
  }

  writeEach<T>(items: T[], callbackfn: (item: T) => string | string[]) {
    if (items) {
      items.forEach((item) => this.write(callbackfn(item)));
    }

    return this;
  }

  writeIfDefined<T>(
    item: T | undefined,
    callbackfn: (item: T) => string | string[]
  ): StringBuilder {
    if (item) {
      const content = callbackfn(item);
      if (content) {
        this.write(content);
      }
    }

    return this;
  }

  append(lines: string[] | string, indentation: number = 0): StringBuilder {
    if (lines.length !== 1 || this.buffer.length === 0) {
      return this.write(lines, indentation);
    }

    this.buffer[this.buffer.length - 1] += " " + lines[0];
    return this;
  }

  write(lines: string[] | string, indentation: number = 0): StringBuilder {
    const pad = StringHelper.pad(indentation);
    if (isArray(lines)) {
      const newLines: string[] = lines;
      newLines.forEach((newLine) => this.buffer.push(`${pad}${newLine}`));
    } else if (lines) {
      this.buffer.push(`${pad}${lines}`);
    }

    return this;
  }

  emptyLine(): StringBuilder {
    if (this.buffer.length === 0) {
      return this;
    }

    let line = this.buffer[this.buffer.length - 1];
    if (line !== "" && !line.endsWith("\r\n")) {
      this.buffer.push("");
    }

    return this;
  }

  popEmpty(): StringBuilder {
    if (this.buffer.length === 0) {
      return this;
    }

    let line = this.buffer[this.buffer.length - 1];
    while (line === "" || line.endsWith("\r\n")) {
      this.buffer.pop();
      if (line.endsWith("\r\n")) {
        line = line.substring(0, line.length - 2);
        this.buffer.push(line);
      }

      line = this.buffer[this.buffer.length - 1];
    }

    return this;
  }

  toString() {
    return this.buffer.join("\r\n");
  }
}
