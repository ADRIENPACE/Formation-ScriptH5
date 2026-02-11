/**
* H5 Script SDK sample.
*/
/**
 * Searches for two specific elements that contain the headers and the row content to be displayed in a table.
 * When this script is loaded in CRS020/F, a table with one row of data is displayed.
 */
var H5SamplePreviewListHeader = (function () {
    function H5SamplePreviewListHeader(scriptArgs) {
        this.controller = scriptArgs.controller;
        this.log = scriptArgs.log;
        this.args = scriptArgs.args;
        this.version = ScriptUtil.version;
    }
    /**
     * Script initialization function.
     */
    H5SamplePreviewListHeader.Init = function (args) {
        new H5SamplePreviewListHeader(args).run();
    };
    H5SamplePreviewListHeader.prototype.run = function () {
        //Check panel
        if (this.controller.GetPanelName() !== "CRA020F0") {
            this.log.Error("Script should run in CRS020/F.");
            return;
        }
        this.buildGrid();
    };
    H5SamplePreviewListHeader.prototype.buildGrid = function () {
        var options, grid;
        var content = this.controller.GetContentElement();
        var header = this.getHeader();
        var columns = this.getColumns(header);
        var data = this.getData(columns);
        var $list = $("<div>", {
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
            };
            ListControl.RenderDataGrid($list, columns, data, options);
        }
        else {
            options = Configuration.Current.ListConfig('id', columns, data);
            options["forceFitColumns"] = true;
            options["autoHeight"] = true;
            grid = $("#crs020FGrid").inforDataGrid(options);
            grid.render();
        }
    };
    H5SamplePreviewListHeader.prototype.getHeader = function () {
        var header;
        if (this.version >= 2.0) {
            header = ScriptUtil.GetFieldValue('WWSFHL');
        }
        else {
            var wwsfhl = this.controller.GetElement("WWSFHL");
            header = wwsfhl[0].textContent;
        }
        //Split on capital letters
        return header.split(/(?=[A-Z])/);
    };
    H5SamplePreviewListHeader.prototype.getColumns = function (headers) {
        var columns = [];
        for (var _i = 0, headers_1 = headers; _i < headers_1.length; _i++) {
            var header = headers_1[_i];
            var column = {
                id: "C" + (columns.length + 1),
                name: header,
                field: header
            };
            columns.push(column);
        }
        return columns;
    };
    H5SamplePreviewListHeader.prototype.getData = function (columns) {
        var rows = [];
        var value = ScriptUtil.GetFieldValue("WWSFLL", this.controller);
        var data = value.split(" ");
        var row = { id: "R1" };
        for (var i = 0; i < columns.length; i++) {
            row[columns[i]["field"]] = data[i];
        }
        rows.push(row);
        return rows;
    };
    return H5SamplePreviewListHeader;
}());
//# sourceMappingURL=H5SamplePreviewListHeader.js.map