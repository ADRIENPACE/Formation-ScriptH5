/**
 * H5 Script SDK sample.
 */
/**
 * Displays the raw XML content of an MForm from the View Definitions file.
 */
var H5SampleShowXml = (function () {
    function H5SampleShowXml(args) {
        this.controller = args.controller;
        this.log = args.log;
        this.args = args.args;
    }
    H5SampleShowXml.Init = function (args) {
        new H5SampleShowXml(args).run();
    };
    H5SampleShowXml.prototype.run = function () {
        var xml = this.controller.Response.RawContent;
        var strXml = (new XMLSerializer()).serializeToString(xml);
        var finalStr = this.escapeChar(strXml);
        ConfirmDialog.ShowMessageDialog({
            dialogType: "Information",
            header: "XML Response",
            message: finalStr
        });
    };
    H5SampleShowXml.prototype.escapeChar = function (xml) {
        return xml.replace(/[<>&"'!]/g, function (ch) {
            return H5SampleShowXml.charMap[ch];
        });
    };
    return H5SampleShowXml;
}());
H5SampleShowXml.charMap = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    "'": '&#39;',
    '!': '&#33;',
    '[': '&#91;',
    ']': '&#93;'
};
//# sourceMappingURL=H5SampleShowXml.js.map