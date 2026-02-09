/**
 * H5 Script SDK sample.
 */

/**
 * Adds label, textbox, combobox, checkbox, button, date picker, and radio group
 * On button click, toggles the checkbox and prints the textbox and combobox values on the console
 */
class H5SampleAddElements {
    private controller: IInstanceController;
    private log: IScriptLog;
    private args: string;

    private contentElement: IContentElement;

    constructor(scriptArgs: IScriptArgs) {
        this.controller = scriptArgs.controller;
        this.log = scriptArgs.log;
        this.args = scriptArgs.args;
    }

    public static Init(args: IScriptArgs): void {
        new H5SampleAddElements(args).run();
    }

    private run(): void {
        this.contentElement = this.controller.GetContentElement();

        this.addLabel();
        this.addTextBox();
        this.addComboBox();
        this.addCheckbox();
        this.addButton();
        this.addDatePicker();
        this.addRadioGroup();
    }

    private addLabel(): void {
        const labelElement = new LabelElement();
        labelElement.Name = "testLabel";
        labelElement.Value = "Test Elements";
        labelElement.Position = new PositionElement();
        labelElement.Position.Top = 5;
        labelElement.Position.Left = 6;

        this.contentElement.AddElement(labelElement);
    }

    private addTextBox(): void {
        const textElement = new TextBoxElement();
        textElement.Name = "testTextBox";
        textElement.Value = "Test";
        textElement.Position = new PositionElement();
        textElement.Position.Top = 5;
        textElement.Position.Left = 14;
        textElement.Position.Width = 5;

        this.contentElement.AddElement(textElement);
    }

    private addComboBox(): void {
        const items = [
            { key: '1', value: 'One', selected: true },
            { key: '2', value: 'Two', selected: false  },
            { key: '3', value: 'Three', selected: false  },
            { key: '4', value: 'Four', selected: false  },
            { key: '5', value: 'Five', selected: false  },
        ];

        const comboBox = new ComboBoxElement();
        comboBox.Name = "testComboBox";
        comboBox.Position = new PositionElement();
        comboBox.Position.Top = 5;
        comboBox.Position.Left = 18;
        comboBox.Position.Width = 8;        

        for(let item of items) {
            const cboxItem = new ComboBoxItemElement();
            cboxItem.Value = item.key;
            cboxItem.Text = item.value;
            if(item.selected) {
                cboxItem.IsSelected = true;
            }
            comboBox.Items.push(cboxItem);
        }
        
        this.contentElement.AddElement(comboBox);
    }

    private addCheckbox(): void {
        const cbElement = new CheckBoxElement();
        cbElement.Name = "testCheckBox";
        cbElement.Position = new PositionElement();
        cbElement.Position.Top = 5;
        cbElement.Position.Left = 26;
        cbElement.IsChecked = false;

        this.contentElement.AddElement(cbElement);
    }

    private addButton(): void {
        const buttonElement = new ButtonElement();
        buttonElement.Name = "testButton";
        buttonElement.Value = "Print and Toggle";
        buttonElement.Position = new PositionElement();
        buttonElement.Position.Top = 5;
        buttonElement.Position.Left = 28;
        buttonElement.Position.Width = 5;

        const $button = this.contentElement.AddElement(buttonElement);
        $button.click({}, () => {
            const $textBox = $("#testTextBox");
            const $selected = $("#testComboBox").find('option:selected');
            const $cbox = $('#testCheckBox');

            this.log.Info(`Text value: ${$textBox.val()}`);
            this.log.Info(`Selected option: ${$selected.val()} (${$selected.text()})`);

            if (ScriptUtil.version >= 2.0) {
                const cboxId = 'testCheckBox';
                const controller = this.controller;
                const value = ScriptUtil.GetFieldValue(cboxId, controller);
                ScriptUtil.SetFieldValue('testCheckBox', !value, this.controller);
            } else {
                $cbox.toggleChecked();
            }
        });
    }

    private addDatePicker(){
        const name = "testDatepicker";
        const position = new PositionElement();
        position.Top = 5;
        position.Left = 40;
        position.Width = 20;
		
		if (ScriptUtil.version >= 2.0) {
            const datepickerElement = new DatePickerElement();
            datepickerElement.Name = name;
            datepickerElement.Position = position;
			datepickerElement.DateFormat = "DDMMYY";
            
			this.controller.GetContentElement().AddElement(datepickerElement);
		} else {
            const textElement = new TextBoxElement();
            textElement.Name = name;
            textElement.DateFormat = "ddMMyy";
            textElement.Position = position

			const datepicker = this.controller.GetContentElement().AddElement(textElement);
			datepicker.inforDateField({
			    hasInitialValue: false,
			    openOnEnter: false,
			    dateFormat: "ddMMyy",
			});
		}
    }

    private addRadioGroup(): void {
        const radios = {
            name: 'testRadioGroup',
            selected: '2',
            items: [
                { value: '1', label: 'One' },
                { value: '2', label: 'Two' },
                { value: '3', label: 'Three' },
                { value: '4', label: 'Four' }
            ],
        };

        const radioGroup = new RadioGroupElement();
        radioGroup.Name = radios.name;
        radioGroup.Position = new PositionElement();
        radioGroup.Position.Top = 5;
        radioGroup.Position.Left = 60;
        radioGroup.Position.Width = 5;
        radioGroup.Selected = radios.selected;

        for(let item of radios.items) {
            const radioBtn = new RadioButtonElement();
            radioBtn.Value = item.value;
            radioBtn.Label = item.label;
            radioGroup.Items.push(radioBtn);
        }
        
        this.contentElement.AddElement(radioGroup);
    }
}
