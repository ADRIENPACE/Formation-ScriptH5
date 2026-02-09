/**
* H5 Script SDK sample. In development.
*/

/**
 * Launches CRS610 using a standard Ming.le drillback link
 * Requires a Customer ID from the script arguments
 */
class H5SampleDrillback {
    private controller: IInstanceController;
    private log: IScriptLog;

    private content: IContentElement;
    private customer: string;

    constructor(scriptArgs: IScriptArgs) {
        this.controller = scriptArgs.controller;
        this.log = scriptArgs.log;
        this.customer = scriptArgs.args;
    }

    /**
	 * Script initialization function.
	 */
    public static Init(args: IScriptArgs): void {
        new H5SampleDrillback(args).run();
    }

    private run(): void {
        if (!this.customer) {
            this.log.Error("Enter a customer ID in the script arguments.");
            return;
        }

        this.content = this.controller.GetContentElement();
        this.addButton();
    }

    private invokeDrillback() {
        const lid = "lid://infor.m3.m3devapp";
        const userContext = ScriptUtil.GetUserContext();
        const acctEntity = `${userContext.CurrentCompany}_${userContext.CurrentDivision}`;
        const bookmark = "&program=CRS610&panel=E&tableName=OCUSMA&option=5";
        const keys = `&keys=OKCONO,880,OKCUNO,${this.customer}`;
        const drillback = `?LogicalId=${lid}&accountingEntity=${acctEntity}${bookmark}${keys}`;

        //Fire the drillback message using the Infor Ming.le JavaScript API
        infor.companyon.client.sendPrepareDrillbackMessage(drillback);
    }

    private addButton(): void {
        const run = new ButtonElement();
        run.Name = "run";
        run.Value = "Invoke Drillback";
        run.Position = new PositionElement();
        run.Position.Top = 2;
        run.Position.Left = 1;
        run.Position.Width = 5;

        const $run = this.content.AddElement(run);
        $run.click(() => {
            this.invokeDrillback();
        });
    }
}