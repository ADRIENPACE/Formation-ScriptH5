/**
* H5 Script SDK sample.
*/
/**
 * Add script to POS015/E
 * Subscribes to the Requesting event
 * On event, it checks the name of the project leader. If invalid, it cancels the request and shows an error message
 */
var H5SampleCancelRequest = (function () {
    function H5SampleCancelRequest(scriptArgs) {
        this.controller = scriptArgs.controller;
        this.log = scriptArgs.log;
    }
    /**
     * Script initialization function.
     */
    H5SampleCancelRequest.Init = function (args) {
        new H5SampleCancelRequest(args).run();
    };
    H5SampleCancelRequest.prototype.run = function () {
        var _this = this;
        this.unsubscribeRequesting = this.controller.Requesting.On(function (e) {
            _this.onRequesting(e);
        });
        this.unsubscribeRequested = this.controller.Requested.On(function (e) {
            _this.onRequested(e);
        });
    };
    H5SampleCancelRequest.prototype.onRequesting = function (args) {
        this.log.Info("onRequesting");
        if (args.commandType === "KEY" && args.commandValue === "ENTER") {
            args.cancel = true;
            return; // The user should be allowed to go back
        }
        this.controller.PressKey("ENTER");
        /*const fullName = ScriptUtil.GetFieldValue("WWTX40");

        if (fullName && fullName.indexOf("Infor") >= 0) {
            this.controller.ShowMessage(fullName + " is not a valid project leader.");
            args.cancel = true;
        }*/
    };
    H5SampleCancelRequest.prototype.onRequested = function (args) {
        this.log.Info("onRequested");
        this.unsubscribeRequested();
        this.unsubscribeRequesting();
    };
    return H5SampleCancelRequest;
}());
//# sourceMappingURL=H5SampleCancelRequest.js.map