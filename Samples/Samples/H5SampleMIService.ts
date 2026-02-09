 /**
 * MIService utility used here is still in development.
 * H5 Script SDK sample.
 */

/**
 * Executes M3 API calls to retrieve user data
 */
class H5SampleMIService {
    private controller: IInstanceController;
    private log: IScriptLog;
    private args: string;

    private usid: string;
    private miService;

    constructor(scriptArgs: IScriptArgs) {
        this.controller = scriptArgs.controller;
        this.log = scriptArgs.log;
        this.args = scriptArgs.args;

        if (ScriptUtil.version >= 2.0) {
            this.miService = MIService;
        } else {
            this.miService = MIService.Current
        }
    }

	/**
	 * Script initialization function.
	 */
    public static Init(args: IScriptArgs): void {
        new H5SampleMIService(args).run();
    }

    private run(): void {
        this.usid = ScriptUtil.GetUserContext("USID");
        this.addButton();        
    }

    private addButton(): void {
        const run = new ButtonElement();
        run.Name = "run";
        run.Value = "Execute MI calls";
        run.Position = new PositionElement();
        run.Position.Top = 2;
        run.Position.Left = 1;
        run.Position.Width = 5;

        const contentElement = this.controller.GetContentElement();
        const $run = contentElement.AddElement(run);
        $run.click({}, () => {
            this.executeByRequest();
            this.executeByTransaction();
            this.executeWithOptionalArgs();
            this.executeMultiple();
        });
    }

    private executeByRequest(): void {
        const myRequest = new MIRequest();
        myRequest.program = "MNS150MI";
        myRequest.transaction = "GetUserData";
        //Fields that should be returned by the transaction
        myRequest.outputFields = ["CONO", "DIVI", "DTFM"];
        //Input to the transaction
        myRequest.record = { USID: this.usid };

        this.miService.executeRequest(myRequest).then(
            (response: IMIResponse) => {
                //Read results here
                for (let item of response.items) {
                    this.log.Info(`1: Company: ${item.CONO}`);
                }
            }).catch((response: IMIResponse) => {
                //Handle errors here
                this.log.Error(response.errorMessage);
            });
    }

    private executeByTransaction(): void {
        const program = "MNS150MI";
        const transaction = "GetUserData";
        const record = { USID: this.usid };
        const outputFields = ["USID", "CONO", "DIVI", "DTFM"];

        this.miService.execute(program, transaction, record, outputFields).then(
            (response: IMIResponse) => {
                //Read results here
                for (let item of response.items) {
                    this.log.Info(`2: Division: ${item.DIVI}`);
                }
            }).catch((response: IMIResponse) => {
                //Handle errors here
                this.log.Error(response.errorMessage);
            });
    }

    private executeWithOptionalArgs(): void {
        const myRequest = new MIRequest();
        myRequest.program = "MNS150MI";
        myRequest.transaction = "GetUserData";
        myRequest.includeMetadata = true;
        //Convert data to number and date as defined in the metadata; default is false
        myRequest.typedOutput = true;
        //Default is 33
        myRequest.maxReturnedRecords = 10;
        //Default is 55000
        myRequest.timeout = 60000;

        this.miService.executeRequest(myRequest).then(
            (response: IMIResponse) => {
                //Since CONO is numeric based on the metadata, this will read "999 is a number"
                //If request.typedOutput = false, everything will be a string and this will read "999  is a string"
                this.log.Info(`3: ${response.item.CONO} is a ${typeof response.item.CONO}`);
                //Read metadata
                const metadata = response.metadata;
                for (let field in metadata) {
                    let info: IMIMetadataInfo = metadata[field];
                    this.log.Info(`3: ${field}: ${info.description} (${MIDataType[info.type]})`);
                }
            }, (response: IMIResponse) => { 
                //Alternatively, pass a second function to then instead of using catch
                //Handle errors here
                this.log.Error(response.errorMessage);
            });
    }

    private executeMultiple(): void {
        const myRequest1 = new MIRequest();
        myRequest1.program = "MNS150MI";
        myRequest1.transaction = "GetUserData";
        //Fields that should be returned by the transaction
        myRequest1.outputFields = ["CONO", "DIVI", "DTFM"];
        //Input to the transaction
        myRequest1.record = { USID: this.usid };

        const myRequest2 = new MIRequest();
        myRequest2.program = "MNS150MI";
        myRequest2.transaction = "LstUserData";
        //Fields that should be returned by the transaction
        myRequest2.outputFields = ["USID", "TX40", "USTP"];
        myRequest2.maxReturnedRecords = 5;

        const myPromise1 = this.miService.executeRequest(myRequest1);
        const myPromise2 = this.miService.executeRequest(myRequest2);
        
        Promise.all([myPromise1, myPromise2]).then(
            response => {
                //Read results here
                const response1 = response[0];
                const response2 = response[1];
                for (let item of response1["items"]) {
                    this.log.Info(`4: DTFM: ${item.DTFM}`);
                }
                for (let item of response2["items"]) {
                    this.log.Info(`4: USID: ${item.USID}`);
                }
            }).catch((response: IMIResponse) => {
                //Handle errors here
                this.log.Error(response.errorMessage);
            });
    }
}