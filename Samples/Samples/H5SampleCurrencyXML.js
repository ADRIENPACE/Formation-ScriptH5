/**
* H5 Script SDK sample.
*/
/**
 * The script is built for the E-panel in CRS055.
 * It loads the currency rates from the Central European bank and displays them in a list on the E-panel.
 * The rates are converted to use the currency on the E-panel as base.
 * The list will only be displayed if the currency on the E-panel exists in the XML returned from the server.
 * Since currency data is retrieved from a different domain, this will only work in development mode when CORS policy is disabled for browser.
 */
var H5SampleCurrencyXML = (function () {
    function H5SampleCurrencyXML(scriptArgs) {
        this.parsedDataKey = "ParsedCurrencyData";
        this.controller = scriptArgs.controller;
        this.log = scriptArgs.log;
        this.args = scriptArgs.args;
    }
    /**
     * Script initialization function.
     */
    H5SampleCurrencyXML.Init = function (args) {
        new H5SampleCurrencyXML(args).run();
    };
    H5SampleCurrencyXML.prototype.run = function () {
        var _this = this;
        // Look for the Currency field in CRS055
        var currency = ScriptUtil.GetFieldValue("WWCUCD");
        if (currency) {
            this.getCurrencyData().then(function (data) {
                var currRate = data.getRate(currency);
                if (currRate && currRate != 0) {
                    var convertedData = _this.convertToLocalRate(data, currRate);
                    _this.showCurrencyGrid(convertedData);
                }
            }, function (response) {
                _this.log.Error(response);
            });
        }
    };
    H5SampleCurrencyXML.prototype.getCurrencyData = function () {
        var _this = this;
        var currencyData;
        return new Promise(function (resolve, reject) {
            //Check for data in session cache
            if (SessionCache.ContainsKey(_this.parsedDataKey)) {
                resolve(SessionCache.Get(_this.parsedDataKey));
                return;
            }
            //Fetch XML data if not cached
            var settings = {
                url: "https://www.ecb.int/stats/eurofxref/eurofxref-daily.xml",
                cache: false,
                timeout: 55000
            };
            settings["method"] = "GET";
            $.ajax(settings).then(function (httpResponse, textStatus, jqXHR) {
                currencyData = new CurrencyData();
                $(httpResponse).find("Cube").each(function () {
                    var curr = $(this).attr("currency");
                    if (curr) {
                        currencyData.add(curr, +($(this).attr("rate")));
                    }
                });
                //Cache parsed data
                SessionCache.Add(_this.parsedDataKey, currencyData);
                resolve(currencyData);
            }, function (jqXHR, textStatus, errorThrown) {
                reject(textStatus);
            });
        });
    };
    H5SampleCurrencyXML.prototype.convertToLocalRate = function (data, currRate) {
        var convertedData = new CurrencyData();
        for (var _i = 0, _a = data.getKeys(); _i < _a.length; _i++) {
            var key = _a[_i];
            convertedData.add(key, data.getRate(key) / currRate);
        }
        return convertedData;
    };
    H5SampleCurrencyXML.prototype.showCurrencyGrid = function (data) {
        var columns = [
            { id: "C1", name: "Currency", field: "Currency" },
            { id: "C1", name: "Rate", field: "Rate" }
        ];
        var rows = [];
        for (var _i = 0, _a = data.getKeys(); _i < _a.length; _i++) {
            var key = _a[_i];
            var row = {
                id: "R" + (rows.length + 1),
                Currency: key,
                Rate: data.getRate(key).toFixed(4)
            };
            rows.push(row);
        }
        var $list = $("<div>", {
            "class": "inforDataGrid",
            "id": "crs055EGrid",
            "width": "auto",
            "height": "180px"
        });
        $list.Position = new PositionElement();
        $list.Position.Width = "30%";
        $list.Position.Top = "300";
        $list.Position.Left = "35";
        this.controller.GetContentElement().Add($list);
        if (ScriptUtil.version >= 2.0) {
            var options = {
                forceFitColumns: true
            };
            ListControl.RenderDataGrid($list, columns, rows, options);
        }
        else {
            //Get default list settings and use it for this grid
            var options = Configuration.Current.ListConfig("id", columns, rows);
            options["forceFitColumns"] = true;
            var grid = $list.inforDataGrid(options);
            grid.render();
        }
    };
    return H5SampleCurrencyXML;
}());
/* We use this custom class because Map is not supported in ES5 */
var CurrencyData = (function () {
    function CurrencyData() {
        this.data = {};
    }
    CurrencyData.prototype.add = function (key, rate) {
        this.data[key] = rate;
    };
    CurrencyData.prototype.remove = function (key) {
        this.data[key] = undefined;
    };
    CurrencyData.prototype.clear = function () {
        this.data = {};
    };
    CurrencyData.prototype.getRate = function (key) {
        return this.data[key];
    };
    CurrencyData.prototype.getKeys = function () {
        return Object.keys(this.data);
    };
    return CurrencyData;
}());
//# sourceMappingURL=H5SampleCurrencyXML.js.map