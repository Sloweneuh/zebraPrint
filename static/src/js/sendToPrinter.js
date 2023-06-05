odoo.define('zebraPrint.sendToPrinter', function (require) {
    "use strict";
    var selected_device;
    var devices = [];
    var BrowserPrint = require("zebraPrint.browserprint");
    var formController = require('web.FormController');
    var core = require('web.core');

    formController.include({

        startConfig: function () {
            self = this;
            BrowserPrint.getDefaultDevice("printer", function (device) {
                selected_device = device;
                console.log(selected_device);
                self.writeToSelectedPrinter('Zebra sur Odoo');

            }, function (error) {
                alert(error);
            })
        },

        errorCallback: function (errorMessage) {
            alert("Error: " + errorMessage);
        },

        writeToSelectedPrinter: function (dataToWrite) {
            selected_device.send(dataToWrite, undefined, this.errorCallback());
        },

        _onButtonClicked: function (event) {
            if (event.data.attrs.name == "action_zebra_print") {
                this.startConfig();
            }
            this._super(event);
        },
    });
});