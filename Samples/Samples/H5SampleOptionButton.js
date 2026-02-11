/**
 * H5 Script SDK sample.
 */
/**
 * Adds one or more option buttons that executes a list option when clicked.
 *
 * Configuration example:
 * Single address button (option 11) in CRS610/B
 * {"option":"11","text":"Addresses","top":"79","left":"79","width":"120"}
 *
 * Configuration example:
 * Address and Charges buttons (option 11, 12) in CRS610/B
 * [{"option":"11","text":"Addresses","top":"79","left":"79","width":"120"},{"option":"12","text":"Charges","top":"79","left":"216","width":"120"}]
 */
var H5SampleOptionButton = (function () {
    function H5SampleOptionButton(scriptArgs) {
        this.controller = scriptArgs.controller;
        this.log = scriptArgs.log;
        this.args = scriptArgs.args;
    }
    H5SampleOptionButton.prototype.parseArgs = function (args) {
        try {
            // The argument string should be either an array of IButtonInfo or a single IButtonInfo object on JSON format.
            var json = JSON.parse(args);
            var buttons = void 0;
            if (json.length > 0) {
                // Assume it's an array of buttons
                buttons = json;
            }
            else {
                // Assume it's a single buttons object
                buttons = [json];
            }
            // Validate that all mandatory properties are set.
            for (var _i = 0, buttons_1 = buttons; _i < buttons_1.length; _i++) {
                var button = buttons_1[_i];
                if (!button.text || !button.option) {
                    this.log.Error("Invalid argument string " + args);
                    return false;
                }
            }
            this.buttons = buttons;
        }
        catch (ex) {
            this.log.Error("Failed to parse argument string " + args, ex);
            return false;
        }
        return true;
    };
    H5SampleOptionButton.prototype.addButton = function (buttonInfo) {
        var _this = this;
        var buttonElement = new ButtonElement();
        buttonElement.Value = buttonInfo.text;
        var button = ControlFactory.CreateButton(buttonElement);
        button.click({}, function () {
            _this.controller.ListOption(buttonInfo.option);
        });
        button.Position = {
            Width: buttonInfo.width || "100",
            Top: buttonInfo.top || "0",
            Left: buttonInfo.left || "0"
        };
        var contentElement = this.controller.GetContentElement();
        contentElement.Add(button);
    };
    H5SampleOptionButton.prototype.run = function () {
        // Parse the script argument string and return if the arguments are invalid.
        if (!this.parseArgs(this.args)) {
            return;
        }
        this.log.Info("Running...");
        // Add the option buttons to the panel.
        for (var _i = 0, _a = this.buttons; _i < _a.length; _i++) {
            var button = _a[_i];
            this.addButton(button);
        }
    };
    /**
     * Script initialization function.
     */
    H5SampleOptionButton.Init = function (args) {
        new H5SampleOptionButton(args).run();
    };
    return H5SampleOptionButton;
}());
//# sourceMappingURL=H5SampleOptionButton.js.map