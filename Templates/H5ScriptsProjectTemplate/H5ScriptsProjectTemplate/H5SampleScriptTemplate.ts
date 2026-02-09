class H5SampleScriptTemplate {
    private controller: IInstanceController;
    private log: IScriptLog;
    private args: string;

    constructor(scriptArgs: IScriptArgs) {
        this.log = scriptArgs.log;
    }

    /**
	 * Script initialization function.
	 */
    public static Init(args: IScriptArgs): void {
        new H5SampleScriptTemplate(args).run();
    }

    private run(): void {
        this.log.Info("H5SampleScriptTemplate");
        /* Write code here */
    }
}