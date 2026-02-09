/**
 * H5 Script SDK sample.
 */

/**
 * Shows a message dialog information about the connected element and script arguments.
 */
class H5SampleHelloWorld {
	/**
	 * Script initialization function.
	 */
	public static Init(args: IScriptArgs): void {
		let message: string;

		const element = args.elem;
		if (element) {
			message = "Connected element: " + element.Name;
		} else {
			message = "No element connected.";
		}

		const argumentString = args.args;
		if (argumentString != null) {
			message = message + " Arguments: " + argumentString;
		} else {
			message = message + " No arguments.";
		}

		// Show an information message dialog.
		ConfirmDialog.Show({
			header: "H5SampleHelloWorld",
			message: message,
			dialogType: "Information"
		});
	}
}