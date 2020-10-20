export interface IToken {
  type: string;
  value: string;
  line: number;
}

let lineNo = 0;

export class Tokenizer {
  static tokenizer(input: string) {
    let current = 0;
    const tokens: IToken[] = [];

    while (current < input.length) {
      let char = input[current];
      let char2 = current + 1 < input.length ? input[current + 1] : '';

      // WHITESPACE
      let WHITESPACE = /\s/;
      if (WHITESPACE.test(char)) {
        let value = '';

        while(WHITESPACE.test(char)) {
          value += char;
          char = input[++current];
        }

        this.pushToken(tokens, 'whitespace', value);
        continue;
      }

      // COMMENTS
      if (char === '/' && char2 === '/') {
        let value = '';
        while (current < input.length && char !== '\n' && char !== '\r') {
          value += char;
          char = input[++current];
        }

        this.pushToken(tokens, 'comment', value);
        continue;
      }

      if (char === '<' && char2 === '=') {
        this.pushToken(tokens, 'lte', '<=');
        current += 2;
        continue;
      }

      if (char === '<' && char2 === '>') {
        this.pushToken(tokens, 'ne', '<>');
        current += 2;
        continue;
      }

      if (char === '>' && char2 === '=') {
        this.pushToken(tokens, 'gte', '>=');
        current += 2;
        continue;
      }

      if (char === ':' && char2 === ':') {
        this.pushToken(tokens, 'enum', '::');
        current += 2;
        continue;
      }

      if (char === ':' && char2 === '=') {
        this.pushToken(tokens, 'assign', ':=');
        current += 2;
        continue;
      }

      if (this.isToken(tokens, char, 'braces', '{')) {
        current++;
        continue;
      }

      if (this.isToken(tokens, char, 'braces', '}')) {
        current++;
        continue;
      }

      if (this.isToken(tokens, char, 'paren', '(')) {
        current++;
        continue;
      }

      if (this.isToken(tokens, char, 'paren', ')')) {
        current++;
        continue;
      }

      if (this.isToken(tokens, char, 'bracket', '[')) {
        current++;
        continue;
      }

      if (this.isToken(tokens, char, 'bracket', ']')) {
        current++;
        continue;
      }

      if (this.isToken(tokens, char, 'colon', ':')) {
        current++;
        continue;
      }

      if (this.isToken(tokens, char, 'pipe', '|')) {
        current++;
        continue;
      }

      if (this.isToken(tokens, char, 'ampersand', '&')) {
        current++;
        continue;
      }

      if (this.isToken(tokens, char, 'period', '.')) {
        current++;
        continue;
      }

      if (this.isToken(tokens, char, 'plus', '+')) {
        current++;
        continue;
      }

      if (this.isToken(tokens, char, 'minus', '-')) {
        current++;
        continue;
      }

      if (this.isToken(tokens, char, 'multiply', '*')) {
        current++;
        continue;
      }

      if (this.isToken(tokens, char, 'slash', '/')) {
        current++;
        continue;
      }

      if (this.isToken(tokens, char, 'percent', '%')) {
        current++;
        continue;
      }

      if (this.isToken(tokens, char, 'equal', '=')) {
        current++;
        continue;
      }

      if (this.isToken(tokens, char, 'semicolon', ';')) {
        current++;
        continue;
      }

      if (this.isToken(tokens, char, 'coma', ',')) {
        current++;
        continue;
      }

      if (this.isToken(tokens, char, 'lt', '<')) {
        current++;
        continue;
      }

      if (this.isToken(tokens, char, 'gt', '>')) {
        current++;
        continue;
      }

      if (this.isToken(tokens, char, 'newline', '\n')) {
        lineNo++;
        continue;
      }

      let NUMBERS = /[0-9]/;
      if (NUMBERS.test(char)) {
        let value = '';

        while (NUMBERS.test(char)) {
          value += char;
          char = input[++current];
        }

        this.pushToken(tokens, 'number', value);
        continue;
      }

      if (char === "'") {
        let value = char;

        char = input[++current];

        while (char !== "'") {
          value += char;
          char = input[++current];
          char2 = current + 1 < input.length ? input[current + 1] : '';

          while (char === "'" && char2 === "'") {
            value += char + char2;
            current += 1;
            char = input[++current];
            char2 = current + 1 < input.length ? input[current + 1] : '';
          }
        }

        value += char;
        char = input[++current];
        this.pushToken(tokens, 'constant', value);
        continue;
      }

      if (char === '"') {
        let value = char;

        char = input[++current];

        while (char !== '"') {
          value += char;
          char = input[++current];
          char2 = current + 1 < input.length ? input[current + 1] : '';

          while (char === '"' && char2 === '"') {
            value += char + char2;
            current += 1;
            char = input[++current];
            char2 = current + 1 < input.length ? input[current + 1] : '';
          }
        }

        value += char;
        char = input[++current];
        this.pushToken(tokens, 'string', value);
        continue;
      }

      let LETTERS = /[a-z_]/i;
      if (LETTERS.test(char)) {
        let value = '';
        LETTERS = /[a-z_0-9]/i;
        while (LETTERS.test(char)) {
          value += char;
          char = input[++current];
        }

        this.pushToken(tokens, 'name', value);
        continue;
      }

      throw new TypeError("I don't know what this character is: " + char);
    }

    return tokens;
  }

  private static pushToken(tokens: IToken[], type: string, value: string) {
    const token = {
      type: type,
      value: value,
      line: lineNo + 1,
    };

    tokens.push(token);
    this.logToken(token);
  }

  private static logToken(token: IToken) {
    // console.log(token);
  }

  private static isToken(tokens: IToken[], char: string, type: string, value: string): boolean {
    if (char === value) {
      const token = {
        type: type,
        value: value,
        line: lineNo + 1,
      };

      tokens.push(token);
      this.logToken(token);
      return true;
    }

    return false;
  }
}
