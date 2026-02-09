/**
 * H5 Script SDK sample.
 */

/**
 * Represents validation information for a field.
 */
interface IValidationInfo {
	/**
	 * Gets or sets a list of field names that the validation should be applied to.
	 */
	names: string[];

	/**
	 * Gets or sets a regular expression used when validating the content of a field.
	 */
	regex: string;

	/**
	 * Gets or sets the message that should be displayed if a field cannot be validated.
	 */
	message: string;
}


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
class H5SampleRegexValidator {

	private scriptName = "H5SampleRegexValidator";
	private controller: IInstanceController;
	private log: IScriptLog;
	private args: string;
	private detachRequesting: Function;
	private detachRequested: Function;
	private validations: IValidationInfo[];

	constructor(scriptArgs: IScriptArgs) {
		this.controller = scriptArgs.controller;
		this.log = scriptArgs.log;
		this.args = scriptArgs.args;
	}

	private parseArgs(args: string): boolean {
		try {
			// The argument string should be either an array of IValidationInfo or a single IValidationInfo object on JSON format.
			const json: any = JSON.parse(args);
			let validations: IValidationInfo[];
			if (json.length > 0) {
				// Assume it's an array of validations
				validations = json;
			} else {
				// Assume it's a single validation object
				validations = [json];
			}

			// Validate that all mandatory properties are set.
			for (let validation of validations) {
				if (!validation.regex || !validation.message || !validation.names) {
					this.log.Error("Invalid argument string " + args);
					return false;
				}
			}

			this.validations = validations;
		} catch (ex) {
			this.log.Error("Failed to parse argument string " + args, ex);
			return false;
		}
		return true;
	}

	private validateFields(): boolean {
		try {
			for (var validation of this.validations) {
				const regExp = new RegExp(validation.regex);
				for (var name of validation.names) {
					const value = this.controller.GetValue(name);
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
		} catch (ex) {
			this.log.Error("Failed to validate fields", ex);

			// Return true if the script crashes to avoid getting stuck on a panel.
			return true;
		}
	}

	private logEvent(eventName: string, args: RequestEventArgs): void {
		this.log.Info("Event: " + eventName + " Command type: " + args.commandType + " Command value: " + args.commandValue);
	}

	private detachEvents(): void {
		this.detachRequesting();
		this.detachRequested();
	}

	private attachEvents(controller: IInstanceController): void {
		this.detachRequesting = controller.Requesting.On((e) => {
			this.onRequesting(e);
		});
		this.detachRequested = controller.Requested.On((e) => {
			this.onRequested(e);
		});
	}

	private onRequesting(args: CancelRequestEventArgs): void {
		// Only validate for the enter key (next button).
		if (args.commandType === "KEY" && args.commandValue === "ENTER") {
			if (!this.validateFields()) {
				args.cancel = true;
			}
		}
	}

	private onRequested(args: RequestEventArgs): void {
		this.detachEvents();
	}

	public run(): void {
		if (!this.parseArgs(this.args)) {
			return;
		}

		this.log.Info("Running...");

		// Attach events.
		this.attachEvents(this.controller);
	}

	/**
	 * Script initialization function.
	 */
	public static Init(args: IScriptArgs): void {
		new H5SampleRegexValidator(args).run();
	}
}