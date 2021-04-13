import IObjectContext from "./object-context.model";

export default interface IRequestPage extends IObjectContext  {
  postLabelComments: string[];
  comments: string[];
}