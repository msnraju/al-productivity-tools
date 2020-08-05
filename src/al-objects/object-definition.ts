export default interface IObjectDefinition {
  id?: string;
  type: string;
  name: string;
  extension?: boolean;
  extends?: string;
  uri?: string;
}
