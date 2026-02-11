var H5SampleScriptTemplate = (function () {
    function H5SampleScriptTemplate(scriptArgs) {
        this.log = scriptArgs.log;
    }
    /**
     * Script initialization function.
     */
    H5SampleScriptTemplate.Init = function (args) {
        new H5SampleScriptTemplate(args).run();
    };
    H5SampleScriptTemplate.prototype.run = function () {
        this.log.Info("H5SampleScriptTemplate");
        /* Write code here */
    };
    return H5SampleScriptTemplate;
}());
//# sourceMappingURL=H5SampleScriptTemplate.js.map