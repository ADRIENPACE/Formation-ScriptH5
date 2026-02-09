class H5SampleCustomDialog {
    private scriptName: string;
    private isDialogShown: boolean;
    private controller: IInstanceController;
    private log: IScriptLog;
    private unregisterRequesting: Function;
    private unregisterRequested: Function;

    constructor(args: IScriptArgs) {
        this.scriptName = "H5SampleCustomDialog";
        this.isDialogShown = false;
        this.controller = args.controller;
        this.log = args.log;
    }

    private onRequesting(args) {
        if (args.commandType === "KEY" && args.commandValue === "ENTER" && !this.isDialogShown) {
            // Cancel the request and show a dialog
            args.cancel = true;
            // Delay the dialog to let the H5 complete processing the cancelled request
            setTimeout(() => {
                this.showDialog();
            }, 0);
        }
    }

    private pressEnterAsync() {
        setTimeout(() => {
            this.controller.PressKey("ENTER")
        }, 0);
    }

    private showDialog() {
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
                    } else {
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
                    } else {
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
        } else {
            dialogContent.inforMessageDialog(dialogOptions);
        }
    }

    private onRequested(args) {
        // Unregister all events
        this.unregisterRequesting();
        this.unregisterRequested();
    }

    private run() {
        var controller = this.controller;
        this.unregisterRequesting = controller.Requesting.On((e) => {
            this.onRequesting(e);
        });
        this.unregisterRequested = controller.Requested.On((e) => {
            this.onRequested(e);
        });
    }

    /**
     * Script initialization function.
     */
    public static Init(args: IScriptArgs) {
        new H5SampleCustomDialog(args).run();
    }
}
