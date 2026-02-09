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
class H5SampleCurrencyXML {
    private controller: IInstanceController;
    private log: IScriptLog;
    private args: string;

    private parsedDataKey = "ParsedCurrencyData";

    constructor(scriptArgs: IScriptArgs) {
        this.controller = scriptArgs.controller;
        this.log = scriptArgs.log;
        this.args = scriptArgs.args;
    }

	/**
	 * Script initialization function.
	 */
    public static Init(args: IScriptArgs): void {
        new H5SampleCurrencyXML(args).run();
    }

    private run(): void {
        // Look for the Currency field in CRS055
        const currency = ScriptUtil.GetFieldValue("WWCUCD");

        if (currency) {
            this.getCurrencyData().then(data => {
                const currRate = data.getRate(currency);

                if (currRate && currRate != 0) {
                    const convertedData = this.convertToLocalRate(data, currRate);
                    this.showCurrencyGrid(convertedData);
                }
            },
            response => {
                this.log.Error(response);
            });
        }
    }

    private getCurrencyData(): Promise<CurrencyData> {
        let currencyData: CurrencyData;
        return new Promise((resolve, reject) => {
            //Check for data in session cache
            if (SessionCache.ContainsKey(this.parsedDataKey)) {
                resolve(SessionCache.Get(this.parsedDataKey));
                return;
            }

            //Fetch XML data if not cached
            let settings: JQueryAjaxSettings = {
                url: "https://www.ecb.int/stats/eurofxref/eurofxref-daily.xml",
                cache: false,
                timeout: 55000
            };
            settings["method"] = "GET";
            $.ajax(settings).then((httpResponse: any, textStatus: string, jqXHR: JQueryXHR) => {
                currencyData = new CurrencyData();
                $(httpResponse).find("Cube").each(function () {
                    let curr = $(this).attr("currency");
                    if (curr) {
                        currencyData.add(curr, +($(this).attr("rate")));
                    }
                });

                //Cache parsed data
                SessionCache.Add(this.parsedDataKey, currencyData);

                resolve(currencyData);
            }, (jqXHR: JQueryXHR, textStatus: string, errorThrown: any) => {
                reject(textStatus);
            });
        });
    }

    private convertToLocalRate(data: CurrencyData, currRate: number): CurrencyData {
        const convertedData = new CurrencyData();

        for (let key of data.getKeys()) {
            convertedData.add(key, data.getRate(key) / currRate);
        }

        return convertedData;
    }

    private showCurrencyGrid(data: CurrencyData): void {
        const columns = [
            { id: "C1", name: "Currency", field: "Currency" },
            { id: "C1", name: "Rate", field: "Rate" }
        ];
        const rows = [];

        for (let key of data.getKeys()) {
            let row = {
                id: "R" + (rows.length + 1),
                Currency: key,
                Rate: data.getRate(key).toFixed(4)
            };

            rows.push(row);
        }

        const $list: IList = $("<div>", {
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
            const options = {
                forceFitColumns: true
            };
            ListControl.RenderDataGrid($list, columns, rows, options);
        } else {
            //Get default list settings and use it for this grid
            const options = Configuration.Current.ListConfig("id", columns, rows);
            options["forceFitColumns"] = true;
    
            const grid = $list.inforDataGrid(options);
            grid.render();
        }
    }
}

/* We use this custom class because Map is not supported in ES5 */
class CurrencyData {
    private data: { [key: string]: number; };

    constructor() {
        this.data = {};
    }

    public add(key: string, rate: number): void {
        this.data[key] = rate;
    }

    public remove(key: string): void {
        this.data[key] = undefined;
    }

    public clear(): void {
        this.data = {};
    }

    public getRate(key: string): number {
        return this.data[key];
    }

    public getKeys(): string[] {
        return Object.keys(this.data);
    }
}