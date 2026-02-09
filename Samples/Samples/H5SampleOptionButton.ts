/**
 * H5 Script SDK sample.
 */

/**
 * Represents information about a button.
 */
interface IButtonInfo {
	/**
	 * Gets or sets the list option to execute.
	 */
	option: string;

	/**
	 * Gets or sets the text to display on the button.
	 */
	text: string;

	/**
	 * Gets or sets the left position.
	 * The default unit if not specified is pixels.
	 */
	left: string;

	/**
	 * Gets or sets the top position.
	 * The default unit if not specified is pixels.
	 */
	top: string;

	/**
	 * Gets or sets the width of the button.
	 * The default value is 100 px.
	 * The default unit if not specified is pixels.
	 */
	width: string;
}

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
class H5SampleOptionButton {
	private controller: IInstanceController;
	private log: IScriptLog;
	private args: string;
	private buttons: IButtonInfo[];

	constructor(scriptArgs: IScriptArgs) {
		this.controller = scriptArgs.controller;
		this.log = scriptArgs.log;
		this.args = scriptArgs.args;
	}

	private parseArgs(args: string): boolean {
		try {
			// The argument string should be either an array of IButtonInfo or a single IButtonInfo object on JSON format.
			const json: any = JSON.parse(args);
			let buttons: IButtonInfo[];
			if (json.length > 0) {
				// Assume it's an array of buttons
				buttons = json;
			} else {
				// Assume it's a single buttons object
				buttons = [json];
			}

			// Validate that all mandatory properties are set.
			for (let button of buttons) {
				if (!button.text || !button.option) {
					this.log.Error("Invalid argument string " + args);
					return false;
				}
			}

			this.buttons = buttons;
		} catch (ex) {
			this.log.Error("Failed to parse argument string " + args, ex);
			return false;
		}
		return true;
	}

	private addButton(buttonInfo: IButtonInfo): void {
		const buttonElement = new ButtonElement();
		buttonElement.Value = buttonInfo.text;

		const button = ControlFactory.CreateButton(buttonElement);
		button.click({}, () => {
			this.controller.ListOption(buttonInfo.option);
		});

		button.Position = {
			Width: buttonInfo.width || "100",
			Top: buttonInfo.top || "0",
			Left: buttonInfo.left || "0"
		};

		const contentElement = this.controller.GetContentElement();
		contentElement.Add(button);
	}

	public run(): void {
		// Parse the script argument string and return if the arguments are invalid.
		if (!this.parseArgs(this.args)) {
			return;
		}

		this.log.Info("Running...");

		// Add the option buttons to the panel.
		for (let button of this.buttons) {
			this.addButton(button);
		}
	}

	/**
	 * Script initialization function.
	 */
	public static Init(args: IScriptArgs): void {
		new H5SampleOptionButton(args).run();
	}
}