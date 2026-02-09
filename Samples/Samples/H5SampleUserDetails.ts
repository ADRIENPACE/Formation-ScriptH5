/**
* H5 Script SDK sample.
*/

/**
 * Adds a custom ButtonElement on the Panel. 
 * When the button is clicked, a message dialog shows M3-related data about the logged on user.
 */
class H5SampleUserDetails {
    private controller: IInstanceController;
    private log: IScriptLog;
    private args: string;

    constructor(scriptArgs: IScriptArgs) {
        this.controller = scriptArgs.controller;
        this.log = scriptArgs.log;
        this.args = scriptArgs.args;
    }

    /**
	 * Script initialization function.
	 */
    public static Init(args: IScriptArgs): void {
        new H5SampleUserDetails(args).run();
    }

    private run(): void {
        this.addButton();
    }

    private addButton(): void {
        const buttonElement = new ButtonElement();
        buttonElement.Name = "showUserDetails";
        buttonElement.Value = "Show User Details";
        buttonElement.Position = new PositionElement();
        buttonElement.Position.Top = 2;
        buttonElement.Position.Left = 1;
        buttonElement.Position.Width = 5;

        const contentElement = this.controller.GetContentElement();
        const button = contentElement.AddElement(buttonElement);

        button.click(() => {
            this.showDetails();
        });
    }

    private showDetails(): void {
        const userContext = ScriptUtil.GetUserContext();
        const header = "USER DETAILS";
        const message = [];

        for (let key in userContext) {
            message.push(key + ": " + userContext[key]);
        }

        const opts = {
            dialogType: "Information",
            header: header,
            message: message.join("<br/>"),
            id: "msgDetails",
            withCancelButton: true,
            isCancelDefault: false
        };

        ConfirmDialog.ShowMessageDialog(opts);
    }
}