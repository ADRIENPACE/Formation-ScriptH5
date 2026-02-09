/**
* H5 Script SDK sample.
*/

/**
 * Hides column with column names MMITNO and MMITDS
 * Run in MMS001
 */
class H5SampleHideColumns {
    private controller: IInstanceController;

    constructor(scriptArgs: IScriptArgs) {
        this.controller = scriptArgs.controller;
    }

    public static Init(args: IScriptArgs): void {
        new H5SampleHideColumns(args).run();
    }

    private run(): void {
        if(ScriptUtil.version >= 2.0){
            const activeGrid = ListControl.ListView.GetDatagrid(this.controller);
            const contentElement = this.controller.GetContentElement();
            activeGrid.hideColumns(['MMITNO','MMITDS']);
        }
    }
}