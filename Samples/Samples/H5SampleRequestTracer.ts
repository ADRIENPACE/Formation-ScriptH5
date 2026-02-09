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
class H5SampleRequestTracer {

	private scriptName = "H5SampleRequestTracer";
	private controller: IInstanceController;
	private log: IScriptLog;

	constructor(args: IScriptArgs) {
		this.controller = args.controller;
		this.log = args.log;
	}

	private logEvent(eventName: string, args: RequestEventArgs): void {
		this.log.Info("Event: " + eventName + " Command type: " + args.commandType + " Command value: " + args.commandValue);
	}

	private attachEvents(controller: IInstanceController): void {
		controller.Requesting.On((e) => {
			this.onRequesting(e);
		});
		controller.Requested.On((e) => {
			this.onRequested(e);
		});
		controller.RequestCompleted.On((e) => {
			this.onRequestCompleted(e);
		});
	}

	private onRequesting(args: CancelRequestEventArgs): void {
		this.logEvent("Requesting", args);
	}

	private onRequested(args: RequestEventArgs): void {
		this.logEvent("Requested", args);
	}

	private onRequestCompleted(args: RequestEventArgs): void {
		this.logEvent("RequestCompleted", args);
	}

	public run(): void {
		const controller = this.controller;
		const key = this.scriptName;
		const cache = InstanceCache;

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
	}

	/**
	 * Script initialization function.
	 */
	public static Init(args: IScriptArgs): void {
		new H5SampleRequestTracer(args).run();
	}
}