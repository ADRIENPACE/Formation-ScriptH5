/**
 * H5 Script SDK sample.
 */
/**
 * Opens up a dialog to Export to Excel or Google Sheets
 */
var H5SampleExportToExcel = (function () {
    function H5SampleExportToExcel(scriptArgs) {
        this.controller = scriptArgs.controller;
        this.args = scriptArgs.args;
    }
    H5SampleExportToExcel.Init = function (args) {
        new H5SampleExportToExcel(args).run();
    };
    H5SampleExportToExcel.prototype.run = function () {
        this.contentElement = this.controller.GetContentElement();
        this.addExcelButton();
        this.addGSheetsButton();
    };
    H5SampleExportToExcel.prototype.addExcelButton = function () {
        var _this = this;
        var buttonElement = new ButtonElement();
        buttonElement.Name = "excelButton";
        buttonElement.Value = "Export to Excel";
        buttonElement.Position = new PositionElement();
        buttonElement.Position.Top = 4;
        buttonElement.Position.Left = 60;
        buttonElement.Position.Width = 15;
        var $button = this.contentElement.AddElement(buttonElement);
        $button.click({}, function () {
            if (ScriptUtil.version >= 2.0) {
                var controller = _this.controller;
                controller.ExportToExcel();
            }
        });
    };
    H5SampleExportToExcel.prototype.addGSheetsButton = function () {
        var _this = this;
        var buttonElement = new ButtonElement();
        buttonElement.Name = "gsheetButton";
        buttonElement.Value = "Export to GSheets";
        buttonElement.Position = new PositionElement();
        buttonElement.Position.Top = 4;
        buttonElement.Position.Left = 75;
        buttonElement.Position.Width = 15;
        var $button = this.contentElement.AddElement(buttonElement);
        $button.click({}, function () {
            if (ScriptUtil.version >= 2.0) {
                var controller = _this.controller;
                controller.ExportToGoogleSheets();
            }
        });
    };
    return H5SampleExportToExcel;
}());
//# sourceMappingURL=H5SampleExportToExcel.js.map