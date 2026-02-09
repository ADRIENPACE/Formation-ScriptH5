/**
* H5 Script SDK sample.
*/
/**
 * Executes requests to IFS and M3 ION APIs.
 * For MUA 10.4 only.
 *
 * No setup needed if script will be uploaded thru Admin Tools
 * During development, to run this script in any instance where an authorization server is not available,
 * you will need to set the OAuth token manually:
 *  - Acquire an OAuth token string.
 *      + Log on to Ming.le/Portal.
 *      + Open a new tab in the same browser and navigate to the Grid SAML Session Provider OAuth resource.
 *      + The Grid must be version 2.0 or later with a SAML Session Provider configured for the same IFS as Ming.le.
            Example: https://yourservernameandport/grid/rest/security/sessions/oauth
 *  - Copy the token to the script arguments.
 *  - When the token times out, you must acquire a new token and update the script arguments.
 *  - Update - 10/14/2024 - Mingle endpoints have been depricated for user ion detail apis - updated to use IFS with the same functionalities
 */
var H5SampleIonApiService = /** @class */ (function () {
    function H5SampleIonApiService(args) {
        this.mingleEndpoint = "Mingle";
        this.ifsEndpoint = "ifsservice";
        this.m3Endpoint = "M3/m3api-rest/execute";
        this.m3EndpointV2 = "M3/m3api-rest/v2/execute";
        this.controller = args.controller;
        this.log = args.log;
        this.args = args.args;
        this.version = ScriptUtil.version;
        if (this.version >= 2.0) {
            this.ionApiService = IonApiService;
            this.miService = MIService;
        }
        else {
            this.ionApiService = IonApiService.Current;
            this.miService = MIService.Current;
        }
    }
    /**
    * Script initialization function.
    */
    H5SampleIonApiService.Init = function (args) {
        new H5SampleIonApiService(args).run();
    };
    H5SampleIonApiService.prototype.run = function () {
        this.addMingleButton();
        this.addPostMingleButton();
        this.addPutMingleButton();
        this.addDeleteMingleButton();
        this.addM3Button();
        /* For development purposes only
        Make sure to add a valid access token as the script argument.
        See comments above or the development guide for details.
        */
        // this.ionApiService.setToken(this.args);
    };
    H5SampleIonApiService.prototype.addMingleButton = function () {
        var _this = this;
        var run = new ButtonElement();
        run.Name = "runguid";
        run.Value = "Get user GUID";
        run.Position = new PositionElement();
        run.Position.Top = 5;
        run.Position.Left = 8;
        run.Position.Width = 5;
        if (this.version >= 2.0) {
            run.Position.Left = 9;
        }
        var contentElement = this.controller.GetContentElement();
        var $run = contentElement.AddElement(run);
        $run.click(function () {
            var request = {
                url: "".concat(_this.ionApiService.getBaseUrl(), "/").concat(_this.ifsEndpoint, "/usermgt/v2/users/me"),
                method: "GET"
            };
            _this.ionApiService.execute(request).then(function (response) {
                var data = response.data;
                if (!data.ErrorList) {
                    _this.controller.ShowMessage(data.response.userlist[0].id);
                }
                else {
                    for (var _i = 0, _a = data.ErrorList; _i < _a.length; _i++) {
                        var error = _a[_i];
                        _this.log.Error(error.Message);
                    }
                }
            }).catch(function (response) {
                _this.log.Error(response.message);
            });
        });
    };
    H5SampleIonApiService.prototype.addPostMingleButton = function () {
        var _this = this;
        var run = new ButtonElement();
        run.Name = "emailVerify";
        run.Value = "Post Email Verify";
        run.Position = new PositionElement();
        run.Position.Top = 5;
        run.Position.Left = 17;
        run.Position.Width = 5;
        if (this.version >= 2.0) {
            run.Position.Left = 18;
        }
        var contentElement = this.controller.GetContentElement();
        var $run = contentElement.AddElement(run);
        $run.click(function () {
            var message = "Hello, check email only if received. No need to click anything from email verification, if email received, working post.";
            var request = {
                url: "".concat(_this.ionApiService.getBaseUrl(), "/").concat(_this.ifsEndpoint, "/usermgt/v2/users/me/verify/email"),
                method: "POST",
                responseType: "json",
                data: { MessageText: message },
            };
            _this.ionApiService.execute(request).then(function (response) {
                console.log("myscript: success callback");
                console.log(response);
                var errorList = response.data.ErrorList;
                errorList.forEach(function (error) {
                    console.log("ERROR");
                    console.log(error.Message);
                });
            }).catch(function (response) {
                _this.log.Error(response.message);
            });
        });
    };
    H5SampleIonApiService.prototype.addPutMingleButton = function () {
        var _this = this;
        var run = new ButtonElement();
        run.Name = "runguid";
        run.Value = "Put user GUID";
        run.Position = new PositionElement();
        run.Position.Top = 5;
        run.Position.Left = 26;
        run.Position.Width = 5;
        if (this.version >= 2.0) {
            run.Position.Left = 27;
        }
        var contentElement = this.controller.GetContentElement();
        var $run = contentElement.AddElement(run);
        $run.click(function () {
            var request = {
                url: "".concat(_this.ionApiService.getBaseUrl(), "/").concat(_this.ifsEndpoint, "/usermgt/v2/users/me"),
                method: "PUT"
            };
            _this.ionApiService.execute(request).then(function (response) {
                var data = response.data;
                if (!data.ErrorList) {
                    _this.controller.ShowMessage(data["UserDetailList"][0].UserGUID);
                }
                else {
                    for (var _i = 0, _a = data.ErrorList; _i < _a.length; _i++) {
                        var error = _a[_i];
                        _this.log.Error(error.Message);
                    }
                }
            }).catch(function (response) {
                _this.log.Error(response.message);
            });
        });
    };
    H5SampleIonApiService.prototype.addDeleteMingleButton = function () {
        var _this = this;
        var run = new ButtonElement();
        run.Name = "runguid";
        run.Value = "Delete user GUID";
        run.Position = new PositionElement();
        run.Position.Top = 5;
        run.Position.Left = 35;
        run.Position.Width = 5;
        if (this.version >= 2.0) {
            run.Position.Left = 36;
        }
        var contentElement = this.controller.GetContentElement();
        var $run = contentElement.AddElement(run);
        $run.click(function () {
            var request = {
                url: "".concat(_this.ionApiService.getBaseUrl(), "/").concat(_this.ifsEndpoint, "/usermgt/v2/users/me"),
                method: "DELETE"
            };
            _this.ionApiService.execute(request).then(function (response) {
                var data = response.data;
                if (!data.ErrorList) {
                    _this.controller.ShowMessage(data["UserDetailList"][0].UserGUID);
                }
                else {
                    for (var _i = 0, _a = data.ErrorList; _i < _a.length; _i++) {
                        var error = _a[_i];
                        _this.log.Error(error.Message);
                    }
                }
            }).catch(function (response) {
                _this.log.Error(response.message);
            });
        });
    };
    H5SampleIonApiService.prototype.addM3Button = function () {
        var _this = this;
        var run = new ButtonElement();
        run.Name = "runemail";
        run.Value = "Get M3 user email";
        run.Position = new PositionElement();
        run.Position.Top = 5;
        run.Position.Left = 45;
        run.Position.Width = 5;
        var contentElement = this.controller.GetContentElement();
        var $run = contentElement.AddElement(run);
        $run.click(function () {
            var request = {
                url: "/".concat(_this.m3Endpoint, "/MNS150MI/GetUserData/"),
                method: "GET",
                record: {
                    USID: ScriptUtil.GetUserContext("USID")
                }
            };
            _this.ionApiService.execute(request).then(function (response) {
                var responseData = response.data.MIRecord[0];
                var firstRecord = responseData.NameValue.find(function (nv) { return nv.Name === "EMAL"; });
                if (firstRecord === null || firstRecord === void 0 ? void 0 : firstRecord.Value) {
                    _this.controller.ShowMessage(firstRecord.Value);
                }
            }).catch(function (response) {
                _this.log.Error(response.message);
            });
        });
    };
    return H5SampleIonApiService;
}());
//# sourceMappingURL=H5SampleIonApiService.js.map