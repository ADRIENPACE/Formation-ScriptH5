/**
* H5 Script SDK sample.
*/
/**
 * Retrieves the user ID from the user context
 * and creates an automation that starts MNS150 and opens the user in change mode.
 */
var H5SampleMFormsAutomation = /** @class */ (function () {
    function H5SampleMFormsAutomation(args) {
        this.controller = args.controller;
        this.log = args.log;
    }
    /**
    * Script initialization function.
    */
    H5SampleMFormsAutomation.Init = function (args) {
        new H5SampleMFormsAutomation(args).run();
    };
    H5SampleMFormsAutomation.prototype.run = function () {
        if (this.controller.GetProgramName() === "MNS150") {
            this.log.Error("Adding this script will cause an infinite loop. Try adding it to a different program.");
            return;
        }
        this.addButton();
    };
    H5SampleMFormsAutomation.prototype.addButton = function () {
        var run = new ButtonElement();
        run.Name = "run";
        run.Value = "Run Automation";
        run.Position = new PositionElement();
        run.Position.Top = 2;
        run.Position.Left = 1;
        run.Position.Width = 5;
        var contentElement = this.controller.GetContentElement();
        var $run = contentElement.AddElement(run);
        $run.click({}, function () {
            var auto = new MFormsAutomation();
            auto.addStep(ActionType.Run, "MNS150");
            auto.addStep(ActionType.Key, "ENTER");
            auto.addField("W1USID", ScriptUtil.GetUserContext("USID"));
            auto.addStep(ActionType.ListOption, "2");
            var uri = auto.toEncodedUri();
            ScriptUtil.Launch(uri);
        });
    };
    return H5SampleMFormsAutomation;
}());
//# sourceMappingURL=H5SampleMFormsAutomation.js.map