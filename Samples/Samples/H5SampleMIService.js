/**
* MIService utility used here is still in development.
* H5 Script SDK sample.
*/
/**
 * Executes M3 API calls to retrieve user data
 */
var H5SampleMIService = /** @class */ (function () {
    function H5SampleMIService(scriptArgs) {
        this.controller = scriptArgs.controller;
        this.log = scriptArgs.log;
        this.args = scriptArgs.args;
        if (ScriptUtil.version >= 2.0) {
            this.miService = MIService;
        }
        else {
            this.miService = MIService.Current;
        }
    }
    /**
     * Script initialization function.
     */
    H5SampleMIService.Init = function (args) {
        new H5SampleMIService(args).run();
    };
    H5SampleMIService.prototype.run = function () {
        this.usid = ScriptUtil.GetUserContext("USID");
        this.addButton();
    };
    H5SampleMIService.prototype.addButton = function () {
        var _this = this;
        var run = new ButtonElement();
        run.Name = "run";
        run.Value = "Execute MI calls";
        run.Position = new PositionElement();
        run.Position.Top = 2;
        run.Position.Left = 1;
        run.Position.Width = 5;
        var contentElement = this.controller.GetContentElement();
        var $run = contentElement.AddElement(run);
        $run.click({}, function () {
            _this.executeByRequest();
            _this.executeByTransaction();
            _this.executeWithOptionalArgs();
            _this.executeMultiple();
        });
    };
    H5SampleMIService.prototype.executeByRequest = function () {
        var _this = this;
        var myRequest = new MIRequest();
        myRequest.program = "MNS150MI";
        myRequest.transaction = "GetUserData";
        //Fields that should be returned by the transaction
        myRequest.outputFields = ["CONO", "DIVI", "DTFM"];
        //Input to the transaction
        myRequest.record = { USID: this.usid };
        this.miService.executeRequest(myRequest).then(function (response) {
            //Read results here
            for (var _i = 0, _a = response.items; _i < _a.length; _i++) {
                var item = _a[_i];
                _this.log.Info("1: Company: ".concat(item.CONO));
            }
        }).catch(function (response) {
            //Handle errors here
            _this.log.Error(response.errorMessage);
        });
    };
    H5SampleMIService.prototype.executeByTransaction = function () {
        var _this = this;
        var program = "MNS150MI";
        var transaction = "GetUserData";
        var record = { USID: this.usid };
        var outputFields = ["USID", "CONO", "DIVI", "DTFM"];
        this.miService.execute(program, transaction, record, outputFields).then(function (response) {
            //Read results here
            for (var _i = 0, _a = response.items; _i < _a.length; _i++) {
                var item = _a[_i];
                _this.log.Info("2: Division: ".concat(item.DIVI));
            }
        }).catch(function (response) {
            //Handle errors here
            _this.log.Error(response.errorMessage);
        });
    };
    H5SampleMIService.prototype.executeWithOptionalArgs = function () {
        var _this = this;
        var myRequest = new MIRequest();
        myRequest.program = "MNS150MI";
        myRequest.transaction = "GetUserData";
        myRequest.includeMetadata = true;
        //Convert data to number and date as defined in the metadata; default is false
        myRequest.typedOutput = true;
        //Default is 33
        myRequest.maxReturnedRecords = 10;
        //Default is 55000
        myRequest.timeout = 60000;
        this.miService.executeRequest(myRequest).then(function (response) {
            //Since CONO is numeric based on the metadata, this will read "999 is a number"
            //If request.typedOutput = false, everything will be a string and this will read "999  is a string"
            _this.log.Info("3: ".concat(response.item.CONO, " is a ").concat(typeof response.item.CONO));
            //Read metadata
            var metadata = response.metadata;
            for (var field in metadata) {
                var info = metadata[field];
                _this.log.Info("3: ".concat(field, ": ").concat(info.description, " (").concat(MIDataType[info.type], ")"));
            }
        }, function (response) {
            //Alternatively, pass a second function to then instead of using catch
            //Handle errors here
            _this.log.Error(response.errorMessage);
        });
    };
    H5SampleMIService.prototype.executeMultiple = function () {
        var _this = this;
        var myRequest1 = new MIRequest();
        myRequest1.program = "MNS150MI";
        myRequest1.transaction = "GetUserData";
        //Fields that should be returned by the transaction
        myRequest1.outputFields = ["CONO", "DIVI", "DTFM"];
        //Input to the transaction
        myRequest1.record = { USID: this.usid };
        var myRequest2 = new MIRequest();
        myRequest2.program = "MNS150MI";
        myRequest2.transaction = "LstUserData";
        //Fields that should be returned by the transaction
        myRequest2.outputFields = ["USID", "TX40", "USTP"];
        myRequest2.maxReturnedRecords = 5;
        var myPromise1 = this.miService.executeRequest(myRequest1);
        var myPromise2 = this.miService.executeRequest(myRequest2);
        Promise.all([myPromise1, myPromise2]).then(function (response) {
            //Read results here
            var response1 = response[0];
            var response2 = response[1];
            for (var _i = 0, _a = response1["items"]; _i < _a.length; _i++) {
                var item = _a[_i];
                _this.log.Info("4: DTFM: ".concat(item.DTFM));
            }
            for (var _b = 0, _c = response2["items"]; _b < _c.length; _b++) {
                var item = _c[_b];
                _this.log.Info("4: USID: ".concat(item.USID));
            }
        }).catch(function (response) {
            //Handle errors here
            _this.log.Error(response.errorMessage);
        });
    };
    return H5SampleMIService;
}());
//# sourceMappingURL=H5SampleMIService.js.map