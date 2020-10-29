import IALComponent from "../../components/models/al-component.model";

export default interface IFormatter {
  format(component: IALComponent, indentation: number): string;
}
