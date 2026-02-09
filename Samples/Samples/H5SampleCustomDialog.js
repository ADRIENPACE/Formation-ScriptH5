var H5SampleCustomDialog = /** @class */ (function () {
    function H5SampleCustomDialog(args) {
        this.scriptName = "H5SampleCustomDialog";
        this.isDialogShown = false;
        this.controller = args.controller;
        this.log = args.log;
    }
    H5SampleCustomDialog.prototype.onRequesting = function (args) {
        var _this = this;
        if (args.commandType === "KEY" && args.commandValue === "ENTER" && !this.isDialogShown) {
            // Cancel the request and show a dialog
            args.cancel = true;
            // Delay the dialog to let the H5 complete processing the cancelled request
            setTimeout(function () {
                _this.showDialog();
            }, 0);
        }
    };
    H5SampleCustomDialog.prototype.pressEnterAsync = function () {
        var _this = this;
        setTimeout(function () {
            _this.controller.PressKey("ENTER");
        }, 0);
    };
    H5SampleCustomDialog.prototype.showDialog = function () {
        // Use self to get correct reference to the class in the button handlers.
        var self = this;
        // Create the dialog content
        var dialogContent = $("<div><label class='inforLabel noColon'>Custom dialog content</label></div>");
        var dialogButtons = [
            {
                text: "OK",
                isDefault: true,
                width: 80,
                click: function (event, model) {
                    if (ScriptUtil.version >= 2.0) {
                        model.close(true);
                    }
                    else {
                        $(this).inforDialog("close");
                    }
                    self.isDialogShown = true;
                    self.pressEnterAsync();
                }
            },
            {
                text: "Cancel",
                width: 80,
                click: function (event, model) {
                    if (ScriptUtil.version >= 2.0) {
                        model.close(true);
                    }
                    else {
                        $(this).inforDialog("close");
                    }
                }
            }
        ];
        var dialogOptions = {
            title: "A custom dialog title",
            dialogType: "General",
            modal: true,
            width: 600,
            minHeight: 480,
            icon: "info",
            closeOnEscape: true,
            close: function () {
                dialogContent.remove();
            },
            buttons: dialogButtons
        };
        // Show the dialog
        if (ScriptUtil.version >= 2.0) {
            H5ControlUtil.H5Dialog.CreateDialogElement(dialogContent[0], dialogOptions);
        }
        else {
            dialogContent.inforMessageDialog(dialogOptions);
        }
    };
    H5SampleCustomDialog.prototype.onRequested = function (args) {
        // Unregister all events
        this.unregisterRequesting();
        this.unregisterRequested();
    };
    H5SampleCustomDialog.prototype.run = function () {
        var _this = this;
        var controller = this.controller;
        this.unregisterRequesting = controller.Requesting.On(function (e) {
            _this.onRequesting(e);
        });
        this.unregisterRequested = controller.Requested.On(function (e) {
            _this.onRequested(e);
        });
    };
    /**
     * Script initialization function.
     */
    H5SampleCustomDialog.Init = function (args) {
        new H5SampleCustomDialog(args).run();
    };
    return H5SampleCustomDialog;
}());
//# sourceMappingURL=H5SampleCustomDialog.js.map