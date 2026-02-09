/**
 * H5 Script SDK sample.
 */
/**
 * Shows a message dialog information about the connected element and script arguments.
 */
var H5SampleHelloWorld = /** @class */ (function () {
    function H5SampleHelloWorld() {
    }
    /**
     * Script initialization function.
     */
    H5SampleHelloWorld.Init = function (args) {
        var message;
        var element = args.elem;
        if (element) {
            message = "Connected element: " + element.Name;
        }
        else {
            message = "No element connected.";
        }
        var argumentString = args.args;
        if (argumentString != null) {
            message = message + " Arguments: " + argumentString;
        }
        else {
            message = message + " No arguments.";
        }
        // Show an information message dialog.
        ConfirmDialog.Show({
            header: "H5SampleHelloWorld",
            message: message,
            dialogType: "Information"
        });
    };
    return H5SampleHelloWorld;
}());
//# sourceMappingURL=H5SampleHelloWorld.js.map