/**
* H5 Script SDK sample.
*/
/**
 * Adds a custom ButtonElement on the Panel.
 * When the button is clicked, a message dialog shows M3-related data about the logged on user.
 */
var H5SampleUserDetails = /** @class */ (function () {
    function H5SampleUserDetails(scriptArgs) {
        this.controller = scriptArgs.controller;
        this.log = scriptArgs.log;
        this.args = scriptArgs.args;
    }
    /**
     * Script initialization function.
     */
    H5SampleUserDetails.Init = function (args) {
        new H5SampleUserDetails(args).run();
    };
    H5SampleUserDetails.prototype.run = function () {
        this.addButton();
    };
    H5SampleUserDetails.prototype.addButton = function () {
        var _this = this;
        var buttonElement = new ButtonElement();
        buttonElement.Name = "showUserDetails";
        buttonElement.Value = "Show User Details";
        buttonElement.Position = new PositionElement();
        buttonElement.Position.Top = 2;
        buttonElement.Position.Left = 1;
        buttonElement.Position.Width = 5;
        var contentElement = this.controller.GetContentElement();
        var button = contentElement.AddElement(buttonElement);
        button.click(function () {
            _this.showDetails();
        });
    };
    H5SampleUserDetails.prototype.showDetails = function () {
        var userContext = ScriptUtil.GetUserContext();
        var header = "USER DETAILS";
        var message = [];
        for (var key in userContext) {
            message.push(key + ": " + userContext[key]);
        }
        var opts = {
            dialogType: "Information",
            header: header,
            message: message.join("<br/>"),
            id: "msgDetails",
            withCancelButton: true,
            isCancelDefault: false
        };
        ConfirmDialog.ShowMessageDialog(opts);
    };
    return H5SampleUserDetails;
}());
//# sourceMappingURL=H5SampleUserDetails.js.map