import { IReadContext, ISegment } from './object-reader';
import { IToken } from './tokenizer';
import { Helper } from './helper';
import { FunctionReader, IFunction } from './function-reader';
import { PropertyReader } from './property-reader';
import { ActionsReader, IActionContainer } from './actions-reader';
import { Keywords } from './keywords';
import _ = require('lodash');

export interface ILayout {
  controls: Array<IControl>;
  postLabelComments: Array<string>;
  comments: Array<string>;
}

export interface IControl {
  actionContainer?: IActionContainer;
  controls: Array<IControl>;
  comments: string[];
  header: string;
  triggers: Array<IFunction>;
  segments: Array<ISegment>;
  properties: Array<string>;
}

export class LayoutReader {
  static readLayout(context: IReadContext): ILayout {
    const controls: Array<IControl> = [];

    let value = context.tokens[context.pos].value.toLocaleLowerCase();
    if (value !== 'layout') throw new Error('Invalid layout position');
    context.pos++;

    Helper.readWhiteSpaces(context, []);
    const postLabelComments = Helper.readComments(context);
    Helper.readWhiteSpaces(context, []);
    value = context.tokens[context.pos].value;
    if (value !== '{') throw new Error('Invalid layout position');
    context.pos++;

    const comments = Helper.readComments(context);
    Helper.readWhiteSpaces(context, []);

    value = context.tokens[context.pos].value.toLocaleLowerCase();
    while (
      Keywords.PageControlTypes.indexOf(value) !== -1 ||
      Keywords.ExtensionKeywords.indexOf(value) !== -1
    ) {
      const control = this.readControl(context);
      controls.push(control);
      value = context.tokens[context.pos].value.toLocaleLowerCase();
    }

    value = context.tokens[context.pos].value;
    if (value !== '}') throw new Error('Invalid layout position');
    context.pos++;
    Helper.readWhiteSpaces(context, []);

    return {
      controls: controls,
      postLabelComments: postLabelComments,
      comments: comments,
    };
  }

  static readControl(context: IReadContext): IControl {
    const control: IControl = {
      header: '',
      controls: [],
      triggers: [],
      segments: [],
      comments: [],
      properties: [],
    };

    const name = context.tokens[context.pos].value.toLocaleLowerCase();
    if (
      Keywords.PageControlTypes.indexOf(name) === -1 &&
      Keywords.ExtensionKeywords.indexOf(name) === -1
    )
      throw Error('Invalid control position');

    context.pos++;
    Helper.readWhiteSpaces(context, []);

    let value = context.tokens[context.pos].value;
    if (value !== '(') throw Error('Invalid control position');
    let counter = 1;
    const headerTokens: Array<IToken> = [];
    while (value !== ')' || counter !== 0) {
      headerTokens.push(context.tokens[context.pos]);
      context.pos++;
      value = context.tokens[context.pos].value;
      if (value === '(') {
        counter++;
      } else if (value === ')') {
        counter--;
      }
    }

    if (value !== ')') throw Error('Invalid control position');
    headerTokens.push(context.tokens[context.pos]);
    context.pos++;
    control.header = `${name}${Helper.tokensToString(headerTokens, {})}`;

    Helper.readWhiteSpaces(context, []);
    control.comments = Helper.readComments(context);

    value = context.tokens[context.pos].value;
    if (value !== '{') throw new Error('Invalid control position');
    context.pos++;

    Helper.readWhiteSpaces(context, []);
    value = context.tokens[context.pos].value.toLocaleLowerCase();
    while (value !== '}') {
      switch (value) {
        case 'area':
        case 'group':
        case 'cuegroup':
        case 'repeater':
        case 'grid':
        case 'fixed':
        case 'part':
        case 'systempart':
        case 'usercontrol':
        case 'field':
        case 'label':
          control.controls.push(this.readControl(context));
          break;
        case 'actions':
          control.actionContainer = ActionsReader.readActions(context);
          break;
        case 'trigger':
          control.triggers.push(FunctionReader.readFunction(context));
          break;
        default:
          if (context.tokens[context.pos].type === 'comment') {
            control.properties.push(context.tokens[context.pos].value);
            context.pos++;
            Helper.readWhiteSpaces(context, []);
          } else {
            control.properties.push(PropertyReader.readProperties(context));
          }
          break;
      }

      value = context.tokens[context.pos].value.toLocaleLowerCase();
    }

    if (value !== '}') throw new Error('Invalid control position');
    context.pos++;

    Helper.readWhiteSpaces(context, []);
    return control;
  }

  static layoutToString(layout: ILayout): Array<string> {
    const lines: Array<string> = [];
    const pad = _.padStart('', 4);

    lines.push(`${pad}layout`);
    if (layout.postLabelComments.length > 0) {
      layout.postLabelComments.forEach((line) => lines.push(`${pad}${line}`));
    }
    lines.push(`${pad}{`);
    if (layout.comments.length > 0) {
      layout.comments.forEach((line) => lines.push(`${pad}${line}`));
    }

    layout.controls.forEach((control) => {
      const controlLines = this.controlToString(control, 8);
      controlLines.forEach((line) => lines.push(line));
    });

    lines.push(`${pad}}`);
    return lines;
  }

  static controlToString(
    control: IControl,
    indentation: number
  ): Array<string> {
    const lines: Array<string> = [];
    const pad = _.padStart('', indentation);
    const pad12 = _.padStart('', indentation + 4);
    
    lines.push(`${pad}${control.header}`);
    control.comments.forEach((line) => lines.push(`${pad}${line}`));
    lines.push(`${pad}{`);

    if (control.properties.length > 0) {
      control.properties.forEach((property) => {
        lines.push(`${pad12}${property}`);
      });
      lines.push('');
    }

    if (control.controls.length > 0) {
      control.controls.forEach((control2) => {
        const controlLines = this.controlToString(control2, indentation + 4);
        controlLines.forEach((line) => lines.push(line));
      });
    }

    if (control.actionContainer) {
      const actionLines = ActionsReader.actionContainerToString(
        control.actionContainer,
        indentation + 4
      );

      actionLines.forEach((line) => lines.push(line));
    }

    if (control.triggers.length > 0) {
      control.triggers.forEach((trigger) => {
        const triggerLines = FunctionReader.functionToString(
          trigger,
          indentation + 4
        );
        triggerLines.forEach((line) => lines.push(line));
        lines.push('');
      });
    }

    if (lines[lines.length - 1] === '') lines.pop();
    lines.push(`${pad}}`);
    return lines;
  }
}
