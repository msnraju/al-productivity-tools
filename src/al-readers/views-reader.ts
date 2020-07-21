import { IReadContext, ISegment } from './object-reader';
import { IToken } from './tokenizer';
import { Helper } from './helper';
import { PropertyReader } from './property-reader';
import { Keywords } from './keywords';
import _ = require('lodash');

export interface IViewContainer {
  views: Array<IView>;
  postLabelComments: Array<string>;
  comments: Array<string>;
}

export interface IView {
  comments: string[];
  header: string;
  segments: Array<ISegment>;
  properties: Array<string>;
}

export class ViewsReader {
  static readViews(context: IReadContext): IViewContainer {
    const views: Array<IView> = [];

    let value = context.tokens[context.pos].value.toLocaleLowerCase();
    if (value !== 'views') throw new Error('Invalid views container position');
    context.pos++;

    Helper.readWhiteSpaces(context, []);
    const postLabelComments = Helper.readComments(context);
    Helper.readWhiteSpaces(context, []);
    value = context.tokens[context.pos].value;
    if (value !== '{') throw new Error('Invalid views container position');
    context.pos++;

    const comments = Helper.readComments(context);
    Helper.readWhiteSpaces(context, []);

    value = context.tokens[context.pos].value.toLocaleLowerCase();
    while (Keywords.PageViewTypes.indexOf(value) !== -1) {
      const view = this.readView(context);
      views.push(view);
      value = context.tokens[context.pos].value.toLocaleLowerCase();
    }

    value = context.tokens[context.pos].value;
    if (value !== '}') throw new Error('Invalid views container position');
    context.pos++;
    Helper.readWhiteSpaces(context, []);

    return {
      views: views,
      postLabelComments: postLabelComments,
      comments: comments,
    };
  }

  static readView(context: IReadContext): IView {
    const view: IView = {
      header: '',
      segments: [],
      comments: [],
      properties: [],
    };

    const name = context.tokens[context.pos].value.toLocaleLowerCase();
    if (Keywords.PageViewTypes.indexOf(name) === -1)
      throw Error('Invalid view position');

    context.pos++;
    Helper.readWhiteSpaces(context, []);

    let value = context.tokens[context.pos].value;
    if (value !== '(') throw Error('Invalid view position');

    const headerTokens: Array<IToken> = [];
    while (value !== ')') {
      headerTokens.push(context.tokens[context.pos]);
      context.pos++;
      value = context.tokens[context.pos].value;
    }

    if (value !== ')') throw Error('Invalid field position');
    headerTokens.push(context.tokens[context.pos]);
    context.pos++;
    view.header = `${name}${Helper.tokensToString(headerTokens, {})}`;

    Helper.readWhiteSpaces(context, []);
    view.comments = Helper.readComments(context);

    value = context.tokens[context.pos].value;
    if (value !== '{') throw new Error('Invalid field position');
    context.pos++;

    Helper.readWhiteSpaces(context, []);
    value = context.tokens[context.pos].value.toLocaleLowerCase();
    while (value !== '}') {
      switch (value) {
        default:
          if (context.tokens[context.pos].type === 'comment') {
            view.properties.push(context.tokens[context.pos].value);
            context.pos++;
            Helper.readWhiteSpaces(context, []);
          } else {
            view.properties.push(PropertyReader.readProperties(context));
          }
          break;
      }

      value = context.tokens[context.pos].value.toLocaleLowerCase();
    }

    if (value !== '}') throw new Error('Invalid field position');
    context.pos++;

    Helper.readWhiteSpaces(context, []);
    return view;
  }

  static viewContainerToString(
    container: IViewContainer,
    indentation: number
  ): Array<string> {
    const lines: Array<string> = [];
    const pad = _.padStart('', indentation);

    lines.push(`${pad}views`);
    if (container.postLabelComments.length > 0) {
      container.postLabelComments.forEach((line) =>
        lines.push(`${pad}${line}`)
      );
    }
    lines.push(`${pad}{`);
    if (container.comments.length > 0) {
      container.comments.forEach((line) => lines.push(`${pad}${line}`));
    }

    container.views.forEach((view) => {
      const fieldLines = this.viewToString(view, indentation + 4);
      fieldLines.forEach((line) => lines.push(line));
    });

    lines.push(`${pad}}`);
    return lines;
  }

  static viewToString(view: IView, indentation: number): Array<string> {
    const lines: Array<string> = [];
    const pad = _.padStart('', indentation);
    const pad12 = _.padStart('', indentation + 4);

    lines.push(`${pad}${view.header}`);
    view.comments.forEach((line) => lines.push(`${pad}${line}`));
    lines.push(`${pad}{`);

    if (view.properties.length > 0) {
      view.properties.forEach((property) => {
        lines.push(`${pad12}${property}`);
      });
      lines.push('');
    }

    if (lines[lines.length - 1] === '') lines.pop();
    lines.push(`${pad}}`);
    return lines;
  }
}
