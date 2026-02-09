/**
 * H5 Script SDK sample.
 */
/**
 * Opens up a dialog to Export to Excel or Google Sheets
 */
class H5SampleExportToExcel {
    private controller: IInstanceController;
    private args: string;

    private contentElement: IContentElement;

    constructor(scriptArgs: IScriptArgs) {
        this.controller = scriptArgs.controller;
        this.args = scriptArgs.args;
    }

    public static Init(args: IScriptArgs): void {
        new H5SampleExportToExcel(args).run();
    }

    private run(): void {
        this.contentElement = this.controller.GetContentElement();
        this.addExcelButton();
        this.addGSheetsButton();
    }
    
    private addExcelButton(): void {
        const buttonElement = new ButtonElement();
        buttonElement.Name = "excelButton";
        buttonElement.Value = "Export to Excel";
        buttonElement.Position = new PositionElement();
        buttonElement.Position.Top = 4;
        buttonElement.Position.Left = 60;
        buttonElement.Position.Width = 15;

        const $button = this.contentElement.AddElement(buttonElement);
        $button.click({}, () => {
            if (ScriptUtil.version >= 2.0) {
                const controller = this.controller;
                controller.ExportToExcel();
            }
        });
    }

    private addGSheetsButton(): void {
        const buttonElement = new ButtonElement();
        buttonElement.Name = "gsheetButton";
        buttonElement.Value = "Export to GSheets";
        buttonElement.Position = new PositionElement();
        buttonElement.Position.Top = 4;
        buttonElement.Position.Left = 75;
        buttonElement.Position.Width = 15;

        const $button = this.contentElement.AddElement(buttonElement);
        $button.click({}, () => {
            if (ScriptUtil.version >= 2.0) {
                const controller = this.controller;
                controller.ExportToGoogleSheets();
            }
        });
    }
}
