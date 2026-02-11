/**
 * H5 Script SDK sample.
 */
/**
 * Adds label, textbox, combobox, checkbox, button, date picker, and radio group
 * On button click, toggles the checkbox and prints the textbox and combobox values on the console
 */
var H5SampleAddElements = (function () {
    function H5SampleAddElements(scriptArgs) {
        this.controller = scriptArgs.controller;
        this.log = scriptArgs.log;
        this.args = scriptArgs.args;
    }
    H5SampleAddElements.Init = function (args) {
        new H5SampleAddElements(args).run();
    };
    H5SampleAddElements.prototype.run = function () {
        this.contentElement = this.controller.GetContentElement();
        this.addLabel();
        this.addTextBox();
        this.addComboBox();
        this.addCheckbox();
        this.addButton();
        this.addDatePicker();
        this.addRadioGroup();
    };
    H5SampleAddElements.prototype.addLabel = function () {
        var labelElement = new LabelElement();
        labelElement.Name = "testLabel";
        labelElement.Value = "Test Elements";
        labelElement.Position = new PositionElement();
        labelElement.Position.Top = 5;
        labelElement.Position.Left = 6;
        this.contentElement.AddElement(labelElement);
    };
    H5SampleAddElements.prototype.addTextBox = function () {
        var textElement = new TextBoxElement();
        textElement.Name = "testTextBox";
        textElement.Value = "Test";
        textElement.Position = new PositionElement();
        textElement.Position.Top = 5;
        textElement.Position.Left = 14;
        textElement.Position.Width = 5;
        this.contentElement.AddElement(textElement);
    };
    H5SampleAddElements.prototype.addComboBox = function () {
        var items = [
            { key: '1', value: 'One', selected: true },
            { key: '2', value: 'Two', selected: false },
            { key: '3', value: 'Three', selected: false },
            { key: '4', value: 'Four', selected: false },
            { key: '5', value: 'Five', selected: false },
        ];
        var comboBox = new ComboBoxElement();
        comboBox.Name = "testComboBox";
        comboBox.Position = new PositionElement();
        comboBox.Position.Top = 5;
        comboBox.Position.Left = 18;
        comboBox.Position.Width = 8;
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            var cboxItem = new ComboBoxItemElement();
            cboxItem.Value = item.key;
            cboxItem.Text = item.value;
            if (item.selected) {
                cboxItem.IsSelected = true;
            }
            comboBox.Items.push(cboxItem);
        }
        this.contentElement.AddElement(comboBox);
    };
    H5SampleAddElements.prototype.addCheckbox = function () {
        var cbElement = new CheckBoxElement();
        cbElement.Name = "testCheckBox";
        cbElement.Position = new PositionElement();
        cbElement.Position.Top = 5;
        cbElement.Position.Left = 26;
        cbElement.IsChecked = false;
        this.contentElement.AddElement(cbElement);
    };
    H5SampleAddElements.prototype.addButton = function () {
        var _this = this;
        var buttonElement = new ButtonElement();
        buttonElement.Name = "testButton";
        buttonElement.Value = "Print and Toggle";
        buttonElement.Position = new PositionElement();
        buttonElement.Position.Top = 5;
        buttonElement.Position.Left = 28;
        buttonElement.Position.Width = 5;
        var $button = this.contentElement.AddElement(buttonElement);
        $button.click({}, function () {
            var $textBox = $("#testTextBox");
            var $selected = $("#testComboBox").find('option:selected');
            var $cbox = $('#testCheckBox');
            _this.log.Info("Text value: " + $textBox.val());
            _this.log.Info("Selected option: " + $selected.val() + " (" + $selected.text() + ")");
            if (ScriptUtil.version >= 2.0) {
                var cboxId = 'testCheckBox';
                var controller = _this.controller;
                var value = ScriptUtil.GetFieldValue(cboxId, controller);
                ScriptUtil.SetFieldValue('testCheckBox', !value, _this.controller);
            }
            else {
                $cbox.toggleChecked();
            }
        });
    };
    H5SampleAddElements.prototype.addDatePicker = function () {
        var name = "testDatepicker";
        var position = new PositionElement();
        position.Top = 5;
        position.Left = 40;
        position.Width = 20;
        if (ScriptUtil.version >= 2.0) {
            var datepickerElement = new DatePickerElement();
            datepickerElement.Name = name;
            datepickerElement.Position = position;
            datepickerElement.DateFormat = "DDMMYY";
            this.controller.GetContentElement().AddElement(datepickerElement);
        }
        else {
            var textElement = new TextBoxElement();
            textElement.Name = name;
            textElement.DateFormat = "ddMMyy";
            textElement.Position = position;
            var datepicker = this.controller.GetContentElement().AddElement(textElement);
            datepicker.inforDateField({
                hasInitialValue: false,
                openOnEnter: false,
                dateFormat: "ddMMyy",
            });
        }
    };
    H5SampleAddElements.prototype.addRadioGroup = function () {
        var radios = {
            name: 'testRadioGroup',
            selected: '2',
            items: [
                { value: '1', label: 'One' },
                { value: '2', label: 'Two' },
                { value: '3', label: 'Three' },
                { value: '4', label: 'Four' }
            ],
        };
        var radioGroup = new RadioGroupElement();
        radioGroup.Name = radios.name;
        radioGroup.Position = new PositionElement();
        radioGroup.Position.Top = 5;
        radioGroup.Position.Left = 60;
        radioGroup.Position.Width = 5;
        radioGroup.Selected = radios.selected;
        for (var _i = 0, _a = radios.items; _i < _a.length; _i++) {
            var item = _a[_i];
            var radioBtn = new RadioButtonElement();
            radioBtn.Value = item.value;
            radioBtn.Label = item.label;
            radioGroup.Items.push(radioBtn);
        }
        this.contentElement.AddElement(radioGroup);
    };
    return H5SampleAddElements;
}());
//# sourceMappingURL=H5SampleAddElements.js.map