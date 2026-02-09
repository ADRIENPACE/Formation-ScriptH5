/**
 * H5 Script SDK sample.
 */
/**
 * Validates the content of one or more fields on a panel and shows a validation message for the first validation that fails.
 *
 * This script will validate fields that it has been configured for when the users presses enter or clicks the next button.
 * If the field validation fails a message will be displayed in status bar or in a message dialog depending on the users setting.
 * The request will be cancelled and the user will not be able to continue until the validation errors have been addressed.
 *
 *
 * Configuration example:
 * Validate that the WRYREF field is not blank on the CRS610/E panel.
 * Note that the backslash character has been escaped with an additional backslash character.
 *
 * { "names": ["WRYREF"], "regex": "^$|\\s+", "message": "Your ref 1 may not be blank" }
 *
 *
 * Online regular expression tester:
 * https://regex101.com/
 *
 * Online JSON validator.
 * http://jsonlint.com/
 */
var H5SampleRegexValidator = /** @class */ (function () {
    function H5SampleRegexValidator(scriptArgs) {
        this.scriptName = "H5SampleRegexValidator";
        this.controller = scriptArgs.controller;
        this.log = scriptArgs.log;
        this.args = scriptArgs.args;
    }
    H5SampleRegexValidator.prototype.parseArgs = function (args) {
        try {
            // The argument string should be either an array of IValidationInfo or a single IValidationInfo object on JSON format.
            var json = JSON.parse(args);
            var validations = void 0;
            if (json.length > 0) {
                // Assume it's an array of validations
                validations = json;
            }
            else {
                // Assume it's a single validation object
                validations = [json];
            }
            // Validate that all mandatory properties are set.
            for (var _i = 0, validations_1 = validations; _i < validations_1.length; _i++) {
                var validation = validations_1[_i];
                if (!validation.regex || !validation.message || !validation.names) {
                    this.log.Error("Invalid argument string " + args);
                    return false;
                }
            }
            this.validations = validations;
        }
        catch (ex) {
            this.log.Error("Failed to parse argument string " + args, ex);
            return false;
        }
        return true;
    };
    H5SampleRegexValidator.prototype.validateFields = function () {
        try {
            for (var _i = 0, _a = this.validations; _i < _a.length; _i++) {
                var validation = _a[_i];
                var regExp = new RegExp(validation.regex);
                for (var _b = 0, _c = validation.names; _b < _c.length; _b++) {
                    var name = _c[_b];
                    var value = this.controller.GetValue(name);
                    if (value === null || value === undefined) {
                        // Skip fields that does not exist on the current panel.
                        this.log.Debug("The field " + name + " does not exist on the panel.");
                        continue;
                    }
                    if (regExp.test(value)) {
                        this.controller.ShowMessage(validation.message);
                        return false;
                    }
                }
            }
            return true;
        }
        catch (ex) {
            this.log.Error("Failed to validate fields", ex);
            // Return true if the script crashes to avoid getting stuck on a panel.
            return true;
        }
    };
    H5SampleRegexValidator.prototype.logEvent = function (eventName, args) {
        this.log.Info("Event: " + eventName + " Command type: " + args.commandType + " Command value: " + args.commandValue);
    };
    H5SampleRegexValidator.prototype.detachEvents = function () {
        this.detachRequesting();
        this.detachRequested();
    };
    H5SampleRegexValidator.prototype.attachEvents = function (controller) {
        var _this = this;
        this.detachRequesting = controller.Requesting.On(function (e) {
            _this.onRequesting(e);
        });
        this.detachRequested = controller.Requested.On(function (e) {
            _this.onRequested(e);
        });
    };
    H5SampleRegexValidator.prototype.onRequesting = function (args) {
        // Only validate for the enter key (next button).
        if (args.commandType === "KEY" && args.commandValue === "ENTER") {
            if (!this.validateFields()) {
                args.cancel = true;
            }
        }
    };
    H5SampleRegexValidator.prototype.onRequested = function (args) {
        this.detachEvents();
    };
    H5SampleRegexValidator.prototype.run = function () {
        if (!this.parseArgs(this.args)) {
            return;
        }
        this.log.Info("Running...");
        // Attach events.
        this.attachEvents(this.controller);
    };
    /**
     * Script initialization function.
     */
    H5SampleRegexValidator.Init = function (args) {
        new H5SampleRegexValidator(args).run();
    };
    return H5SampleRegexValidator;
}());
//# sourceMappingURL=H5SampleRegexValidator.js.map