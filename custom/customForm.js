webix.protoUI({
    name: "customForm",
    defaults: {width: 600},
    $init: function (config) {
        if(!webix.isArray(config.fields)) config.fields = [config.fields]
        const fields = config.fields.map(function (field) {
            return { view: "text", label: field }
        });
        const saveAction = config.saveAction || function () { webix.message("Save") };
        const cancelAction = config.cancelAction || function () { webix.message("Cancel") };
        config.elements = [
            {
                rows: fields,
            },
            {
                cols: [
                    { view: "button", label: "Cancel", click: cancelAction },
                    {},
                    { view: "button", label: "Save", css: "webix_primary", click: saveAction },
                ]
            }
        ]
    },
}, webix.ui.form)

