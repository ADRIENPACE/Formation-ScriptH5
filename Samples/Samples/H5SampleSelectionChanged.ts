/**
 * H5 Script SDK sample.
 */

/**
 * Shows a message dialog with the index of the selected list row and the content of the first cell on the selected row.
 */
class H5SampleSelectionChanged {

	private scriptName = "H5SampleSelectionChanged";
	private controller: IInstanceController;
	private log: IScriptLog;
	private unregisterRequested: Function;
	private grid: any;
	private selectionHandler: Function;

	constructor(args: IScriptArgs) {
		this.controller = args.controller;
		this.log = args.log;
	}

	/**
	 * Script initialization function.
	 */
	public static Init(args: IScriptArgs): void {
		new H5SampleSelectionChanged(args).run();
	}

	private run(): void {
		const controller = this.controller;
		const grid = controller.GetGrid();
		if (!grid) {
			return;
		}

		this.grid = grid;

		// Subscribe to the onSelectedRowsChanged event and store the handler for unsubscribe when the user navigates away from the current panel.
		const handler = (e, args) => {
			if (ScriptUtil.version >= 2.0) {
				this.onSelectionChangedV2(e);
			} else {
				this.onSelectionChanged(e, args);
			}
		};

		grid.onSelectedRowsChanged.subscribe(handler);
		this.selectionHandler = handler;

		this.unregisterRequested = controller.Requested.On((e) => {
			this.onRequested(e);
		});
	}

	private onRequested(args: RequestEventArgs): void {
		const grid = this.grid;
		const isPageDownCommand = args.commandType === "PAGE" && args.commandValue === "DOWN";

		if (isPageDownCommand) {
			return;
		}

		// Unregister all events
		this.unregisterRequested();

		if (grid) {
			grid.onSelectedRowsChanged.unsubscribe(this.selectionHandler);
		}
	}

	private onSelectionChanged(e: any, args: any): void {
		const grid = args.grid;
		const selected = grid.getSelectedRows();

		if (selected.length < 1) {
			// No row was selected
			return;
		}

		// Get the index of the first selected row
		const rowIndex = selected[0];

		// Get the row data object
		const row = grid.getDataItem(rowIndex);

		// Get the value of the first cell in the selected row
		const firstCell = row["C1"];

		// Log a message and show a dialog with the same message
		this.showMessage(rowIndex, firstCell);
	}

	private onSelectionChangedV2(e) {
		const selected = e.rows;

		if (selected.length < 1) {
			// No row was selected
			return;
		}
		const columns = this.controller.GetGrid().getColumns();

		// Get the index of the first selected row
		const rowIndex = selected[0].idx;

		// Get the row data object
		const row = selected[0].data;

		// Get the value of the first cell in the selected row
		const firstCell = row[columns[0].fullName];

		// Log a message and show a dialog with the same message
		this.showMessage(rowIndex, firstCell);
	}

	private showMessage(rowIndex, value) {
		const message = "List row selection changed. Row index: " + rowIndex + " First cell value: " + value;
		this.log.Info(message);
		ConfirmDialog.Show({
			header: this.scriptName,
			message: message,
			dialogType: "Information"
		});
	}
}