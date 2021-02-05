import _ = require("lodash");

export default class StringHelper {
  static toTitleCase(text: string): string {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  static splitWords(text: string): string[] {
    if (!text) return [];
    let plainText = text.replace(/[^a-zA-Z0-9 ]*/g, "");
    return plainText.split(/\s+/g);
  }

  static pad(length: number): string {
    return _.padStart("", length);
  }
}
