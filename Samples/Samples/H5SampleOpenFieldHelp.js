/**
 * H5 Script SDK sample.
 */
/**
 * Displays the field help of the corresponding argument attached in the script.
 * The script adds a click event to the attached element which opens the field help of the element based on the argument supplied.
 * When there is no argument, the script will use the element name where it is attached.
 */
var H5SampleOpenFieldHelp = /** @class */ (function () {
    function H5SampleOpenFieldHelp() {
    }
    H5SampleOpenFieldHelp.Init = function (args) {
        var element = args.elem;
        var controller = args.controller;
        var fieldHelp = args.args;
        var response = controller.Response;
        var $host = controller.ParentWindow;
        if (element) {
            var $elem = ScriptUtil.FindChild($host, element.Name);
            if ($elem.length > 0) {
                ScriptUtil.AddEventHandler($elem, "click", function (event) {
                    var helpElement = $("#" + (fieldHelp || element.Name));
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
    };
    return H5SampleOpenFieldHelp;
}());
//# sourceMappingURL=H5SampleOpenFieldHelp.js.map