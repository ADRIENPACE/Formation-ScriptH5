/**
 * H5 Script SDK sample.
 */
/**
 * Logs the command type and command value for the Requesting, Requested and RequestCompleted events on a panel.
 *
 * Note that this script will only attach once for a program instance and that it uses the instance cache
 * to check if an instance of this script has already been attached to the program instance. A script would
 * normally detach all events on the controller when either the Requested or the RequestCompleted event if fired.
 * Since this script traces all requests for a program instance it will never detach the events and that is OK
 * in this scenario since the script will only attach once. There are scenarios were a real script would do the same
 * but this is not common, in most cases all events should be detached.
 */
var H5SampleRequestTracer = /** @class */ (function () {
    function H5SampleRequestTracer(args) {
        this.scriptName = "H5SampleRequestTracer";
        this.controller = args.controller;
        this.log = args.log;
    }
    H5SampleRequestTracer.prototype.logEvent = function (eventName, args) {
        this.log.Info("Event: " + eventName + " Command type: " + args.commandType + " Command value: " + args.commandValue);
    };
    H5SampleRequestTracer.prototype.attachEvents = function (controller) {
        var _this = this;
        controller.Requesting.On(function (e) {
            _this.onRequesting(e);
        });
        controller.Requested.On(function (e) {
            _this.onRequested(e);
        });
        controller.RequestCompleted.On(function (e) {
            _this.onRequestCompleted(e);
        });
    };
    H5SampleRequestTracer.prototype.onRequesting = function (args) {
        this.logEvent("Requesting", args);
    };
    H5SampleRequestTracer.prototype.onRequested = function (args) {
        this.logEvent("Requested", args);
    };
    H5SampleRequestTracer.prototype.onRequestCompleted = function (args) {
        this.logEvent("RequestCompleted", args);
    };
    H5SampleRequestTracer.prototype.run = function () {
        var controller = this.controller;
        var key = this.scriptName;
        var cache = InstanceCache;
        // Check the instace cache to see if this script has already attached to this program instance.
        if (cache.ContainsKey(controller, key)) {
            // The script is already attached to this instance.
            return;
        }
        this.log.Info("Running...");
        // Add a key to the instance cache to prevent other instances of this script on the same program instance.
        cache.Add(controller, key, true);
        // Attach events.
        this.attachEvents(controller);
    };
    /**
     * Script initialization function.
     */
    H5SampleRequestTracer.Init = function (args) {
        new H5SampleRequestTracer(args).run();
    };
    return H5SampleRequestTracer;
}());
//# sourceMappingURL=H5SampleRequestTracer.js.map