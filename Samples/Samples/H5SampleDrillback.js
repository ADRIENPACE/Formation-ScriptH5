/**
* H5 Script SDK sample. In development.
*/
/**
 * Launches CRS610 using a standard Ming.le drillback link
 * Requires a Customer ID from the script arguments
 */
var H5SampleDrillback = (function () {
    function H5SampleDrillback(scriptArgs) {
        this.controller = scriptArgs.controller;
        this.log = scriptArgs.log;
        this.customer = scriptArgs.args;
    }
    /**
     * Script initialization function.
     */
    H5SampleDrillback.Init = function (args) {
        new H5SampleDrillback(args).run();
    };
    H5SampleDrillback.prototype.run = function () {
        if (!this.customer) {
            this.log.Error("Enter a customer ID in the script arguments.");
            return;
        }
        this.content = this.controller.GetContentElement();
        this.addButton();
    };
    H5SampleDrillback.prototype.invokeDrillback = function () {
        var lid = "lid://infor.m3.m3devapp";
        var userContext = ScriptUtil.GetUserContext();
        var acctEntity = userContext.CurrentCompany + "_" + userContext.CurrentDivision;
        var bookmark = "&program=CRS610&panel=E&tableName=OCUSMA&option=5";
        var keys = "&keys=OKCONO,880,OKCUNO," + this.customer;
        var drillback = "?LogicalId=" + lid + "&accountingEntity=" + acctEntity + bookmark + keys;
        //Fire the drillback message using the Infor Ming.le JavaScript API
        infor.companyon.client.sendPrepareDrillbackMessage(drillback);
    };
    H5SampleDrillback.prototype.addButton = function () {
        var _this = this;
        var run = new ButtonElement();
        run.Name = "run";
        run.Value = "Invoke Drillback";
        run.Position = new PositionElement();
        run.Position.Top = 2;
        run.Position.Left = 1;
        run.Position.Width = 5;
        var $run = this.content.AddElement(run);
        $run.click(function () {
            _this.invokeDrillback();
        });
    };
    return H5SampleDrillback;
}());
//# sourceMappingURL=H5SampleDrillback.js.map