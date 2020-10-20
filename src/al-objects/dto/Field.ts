import { ISegment } from "../models/ISegment";
import { IFunction } from "../models/IFunction";
import { IField } from "../models/IField";


export default class Field implements IField {
  comments: string[];
  header: string;
  triggers: IFunction[];
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
