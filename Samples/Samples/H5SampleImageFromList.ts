/**
 * H5 Script SDK sample.
 */

/**
 * When a list row is selected, it gets the text in the first column to build a URL to an image.
 * The image is loaded and displayed next to the list.
 * The base URL to the images are retrieved from the script arguments.
 * For the script to work properly, there must be images in the folder of the URL whose names (not including the file extension) match the values of the first column in the list.
 */
class H5SampleImageFromList {
    private imgLink = "";

    private controller: IInstanceController;
    private content: IContentElement;

    constructor(scriptArgs: IScriptArgs) {
        this.controller = scriptArgs.controller;
        this.imgLink = scriptArgs.args;
        this.content = this.controller.GetContentElement();
    }

    public static Init(args: IScriptArgs): void {
        new H5SampleImageFromList(args).run();
    }

    private run(): void {
        if (!this.imgLink) {
            ConfirmDialog.ShowMessageDialog({
                dialogType: "Error",
                header: "No Argument",
                message: "Please provide url of the location of the images. Example: http://server/images/"
            });
            return;
        }

        //Add eventhandlers
        const list = this.controller.GetGrid();
        const handler = (e, args) => { this.onSelectionChanged(e, args); };
        list.onSelectedRowsChanged.subscribe(handler);
    }

    private addImage(src: string): void {
        const isVersion2 = ScriptUtil.version >= 2.0;
        const contentBody = this.content.GetContentBody();
        const height = contentBody.height();
        const width = contentBody.width()/2 - 20;
        const top =  isVersion2 ? 'initial' : '0px';
        const style = `z-index:1000; 
                       display: block;
                       max-width:${width}px; 
                       overflow: hidden;
                       position:absolute;
                       left:50%;
                       max-height:${height}px; 
                       top:${top};`;
        const $image = $(`<div id='newImg' style='${style}'><img style='width:100%;' src='${src}'></img></div>`);

        if (isVersion2) {
            this.content.Append($image, contentBody);
        } else {
            contentBody.append($image);
        }
    }

    private updateImage(src: string): void {
        const newImg = this.content.GetContentBody().find("#newImg");
        if (newImg) {
            newImg.remove();
        }
        this.addImage(src);
    }

    private onSelectionChanged(e: any, args: any): void {
        // Get item number of selected row
        const imageName = ListControl.ListView.GetValueByColumnIndex(0);

        //Show Image
        this.updateImage(this.imgLink + imageName[0] + ".jpg");
    }
}