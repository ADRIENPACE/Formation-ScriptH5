/**
* H5 Script SDK sample.
*/
/**
 * Appends a column to the current grid
 */
var H5SampleCustomColumns = /** @class */ (function () {
    function H5SampleCustomColumns(scriptArgs) {
        this.controller = scriptArgs.controller;
    }
    /**
     * Script initialization function.
     */
    H5SampleCustomColumns.Init = function (args) {
        new H5SampleCustomColumns(args).run();
    };
    H5SampleCustomColumns.prototype.run = function () {
        var list = this.controller.GetGrid();
        var customColumnNum = list.getColumns().length + 1;
        this.appendColumn(list, customColumnNum);
        this.populateData(list, customColumnNum);
        this.attachEvents(this.controller, list, customColumnNum);
    };
    H5SampleCustomColumns.prototype.appendColumn = function (list, columnNum) {
        var columnId = "C" + columnNum;
        var columns = list.getColumns();
        var newColumn = {
            id: columnId,
            field: columnId,
            name: "Custom Column " + columnNum,
            width: 100
        };
        if (columns.find((column) => column.id === newColumn.id)) {
            return; //Do not append column;
        }
        if (columns.length < columnNum) {
            columns.push(newColumn);
        }
        list.setColumns(columns);
    };
    H5SampleCustomColumns.prototype.populateData = function (list, columnNum) {
        var columnId = "C" + columnNum;
        if (ScriptUtil.version >= 2.0) {
            var dataset = list.getData();
            for (var i = 0; i < dataset.length; i++) {
                var data = dataset[i];
                data[columnId] = "Dummy Data" + i;
            }
            list.setData(dataset);
        }
        else {
            for (var i = 0; i < list.getData().getLength(); i++) {
                var newData = {};
                newData[columnId] = "Dummy Data" + i;
                newData["id_" + columnId] = "R" + (i + 1) + columnId;
                $.extend(list.getData().getItem(i), newData);
            }
            var columns = list.getColumns();
            list.setColumns(columns);
        }
    };
    H5SampleCustomColumns.prototype.attachEvents = function (controller, list, columnNum) {
        var _this = this;
        this.unsubscribeReqCompleted = controller.RequestCompleted.On(function (e) {
            //Populate additional data on scroll
            if (e.commandType === "PAGE" && e.commandValue === "DOWN") {
                _this.populateData(list, columnNum);
            } else if (e.commandType === "SEARCH") {
                var customColumnNum = list.getColumns().length + 1;
                const timeout = setTimeout(() => {
                _this.appendColumn(list, customColumnNum);
                _this.populateData(list, columnNum);
                clearTimeout(timeout);
                }, 300);
            }
            else {
                _this.detachEvents();
            }
        });
    };
    H5SampleCustomColumns.prototype.detachEvents = function () {
        this.unsubscribeReqCompleted();
    };
    return H5SampleCustomColumns;
}());
//# sourceMappingURL=H5SampleCustomColumns.js.map