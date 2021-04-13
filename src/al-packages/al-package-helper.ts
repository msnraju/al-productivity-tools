import IALPackage from "./models/al-package.model";
import { SymbolReferences } from "./models/symbol-reference.model";

export default class ALPackageHelper {
    static findPage(packages: IALPackage[], name: string): SymbolReferences.Page | undefined {
        const pages: SymbolReferences.Page[] = [];
        packages.map(p => p.symbols).forEach(p => pages.push(...p.Pages));

        if (/^\d*\.?\d*$/.test(name)) {
            return pages.find(p => p.Id === Number(name));
        }

        if (/"(.*)"/.test(name)) {
            const match = name.match(/"(.*)"/);
            name = match ? match[1] : name;
        }

        return pages.find(p => p.Name === name);
    }

    static findPageExtension(packages: IALPackage[], name: string): SymbolReferences.PageExtension | undefined {
        const pages: SymbolReferences.PageExtension[] = [];
        packages.map(p => p.symbols).forEach(p => pages.push(...p.PageExtensions));

        if (/^\d*\.?\d*$/.test(name)) {
            return pages.find(p => p.Id === Number(name));
        }

        if (/"(.*)"/.test(name)) {
            const match = name.match(/"(.*)"/);
            name = match ? match[1] : name;
        }

        return pages.find(p => p.Name === name);
    }

    static findTable(packages: IALPackage[], name: string): SymbolReferences.Table | undefined {
        const tables: SymbolReferences.Table[] = [];
        packages.map(p => p.symbols).forEach(p => tables.push(...p.Tables));

        if (/^\d*\.?\d*$/.test(name)) {
            return tables.find(p => p.Id === Number(name));
        }

        if (/"(.*)"/.test(name)) {
            const match = name.match(/"(.*)"/);
            name = match ? match[1] : name;
        }

        return tables.find(p => p.Name === name);
    }

    static findTableExtensionFields(packages: IALPackage[], name: string): SymbolReferences.Field[] | undefined {
        const tables: SymbolReferences.TableExtension[] = [];
        packages.map(p => p.symbols).forEach(p => tables.push(...p.TableExtensions));

        if (/"(.*)"/.test(name)) {
            const match = name.match(/"(.*)"/);
            name = match ? match[1] : name;
        }

        const fields: SymbolReferences.Field[] = [];
        tables.filter(p => p.TargetObject === name).forEach(p => fields.push(...p.Fields));
        return fields;
    }
}