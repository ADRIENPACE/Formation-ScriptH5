/**
 * H5 Script SDK sample.
 */

/**
 * Displays the raw XML content of an MForm from the View Definitions file.
 */
class H5SampleShowXml {
    private controller: IInstanceController;
    private log: IScriptLog;
    private args: string;
    private static charMap = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&#39;',
        '!': '&#33;',
        '[': '&#91;',
        ']': '&#93;'
    };

    constructor(args: IScriptArgs) {
        this.controller = args.controller;
        this.log = args.log;
        this.args = args.args;
    }

    public static Init(args: IScriptArgs): void {
        new H5SampleShowXml(args).run();
    }

    private run(): void {
        const xml = this.controller.Response.RawContent;
        const strXml = (new XMLSerializer()).serializeToString(xml);
        const finalStr = this.escapeChar(strXml);

        ConfirmDialog.ShowMessageDialog({
            dialogType: "Information",
            header: "XML Response",
            message: finalStr
        });
    }

    private escapeChar(xml: string): string {
        return xml.replace(/[<>&"'!]/g, (ch) => {
            return H5SampleShowXml.charMap[ch];
        });
    }
} 