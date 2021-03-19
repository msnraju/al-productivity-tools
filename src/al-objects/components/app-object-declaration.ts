import { isNumber } from "lodash";
import IAppObjectDeclaration from "./models/app-object-declaration.model";


export default class AppObjectDeclaration implements IAppObjectDeclaration {
    type: string;
    id: string;
    name: string;
    extends: boolean;
    baseObject: string;
    implements: boolean;
    interfaces: string[];

    constructor() {
        this.type = "";
        this.id = "";
        this.name = "";
        this.baseObject = "";
        this.extends = false;
        this.implements = false;
        this.interfaces = [];
    }

    updateFromHeaderValues(values: string[]) {
        let index: number = 0;
        this.type = values[index++];
        if (/\d/.test(values[index])) {
            this.id = values[index++];
        }

        this.name = values[index++];
        if (values.length > index + 1) {
            if (values[index].toLowerCase() == "extends") {
                this.extends = true;
                this.baseObject = values[++index];
            } else if (values[index].toLowerCase() == "implements") {
                this.implements = true;
                index++;
                for (; index < values.length; index++) {
                    this.interfaces.push(values[index]);
                }
            }
        }
    }
}