import { SymbolReferences } from "./symbol-reference.model";

export default interface IALPackage {
    file: string;
    symbols: SymbolReferences.RootObject;
}