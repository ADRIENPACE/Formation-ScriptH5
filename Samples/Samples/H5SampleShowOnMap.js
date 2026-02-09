/**
* H5 Script SDK sample.
*/
/**
 * Adds a custom button element in the panel that opens a location in Google Maps
 * depending on the latitude, longitude, and zoom values specified in the text fields.
 * This can be used in OIS002/F.
 */
var H5SampleShowOnMap = /** @class */ (function () {
    function H5SampleShowOnMap(scriptArgs) {
        this.controller = scriptArgs.controller;
        this.log = scriptArgs.log;
    }
    /**
     * Script initialization function.
     */
    H5SampleShowOnMap.Init = function (args) {
        new H5SampleShowOnMap(args).run();
    };
    H5SampleShowOnMap.prototype.run = function () {
        this.$host = this.controller.ParentWindow;
        this.addButton();
    };
    H5SampleShowOnMap.prototype.addButton = function () {
        var _this = this;
        var buttonElement = new ButtonElement();
        buttonElement.Name = "showMap";
        buttonElement.Value = "Show Map";
        buttonElement.Position = new PositionElement();
        buttonElement.Position.Top = 0;
        var contentElement = this.controller.GetContentElement();
        var button = null;
        if (ScriptUtil.version >= 2.0) {
            buttonElement.Position.Top = 21;
            buttonElement.Position.Left = 27;
            button = contentElement.AddElement(buttonElement);
        }
        else {
            button = contentElement.CreateElement(buttonElement);
            var geoX = ScriptUtil.FindChild(this.$host, "WFGEOX");
            button.attr("style", "margin-left: 5px");
            geoX.after(button);
        }
        button.click(function () {
            _this.showMap();
        });
    };
    H5SampleShowOnMap.prototype.showMap = function () {
        var lat = ScriptUtil.GetFieldValue("WFGEOX", this.controller);
        var lng = ScriptUtil.GetFieldValue("WFGEOY", this.controller);
        var zoom = ScriptUtil.GetFieldValue("WFGEOZ", this.controller);
        if (!(lat && lng)) {
            this.log.Info("Coordinates required.");
            return;
        }
        var x = lat.replace(",", ".");
        var y = lng.replace(",", ".");
        var z = zoom ? zoom : 15;
        if (x.indexOf("-") > -1) {
            x = x.replace("-", "");
            x = "-" + x;
        }
        if (y.indexOf("-") > -1) {
            y = y.replace("-", "");
            y = "-" + y;
        }
        var url = "https://maps.google.com/maps?z=" + z + "&t=m&q=loc:" + x + "+" + y + "&output=embed";
        ScriptUtil.Launch(url);
    };
    return H5SampleShowOnMap;
}());
//# sourceMappingURL=H5SampleShowOnMap.js.map