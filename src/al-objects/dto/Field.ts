import ISegment from "../models/ISegment";
import IProcedure from "../models/IProcedure";
import IField from "../models/IField";

export default class Field implements IField {
  comments: string[];
  header: string;
  triggers: IProcedure[];
  segments: ISegment[];
  properties: string[];

  constructor() {
    this.comments = [];
    this.header = "";
    this.triggers = [];
    this.segments = [];
    this.properties = [];
  }
}
