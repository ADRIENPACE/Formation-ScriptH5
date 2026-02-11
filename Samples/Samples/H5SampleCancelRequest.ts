/**
* H5 Script SDK sample.
*/

/**
 * Add script to POS015/E
 * Subscribes to the Requesting event 
 * On event, it checks the name of the project leader. If invalid, it cancels the request and shows an error message
 */
class H5SampleCancelRequest {
    private controller: IInstanceController;
    private log: IScriptLog;
    private unsubscribeRequesting;
    private unsubscribeRequested;

    constructor(scriptArgs: IScriptArgs) {
        this.controller = scriptArgs.controller;
        this.log = scriptArgs.log;
    }

    /**
	 * Script initialization function.
	 */
    public static Init(args: IScriptArgs): void {
        new H5SampleCancelRequest(args).run();
    }

    private run(): void {
        this.unsubscribeRequesting = this.controller.Requesting.On((e) => {
            this.onRequesting(e);
        });
        this.unsubscribeRequested = this.controller.Requested.On((e) => {
            this.onRequested(e);
        });
    }

    private onRequesting(args: CancelRequestEventArgs): void {
        this.log.Info("onRequesting");
        if (args.commandType === "KEY" && args.commandValue === "ENTER") {
            args.cancel = true;
            return; // The user should be allowed to go back
        }
        this.controller.PressKey("ENTER");
        this.controller.ListOption("5");
        /*const fullName = ScriptUtil.GetFieldValue("WWTX40");

        if (fullName && fullName.indexOf("Infor") >= 0) {
            this.controller.ShowMessage(fullName + " is not a valid project leader.");
            args.cancel = true;
        }*/
    }

    private onRequested(args: RequestEventArgs): void {
        this.log.Info("onRequested");

        this.unsubscribeRequested();
        this.unsubscribeRequesting();
    }
}