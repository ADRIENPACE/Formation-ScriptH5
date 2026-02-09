/**
 * H5 Script SDK sample.
 */

/**
 * Displays the field help of the corresponding argument attached in the script.
 * The script adds a click event to the attached element which opens the field help of the element based on the argument supplied.
 * When there is no argument, the script will use the element name where it is attached.
 */
class H5SampleOpenFieldHelp {
    public static Init(args: IScriptArgs): void {
        const element = args.elem;
        const controller = args.controller;
        const fieldHelp = args.args;
        const response = controller.Response;
        const $host = controller.ParentWindow;

        if (element) {
            let $elem = ScriptUtil.FindChild($host, element.Name);

            if ($elem.length > 0) {
                ScriptUtil.AddEventHandler($elem, "click", (event) => {
                    const helpElement = $("#" + (fieldHelp || element.Name));
                    controller.RenderEngine.OpenFieldHelp(response, $host, controller, helpElement);
                });
            }
        }
        else {
            ConfirmDialog.ShowMessageDialog({
                dialogType: "Error",
                header: "H5 Sample Field Help Button",
                message: "No element connected"
            });
        }
    }
}