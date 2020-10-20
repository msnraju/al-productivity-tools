import { isArray } from "lodash";
import { Helper } from "../helper";

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
      this.write(callbackfn(item));
    }

    return this;
  }

  write(lines: string[] | string, indentation: number = 0): StringBuilder {
    const pad = Helper.pad(indentation);
    if (isArray(lines)) {
      const newLines: string[] = lines;
      newLines.forEach((newLine) => this.buffer.push(`${pad}${newLine}`));
    } else {
      this.buffer.push(`${pad}${lines}`);
    }

    return this;
  }

  emptyLine(): StringBuilder {
    if (this.buffer[this.buffer.length - 1] !== "") {
      this.buffer.push("");
    }
    
    return this;
  }

  popEmpty(): StringBuilder {
    if (this.buffer[this.buffer.length - 1] === "") {
      this.buffer.pop();
    }

    return this;
  }

  toString() {
    return this.buffer.join("\r\n");
  }
}
