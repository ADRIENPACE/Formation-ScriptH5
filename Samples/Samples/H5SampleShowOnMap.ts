/**
* H5 Script SDK sample.
*/

/**
 * Adds a custom button element in the panel that opens a location in Google Maps 
 * depending on the latitude, longitude, and zoom values specified in the text fields.
 * This can be used in OIS002/F.
 */
class H5SampleShowOnMap {
    private controller: IInstanceController;
    private log: IScriptLog;
    private $host: JQuery;

    constructor(scriptArgs: IScriptArgs) {
        this.controller = scriptArgs.controller;
        this.log = scriptArgs.log;
    }

    /**
	 * Script initialization function.
	 */
    public static Init(args: IScriptArgs): void {
        new H5SampleShowOnMap(args).run();
    }

    private run(): void {
        this.$host = this.controller.ParentWindow;
        this.addButton();
    }

    private addButton(): void {
        const buttonElement = new ButtonElement();
        buttonElement.Name = "showMap";
        buttonElement.Value = "Show Map";
        buttonElement.Position = new PositionElement();
        buttonElement.Position.Top = 0;
        const contentElement = this.controller.GetContentElement();
        let button = null;

        if (ScriptUtil.version >= 2.0) {
            buttonElement.Position.Top = 21;
            buttonElement.Position.Left = 27;

            button = contentElement.AddElement(buttonElement);
        } else {        
            button = contentElement.CreateElement(buttonElement);
            const geoX = ScriptUtil.FindChild(this.$host, "WFGEOX");

            button.attr("style", "margin-left: 5px");
            geoX.after(button);
        }

        button.click(() => {
            this.showMap();
        });
    }

    private showMap(): void {
        const lat = ScriptUtil.GetFieldValue("WFGEOX", this.controller);
        const lng = ScriptUtil.GetFieldValue("WFGEOY", this.controller);
        const zoom = ScriptUtil.GetFieldValue("WFGEOZ", this.controller);

        if (!(lat && lng)) {
            this.log.Info("Coordinates required.");
            return;
        }

        let x = lat.replace(",", ".");
        let y = lng.replace(",", ".");
        let z = zoom ? zoom : 15;

        if (x.indexOf("-") > -1) {
            x = x.replace("-", "");
            x = "-" + x;
        }

        if (y.indexOf("-") > -1) {
            y = y.replace("-", "");
            y = "-" + y;
        }

        const url = "https://maps.google.com/maps?z=" + z + "&t=m&q=loc:" + x + "+" + y + "&output=embed";

        ScriptUtil.Launch(url);
    }
}