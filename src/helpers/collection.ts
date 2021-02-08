import { ICollection } from "./models/collection.model";

export class Collection implements ICollection {
  private items: string[] = [];

  constructor(items: string[]) {
    this.items = items;
  }

  hasItem(item: string): boolean {
    return this.items.indexOf(item) !== -1;
  }
}
