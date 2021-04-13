import IControl from "./components/models/control.model";
import IAction from "./components/models/action.model";

export class ObjectHelper {
  static findInActions(actions: IAction[], name: string): IAction | undefined {
    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      if (action.type.toLowerCase() === "action" && action.name === name) {
        return action;
      }

      if (action.actions && action.actions.length > 0) {
        const actionFound = ObjectHelper.findInActions(action.actions, name);
        if (actionFound) {
          return actionFound;
        }
      }
    }
  }

  static findInControls(
    controls: IControl[],
    name: string
  ): IControl | undefined {
    for (let i = 0; i < controls.length; i++) {
      const control = controls[i];
      if (control.type.toLowerCase() === "field" && control.name === name) {
        return control;
      }

      if (control.controls && control.controls.length > 0) {
        const controlFound = ObjectHelper.findInControls(
          control.controls,
          name
        );
        if (controlFound) {
          return controlFound;
        }
      }
    }
  }
}
