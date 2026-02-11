/**
* H5 Script SDK sample.
*/

/**
 * Appends a column to the current grid
 */
class H5SampleCustomColumns {
    private controller: IInstanceController;
    private unsubscribeReqCompleted;

    constructor(scriptArgs: IScriptArgs) {
        this.controller = scriptArgs.controller;
    }

    /**
	 * Script initialization function.
	 */
    public static Init(args: IScriptArgs): void {
        new H5SampleCustomColumns(args).run();
    }

    private run(): void {
        const list = this.controller.GetGrid();
        const customColumnNum = list.getColumns().length + 1;

        this.appendColumn(list, customColumnNum);
        this.populateData(list, customColumnNum);
        this.attachEvents(this.controller, list, customColumnNum);
    }

    private appendColumn(list: IActiveGrid, columnNum: number) {
        const columnId = "C" + columnNum;

        let columns = list.getColumns();
        let newColumn = {
            id: columnId,
            field: columnId,
            name: "Custom Column " + columnNum,
            width: 100
        }
        if (columns.filter((column) => column.id === newColumn.id).length > 0) {
            return; //Do not append column;
        }
        if (columns.length < columnNum) {
            columns.push(newColumn);
        }
        list.setColumns(columns);
    }

    private populateData(list: IActiveGrid, columnNum: number) {
        const columnId = "C" + columnNum;

        if (ScriptUtil.version >= 2.0) {
            const dataset: any[] = list.getData();
            for (let i = 0; i < dataset.length; i++) {
                const data = dataset[i];
                data[columnId] = "Dummy Data" + i;
                list.updateCellValue(data.index, columnId, "Dummy Data" + 0);//Cloud
            }
            //list.setData(dataset);
        } else {
            for (let i = 0; i < list.getData().getLength(); i++) {
                let newData = {};
                newData[columnId] = "Dummy Data" + i;
                newData["id_" + columnId] = "R" + (i + 1) + columnId;
                //$.extend(list.getData().getItem(i), newData);
                list.setDataItemValueForColumn(list.getData().getItem(i), columnId, "Dummy Data" + i);//OnPromise
            }
            let columns = list.getColumns();
            list.setColumns(columns);
        }
    }

    private attachEvents(controller: IInstanceController, list: IActiveGrid, columnNum: number) {
        this.unsubscribeReqCompleted = controller.RequestCompleted.On((e) => {
            //Populate additional data on scroll
            if (e.commandType === "PAGE" && e.commandValue === "DOWN") {
                this.populateData(list, columnNum);
            } else if (e.commandType === "SEARCH") {
                let customColumnNum = list.getColumns().length + 1;
                const timeout = setTimeout(() => {
                this.appendColumn(list, customColumnNum);
                this.populateData(list, columnNum);
                clearTimeout(timeout);
                }, 300);
            } else {
                this.detachEvents();
            }
        });
    }

    private detachEvents() {
        this.unsubscribeReqCompleted();
    }
}