import IFieldGroup from "./IFieldGroup";

export default interface IFieldGroupContainer {
    fieldGroups: IFieldGroup[];
    postLabelComments: string[];
    comments: string[];  
}