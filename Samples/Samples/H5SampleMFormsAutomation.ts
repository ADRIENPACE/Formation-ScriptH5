/**
* H5 Script SDK sample.
*/

/**
 * Retrieves the user ID from the user context 
 * and creates an automation that starts MNS150 and opens the user in change mode.
 */
class H5SampleMFormsAutomation {

    private controller: IInstanceController;
    private log: IScriptLog;

    constructor(args: IScriptArgs) {
        this.controller = args.controller;
        this.log = args.log;
    }

	 /**
	 * Script initialization function.
	 */
    public static Init(args: IScriptArgs): void {
        new H5SampleMFormsAutomation(args).run();
    }

    private run(): void {
        if (this.controller.GetProgramName() === "MNS150") {
            this.log.Error("Adding this script will cause an infinite loop. Try adding it to a different program.");
            return;
        }

        this.addButton();        
    }

    private addButton(): void {
        const run = new ButtonElement();
        run.Name = "run";
        run.Value = "Run Automation";
        run.Position = new PositionElement();
        run.Position.Top = 2;
        run.Position.Left = 1;
        run.Position.Width = 5;

        const contentElement = this.controller.GetContentElement();
        const $run = contentElement.AddElement(run);
        $run.click({}, () => {
            const auto = new MFormsAutomation();
            auto.addStep(ActionType.Run, "MNS150");
            auto.addStep(ActionType.Key, "ENTER");
            auto.addField("W1USID", ScriptUtil.GetUserContext("USID"));
            auto.addStep(ActionType.ListOption, "2");

            const uri = auto.toEncodedUri();
            ScriptUtil.Launch(uri);
        });
    }
}