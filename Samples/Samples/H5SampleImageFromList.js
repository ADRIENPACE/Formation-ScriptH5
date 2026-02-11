/**
 * H5 Script SDK sample.
 */
/**
 * When a list row is selected, it gets the text in the first column to build a URL to an image.
 * The image is loaded and displayed next to the list.
 * The base URL to the images are retrieved from the script arguments.
 * For the script to work properly, there must be images in the folder of the URL whose names (not including the file extension) match the values of the first column in the list.
 */
var H5SampleImageFromList = (function () {
    function H5SampleImageFromList(scriptArgs) {
        this.imgLink = "";
        this.controller = scriptArgs.controller;
        this.imgLink = scriptArgs.args;
        this.content = this.controller.GetContentElement();
    }
    H5SampleImageFromList.Init = function (args) {
        new H5SampleImageFromList(args).run();
    };
    H5SampleImageFromList.prototype.run = function () {
        var _this = this;
        if (!this.imgLink) {
            ConfirmDialog.ShowMessageDialog({
                dialogType: "Error",
                header: "No Argument",
                message: "Please provide url of the location of the images. Example: http://server/images/"
            });
            return;
        }
        //Add eventhandlers
        var list = this.controller.GetGrid();
        var handler = function (e, args) { _this.onSelectionChanged(e, args); };
        list.onSelectedRowsChanged.subscribe(handler);
    };
    H5SampleImageFromList.prototype.addImage = function (src) {
        var isVersion2 = ScriptUtil.version >= 2.0;
        var contentBody = this.content.GetContentBody();
        var height = contentBody.height();
        var width = contentBody.width() / 2 - 20;
        var top = isVersion2 ? 'initial' : '0px';
        var style = "z-index:1000; \n                       display: block;\n                       max-width:" + width + "px; \n                       overflow: hidden;\n                       position:absolute;\n                       left:50%;\n                       max-height:" + height + "px; \n                       top:" + top + ";";
        var $image = $("<div id='newImg' style='" + style + "'><img style='width:100%;' src='" + src + "'></img></div>");
        if (isVersion2) {
            this.content.Append($image, contentBody);
        }
        else {
            contentBody.append($image);
        }
    };
    H5SampleImageFromList.prototype.updateImage = function (src) {
        var newImg = this.content.GetContentBody().find("#newImg");
        if (newImg) {
            newImg.remove();
        }
        this.addImage(src);
    };
    H5SampleImageFromList.prototype.onSelectionChanged = function (e, args) {
        // Get item number of selected row
        var imageName = ListControl.ListView.GetValueByColumnIndex(0);
        //Show Image
        this.updateImage(this.imgLink + imageName[0] + ".jpg");
    };
    return H5SampleImageFromList;
}());
//# sourceMappingURL=H5SampleImageFromList.js.map