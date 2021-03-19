export default interface IAppObjectDeclaration {
    type: string;
    id: string;
    name: string;
    extends: boolean;
    implements: boolean;
    baseObject: string;
    interfaces: string[];

    updateFromHeaderValues: (values: string[]) => void;
}