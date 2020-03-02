"use strict"

function saveItem() {
    const form = $$("form");
    const table = $$("table");
    const item_data = form.getValues();
    if (item_data.id) {
        table.updateItem(item_data.id, item_data);
        form.clear();
        webix.message({
            text: `Movie is updated `,
            type: "success",
            expire: 1000
        });
    } else {
        const validationResult = form.validate();
        if (validationResult) {
            table.add(item_data);
            form.clear();
            webix.message({
                text: `New movie added`,
                type: "success",
                expire: 1000
            });
        }
    }
}

function clearValidation() {
    webix.confirm(`Do you realy want to clear form?`)
        .then(() => {
            $$("form").clearValidation();
            $$("form").clear();
        })
}

function dataToForm(id) {
    const value = $$("table").getItem(id);
    $$("form").setValues(value);
}

const toolbar = {
    view: "toolbar",
    css: "webix_dark",
    elements: [
        { view: "label", label: "My app" },
        {},
        {
            view: "button",
            id: "btn_save",
            label: "Profile",
            autowidth: true,
            css: "webix_transparent",
            type: "icon",
            icon: "wxi-user",
            popup: "profile_menu"
        }
    ]
}

const list = {
    css: "lightgray",
    type: "clean",
    rows: [
        {
            view: "list",
            css: "lightgray",
            id: "mylist",
            autowidth: true,
            scroll: false,
            select: true,
            data: ["Dashboard", "Users", "Products", "Admin"],
            on: {
                onAfterSelect: function (id) {
                    $$(id).show();
                }
            }
        },
        {},
        {
            css: "lightgray green center",
            height: 30,
            width: 120,
            template: `<span class='webix_icon wxi-check'></span>Connected`
        }
    ]
}

const datatable = {
    view: "datatable",
    id: "table",
    url: "data/data.js",
    autoConfig: true,
    scroll: "y",
    select: true,
    hover: "datatable_hover",
    on: {
        onAfterSelect: dataToForm
    },
    columns: [
        { id: "rank", header: "", width: 50, css: "gray" },
        { id: "title", header: ["Film Title", { content: "textFilter" }], fillspace: true },
        { id: "year", header: ["Released", { content: "numberFilter" }] },
        { id: "votes", header: ["Votes", { content: "textFilter" }] },
        { id: "rating", header: ["Rating", { content: "textFilter" }] },
        { id: "deleteIcon", header: "", template: "{common.trashIcon()}" }
    ],
    onClick: {
        "wxi-trash": function (e, id) {
            this.remove(id.row)
        }
    }
}

const form = {
    type: "clean",
    rows: [
        {
            view: "form",
            id: "form",
            width: 350,
            elements: [
                {
                    rows: [
                        { template: "EDIT FILMS", type: "section" },
                        { view: "text", label: "Title", name: "title", invalidMessage: "Title can not be empty" },
                        { view: "text", label: "Year", name: "year", invalidMessage: "Year should be between 1970 and current", type: "number" },
                        { view: "text", label: "Rating", name: "rating", invalidMessage: "Rating cannot be empty or 0" },
                        { view: "text", label: "Votes", name: "votes", invalidMessage: "Votes must be less than 100000" },
                        {
                            cols: [
                                { view: "button", label: "Add new", width: 100, css: "webix_primary", click: saveItem },
                                {},
                                { view: "button", label: "Clear", width: 100, click: clearValidation },
                            ]
                        }
                    ]
                }
            ],
            rules: {
                title: webix.rules.isNotEmpty,
                year: function (value) {
                    return value > 1970 && value < new Date().getFullYear();
                },
                votes: function (value) {
                    return value < 100000;
                },
                rating: function (value) {
                    return +value;
                }
            }
        },
        {}
    ]
}

const footer = {
    css: "center",
    height: 40,
    template: `The software is provided by <a href="https://webix.com">https://webix.com</a>. All rights reserved &copy`
}

const userList = {
    rows: [
        {
            view: "toolbar",
            elements: [
                {
                    view: "text",
                    id: "title_filter_input",
                    placeholder: "Country name",
                    on: {
                        onTimedKeyPress: function () {
                            const value = this.getValue().toLowerCase();
                            $$("user_list").filter(function (obj) {
                                return obj.country.toLowerCase().indexOf(value) !== -1;
                            })
                        }
                    }
                },
                {
                    view: "button",
                    label: "Sort asc",
                    id: "btn_sort_asc",
                    autowidth: true,
                    css: "webix_primary",
                    click: function () {
                        $$("user_list").sort("#age#", "asc")
                    }
                },
                {
                    view: "button",
                    label: "Sort desc",
                    id: "btn_sort_desc",
                    autowidth: true,
                    css: "webix_primary",
                    click: function () {
                        $$("user_list").sort("#age#", "desc")
                    }
                },
            ]
        },
        {
            view: "list",
            id: "user_list",
            template: `#name# from #country#, age: #age#. <span class="webix_icon wxi-close right"></span>`,
            url: "data/users.js",
            autowidth: true,
            select: true,
            onClick: {
                "wxi-close": function (e, id) {
                    this.remove(id)
                }
            },
            ready: function () {
                const items = Object.values(this.data.pull).slice(0, 5);
                items.forEach(e => e.$css = "gray");
            }

        }
    ]
}

const ageChart = {
    view: "chart",
    type: "bar", 
    barWidth: 40,
    value: "#age#",
    xAxis: {
        template: "#age#",
        title: "Age"
    },
    url: "data/users.js"
}

const treeTable = {
    view: "treetable",
    id: "price_tree",
    columns: [
        { id: "id", header: "", width: 50 },
        { id: "title", header: "Title", template: "{common.treetable()} #title#", width: 200 },
        { id: "price", header: "Price", width: 200 }
    ],
    autowidth: true,
    select: true,
    scroll: "y",
    url: "data/products.js",
    ready: function () {
        this.openAll();
    }
}

const main = {
    cells: [
        { id: "Dashboard", cols: [datatable, form] },
        { id: "Users", rows: [userList, ageChart] },
        { id: "Products", rows: [treeTable] },
        { id: "Admin", template: "Admin view" }
    ]
}

webix.ready(function () {
    webix.ui({
        rows: [
            toolbar,
            { cols: [list, { view: "resizer" }, main] },
            footer,
        ]
    })

    webix.ui({
        view: "popup",
        id: "profile_menu",
        width: 200,
        body: {
            view: "list",
            data: [
                { id: 1, name: "Settings" },
                { id: 2, name: "Log Out" }
            ],
            template: "#name#",
            autoheight: true,
        }
    })
})

