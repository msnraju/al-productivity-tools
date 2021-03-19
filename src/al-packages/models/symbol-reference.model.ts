export module SymbolReferences {
    export interface RootObject {
        Tables: Table[];
        Codeunits: Codeunit[];
        Pages: Page[];
        PageExtensions: PageExtension[];
        PageCustomizations: any[];
        TableExtensions: TableExtension[];
        Reports: Report[];
        XmlPorts: XmlPort[];
        Queries: Query[];
        Profiles: Profile[];
        ProfileExtensions: any[];
        ControlAddIns: any[];
        EnumTypes: EnumType[];
        EnumExtensionTypes: EnumExtensionType[];
        DotNetPackages: DotNetPackage[];
        Interfaces: Interface[];
        InternalsVisibleToModules: InternalsVisibleToModule[];
        AppId: string;
        Name: string;
        Publisher: string;
        Version: string;
    }

    export interface InternalsVisibleToModule {
        AppId: string;
        Name: string;
        Publisher: string;
    }

    export interface Interface {
        Methods: Method[];
        ReferenceSourceFileName: string;
        Name: string;
    }

    export interface DotNetPackage {
        AssemblyDeclarations: AssemblyDeclaration[];
    }

    export interface AssemblyDeclaration {
        TypeDeclarations: any[];
        Name: string;
        Properties?: Property[];
    }

    export interface EnumExtensionType {
        TargetObject: string;
        Values: Value[];
        ReferenceSourceFileName: string;
        Id: number;
        Name: string;
    }

    export interface EnumType {
        Values: Value[];
        ReferenceSourceFileName: string;
        Properties: Property[];
        Id: number;
        Name: string;
        ImplementedInterfaces?: string[];
    }

    export interface Value {
        Ordinal: number;
        Name: string;
        Properties?: Property[];
    }

    export interface Profile {
        ReferenceSourceFileName: string;
        Properties: Property[];
        Name: string;
    }

    export interface Query {
        Elements: QueryElement[];
        ReferenceSourceFileName: string;
        Properties: Property[];
        Id: number;
        Name: string;
    }

    export interface QueryElement {
        RelatedTable: string;
        DataItems: QueryDataItem[];
        Columns: QueryColumn[];
        Filters: QueryColumn[];
        Id: number;
        Name: string;
        Properties?: Property[];
    }

    export interface QueryColumn {
        SourceColumn?: string;
        Properties?: Property[];
        Id: number;
        Name: string;
    }

    export interface QueryDataItem {
        RelatedTable: string;
        DataItems: QueryDataItem[];
        Columns: QueryColumn[];
        Filters: QueryColumn[];
        Properties: Property[];
        Id: number;
        Name: string;
    }

    export interface XmlPort {
        Variables?: Variable[];
        Methods?: Method[];
        ReferenceSourceFileName: string;
        Properties: Property[];
        Id: number;
        Name: string;
    }

    export interface Report {
        Variables?: Variable[];
        Methods?: Method[];
        RequestPage: RequestPage;
        DataItems: DataItem[];
        ReferenceSourceFileName: string;
        Properties: Property[];
        Id: number;
        Name: string;
    }

    export interface DataItem {
        RelatedTable: string;
        Properties?: Property[];
        Id: number;
        Name: string;
    }

    export interface RequestPage {
        Controls?: Control[];
        Properties?: Property[];
        Id: number;
        Name: string;
    }

    export interface TableExtension {
        TargetObject: string;
        Fields: Field[];
        ReferenceSourceFileName: string;
        Id: number;
        Name: string;
        Keys?: Key[];
        Methods?: Method[];
        Properties?: Property[];
    }

    export interface PageExtension {
        TargetObject: string;
        Variables: Variable[];
        ActionChanges?: ActionChange[];
        ReferenceSourceFileName: string;
        Id: number;
        Name: string;
        ControlChanges?: ControlChange[];
    }

    export interface ControlChange {
        Anchor: string;
        ChangeKind: number;
        Controls: Control[];
    }

    export interface ActionChange {
        Anchor: string;
        ChangeKind: number;
        Actions: Action[];
    }

    export interface Page {
        ReferenceSourceFileName: string;
        Properties: Property[];
        Id: number;
        Name: string;
        Variables?: Variable[];
        Controls?: Control[];
        Actions?: Action[];
        Methods?: Method[];
        Views?: QueryColumn[];
    }

    export interface Action {
        Kind: number;
        Properties?: Property[];
        Id: number;
        Name: string;
        Actions?: Action[];
    }

    export interface Control {
        Kind: number;
        TypeDefinition: TypeDefinition;
        Properties?: Property[];
        Id: number;
        Name: string;
        Controls?: Control[];
        Actions?: Action[];
        RelatedPagePartId?: Subtype;
    }

    export interface Codeunit {
        Variables?: Variable[];
        Methods?: Method[];
        ReferenceSourceFileName: string;
        Id: number;
        Name: string;
        Properties?: Property[];
        ImplementedInterfaces?: string[];
    }

    export interface Parameter {
        Name: string;
        TypeDefinition: TypeDefinition;
        IsVar?: boolean;
    }

    export interface TypeArgument {
        Name: string;
        Temporary: boolean;
        TypeArguments?: TypeDefinition[];
    }

    export interface Table {
        Fields: Field[];
        Keys: Key[];
        Methods?: Method[];
        ReferenceSourceFileName: string;
        Properties?: Property[];
        Id: number;
        Name: string;
        Variables?: Variable[];
        FieldGroups?: FieldGroup[];
    }

    export interface FieldGroup {
        FieldNames: string[];
        Name: string;
    }

    export interface Variable {
        TypeDefinition: TypeDefinition;
        Protected: boolean;
        Name: string;
        Attributes?: Attribute[];
    }

    export interface Method {
        ReturnTypeDefinition: TypeDefinition;
        MethodKind: number;
        Parameters: Parameter[];
        Id: number;
        Name: string;
        Attributes?: Attribute[];
        IsLocal?: boolean;
        IsInternal?: boolean;
        IsProtected?: boolean;
    }

    export interface Key {
        FieldNames: string[];
        Properties?: Property[];
        Name: string;
    }

    export interface Field {
        TypeDefinition: TypeDefinition;
        Properties?: Property[];
        Id: number;
        Name: string;
    }

    export interface Property {
        Value: string;
        Name: string;
    }

    export interface TypeDefinition {
        Name: string;
        Temporary: boolean;
        Subtype?: Subtype;
        OptionMembers?: string[];
        ArrayDimensions?: number[];
        TypeArguments?: TypeDefinition[];
    }

    export interface Subtype {
        Name: string;
        Id: number;
        IsEmpty: boolean;
    }

    export interface Attribute {
        Arguments: Argument[];
        Name: string;
    }

    export interface Argument {
        Value?: string;
    }
}