import IALPackage from "./models/al-package.model";
import {
  Page,
  PageExtension,
  Table,
  TableExtension,
  Field,
  AppSymbols,
} from "../symbol-references";

export default class ALPackageHelper {
  static findPage(symbols: AppSymbols[], name: string): Page | undefined {
    const pages: Page[] = [];
    symbols.forEach((p) => pages.push(...p.Pages));

    if (/^\d*\.?\d*$/.test(name)) {
      return pages.find((p) => p.Id === Number(name));
    }

    if (/"(.*)"/.test(name)) {
      const match = name.match(/"(.*)"/);
      name = match ? match[1] : name;
    }

    return pages.find((p) => p.Name.toLowerCase() === name.toLowerCase());
  }

  static findPageExtension(
    packages: IALPackage[],
    name: string
  ): PageExtension | undefined {
    const pages: PageExtension[] = [];
    packages
      .map((p) => p.symbols)
      .forEach((p) => pages.push(...p.PageExtensions));

    if (/^\d*\.?\d*$/.test(name)) {
      return pages.find((p) => p.Id === Number(name));
    }

    if (/"(.*)"/.test(name)) {
      const match = name.match(/"(.*)"/);
      name = match ? match[1] : name;
    }

    return pages.find((p) => p.Name === name);
  }

  static findTable(symbols: AppSymbols[], name: string): Table | undefined {
    const tables: Table[] = [];
    symbols.forEach((p) => tables.push(...p.Tables));

    if (/^\d*\.?\d*$/.test(name)) {
      return tables.find((p) => p.Id === Number(name));
    }

    if (/"(.*)"/.test(name)) {
      const match = name.match(/"(.*)"/);
      name = match ? match[1] : name;
    }

    return tables.find((p) => p.Name === name);
  }

  static findTableExtensionFields(
    symbols: AppSymbols[],
    name: string
  ): Field[] | undefined {
    const tables: TableExtension[] = [];
    symbols.forEach((p) => tables.push(...p.TableExtensions));

    if (/"(.*)"/.test(name)) {
      const match = name.match(/"(.*)"/);
      name = match ? match[1] : name;
    }

    const fields: Field[] = [];
    tables
      .filter((p) => p.TargetObject === name)
      .forEach((p) => fields.push(...p.Fields));
    return fields;
  }
}
