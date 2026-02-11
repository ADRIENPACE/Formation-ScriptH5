/**
 * H5 Script SDK sample.
 */
/**
 * Shows a message dialog with the index of the selected list row and the content of the first cell on the selected row.
 */
var H5SampleSelectionChanged = (function () {
    function H5SampleSelectionChanged(args) {
        this.scriptName = "H5SampleSelectionChanged";
        this.controller = args.controller;
        this.log = args.log;
    }
    /**
     * Script initialization function.
     */
    H5SampleSelectionChanged.Init = function (args) {
        new H5SampleSelectionChanged(args).run();
    };
    H5SampleSelectionChanged.prototype.run = function () {
        var _this = this;
        var controller = this.controller;
        var grid = controller.GetGrid();
        if (!grid) {
            return;
        }
        this.grid = grid;
        // Subscribe to the onSelectedRowsChanged event and store the handler for unsubscribe when the user navigates away from the current panel.
        var handler = function (e, args) {
            if (ScriptUtil.version >= 2.0) {
                _this.onSelectionChangedV2(e);
            }
            else {
                _this.onSelectionChanged(e, args);
            }
        };
        grid.onSelectedRowsChanged.subscribe(handler);
        this.selectionHandler = handler;
        this.unregisterRequested = controller.Requested.On(function (e) {
            _this.onRequested(e);
        });
    };
    H5SampleSelectionChanged.prototype.onRequested = function (args) {
        var grid = this.grid;
        var isPageDownCommand = args.commandType === "PAGE" && args.commandValue === "DOWN";
        if (isPageDownCommand) {
            return;
        }
        // Unregister all events
        this.unregisterRequested();
        if (grid) {
            grid.onSelectedRowsChanged.unsubscribe(this.selectionHandler);
        }
    };
    H5SampleSelectionChanged.prototype.onSelectionChanged = function (e, args) {
        var grid = args.grid;
        var selected = grid.getSelectedRows();
        if (selected.length < 1) {
            // No row was selected
            return;
        }
        // Get the index of the first selected row
        var rowIndex = selected[0];
        // Get the row data object
        var row = grid.getDataItem(rowIndex);
        // Get the value of the first cell in the selected row
        var firstCell = row["C1"];
        // Log a message and show a dialog with the same message
        this.showMessage(rowIndex, firstCell);
    };
    H5SampleSelectionChanged.prototype.onSelectionChangedV2 = function (e) {
        var selected = e.rows;
        if (selected.length < 1) {
            // No row was selected
            return;
        }
        var columns = this.controller.GetGrid().getColumns();
        // Get the index of the first selected row
        var rowIndex = selected[0].idx;
        // Get the row data object
        var row = selected[0].data;
        // Get the value of the first cell in the selected row
        var firstCell = row[columns[0].fullName];
        // Log a message and show a dialog with the same message
        this.showMessage(rowIndex, firstCell);
    };
    H5SampleSelectionChanged.prototype.showMessage = function (rowIndex, value) {
        var message = "List row selection changed. Row index: " + rowIndex + " First cell value: " + value;
        this.log.Info(message);
        ConfirmDialog.Show({
            header: this.scriptName,
            message: message,
            dialogType: "Information"
        });
    };
    return H5SampleSelectionChanged;
}());
//# sourceMappingURL=H5SampleSelectionChanged.js.map