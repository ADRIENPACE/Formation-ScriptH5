/**
* H5 Script SDK sample.
*/
/**
 * Hides column with column names MMITNO and MMITDS
 * Run in MMS001
 */
var H5SampleHideColumns = (function () {
    function H5SampleHideColumns(scriptArgs) {
        this.controller = scriptArgs.controller;
    }
    H5SampleHideColumns.Init = function (args) {
        new H5SampleHideColumns(args).run();
    };
    H5SampleHideColumns.prototype.run = function () {
        if (ScriptUtil.version >= 2.0) {
            var activeGrid = ListControl.ListView.GetDatagrid(this.controller);
            var contentElement = this.controller.GetContentElement();
            activeGrid.hideColumns(['MMITNO', 'MMITDS']);
        }
    };
    return H5SampleHideColumns;
}());
//# sourceMappingURL=H5SampleHideColumns.js.map