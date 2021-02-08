import IALComponent from "./al-component.model";
import IFieldGroup from "./field-group.model";

export default interface IFieldGroupList extends IALComponent {
    fieldGroups: IFieldGroup[];
    postLabelComments: string[];
    comments: string[];  
}