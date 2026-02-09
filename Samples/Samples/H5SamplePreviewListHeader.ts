/**
* H5 Script SDK sample.
*/

/**
 * Searches for two specific elements that contain the headers and the row content to be displayed in a table. 
 * When this script is loaded in CRS020/F, a table with one row of data is displayed.
 */
class H5SamplePreviewListHeader {
    private controller: IInstanceController;
    private log: IScriptLog;
    private args: string;
    private version: number;

    constructor(scriptArgs: IScriptArgs) {
        this.controller = scriptArgs.controller;
        this.log = scriptArgs.log;
        this.args = scriptArgs.args;
        this.version = ScriptUtil.version;
    }

	/**
	 * Script initialization function.
	 */
    public static Init(args: IScriptArgs): void {
        new H5SamplePreviewListHeader(args).run();
    }

    private run(): void {
        //Check panel
        if (this.controller.GetPanelName() !== "CRA020F0") {
            this.log.Error("Script should run in CRS020/F.");
            return;
        }

        this.buildGrid();
    }

    private buildGrid(): void {
        let options, grid;
        const content = this.controller.GetContentElement();
        const header = this.getHeader();
        const columns = this.getColumns(header);
        const data = this.getData(columns);

        const $list: IList = $("<div>", {
            "class": "inforDataGrid",
            "id": "crs020FGrid",
            "width": "auto",
            "height": "500px"
        });
        $list.Position = new PositionElement();
        $list.Position.Width = "97%";
        $list.Position.Top = this.version >= 2.0 ? "400" : "250";
        $list.Position.Left = "10";

        content.Add($list);

        if (this.version >= 2.0) {
            options = {
                forceFitColumns: true,
                autoHeight: true
            }
            ListControl.RenderDataGrid($list, columns, data, options)
        } else {
            options = Configuration.Current.ListConfig('id', columns, data);
            options["forceFitColumns"] = true;
            options["autoHeight"] = true;
            grid = $("#crs020FGrid").inforDataGrid(options);
            grid.render();
        }
    }

    private getHeader(): string[] {
        let header: string;

        if (this.version >= 2.0) {
            header = ScriptUtil.GetFieldValue('WWSFHL');
        } else {
            const wwsfhl = this.controller.GetElement("WWSFHL");
            header = wwsfhl[0].textContent;
        }
        //Split on capital letters
        return header.split(/(?=[A-Z])/);
    }

    private getColumns(headers: string[]): any[] {
        const columns = [];
        for (let header of headers) {
            let column = {
                id: "C" + (columns.length + 1),
                name: header,
                field: header
            };
            columns.push(column);
        }
        return columns;
    }

    private getData(columns: any[]): any[] {
        const rows = [];
        const value = ScriptUtil.GetFieldValue("WWSFLL", this.controller);
        const data = value.split(" ");
        const row = { id: "R1" };

        for (let i = 0; i < columns.length; i++) {
            row[columns[i]["field"]] = data[i];         
        }
        rows.push(row);

        return rows;
    }
}