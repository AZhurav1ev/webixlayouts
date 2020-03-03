"use strict"

function saveItem() {
    const form = $$("form");
    const table = $$("table");

    if (form.validate()) {
        const item_data = form.getValues();
        if (item_data.id) {
            form.save();
            table.unselect();
            webix.message({
                text: `Movie is updated`,
                type: "success",
                expire: 1000
            });
        } else {
            form.save();
            webix.message({
                text: `New movie added`,
                type: "success",
                expire: 1000
            });
        }
        form.clear();
    }
}

function clearValidation() {
    webix.confirm(`Do you realy want to clear form?`)
        .then(() => {
            $$("form").clearValidation();
            $$("form").clear();
        })
}

function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

function addRandomUser() {
    const countries = ["Germany", "USA", "Canada", "Russia", "China", "France", "Italy", "Spain"];
    const names = ["John", "Bill", "Jacob", "William", "Liam", "Michael", "Alexander", "Noah"];
    // const newUser = {
    //     name: names[randomInteger(0, countries.length - 1)],
    //     country: countries[randomInteger(0, names.length - 1)],
    //     age: randomInteger(1, 100)
    //}
    $$("user_list").add({
        name: names[randomInteger(0, countries.length - 1)],
        country: countries[randomInteger(0, names.length - 1)],
        age: randomInteger(1, 100)
    })
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

const tabbar = {
    view: "tabbar",
    id: "tab_bar",
    on: {
        onAfterTabClick: function () {
            $$("table").filterByAll()
        }
    },
    options: [
        { id: "all", value: "All" },
        { id: "old", value: "Old" },
        { id: "modern", value: "Modern" },
        { id: "new", value: "New" }
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
    columns: [
        { id: "rank", header: "", width: 50, css: "gray" },
        { id: "title", header: ["Film Title", { content: "textFilter" }], fillspace: true, sort: "string" },
        { id: "category", header: ["Category", { content: "selectFilter" }], options: "data/categories.js" },
        { id: "votes", header: ["Votes", { content: "textFilter" }], sort: "int" },
        { id: "rating", header: ["Rating", { content: "textFilter" }], sort: "int" },
        { id: "year", header: "Released" },
        { id: "deleteIcon", header: "", template: "{common.trashIcon()}" }
    ],
    onClick: {
        "wxi-trash": function (e, id) {
            this.remove(id.row)
        }
    },
    scheme: {
        $init: function (obj) {
            if (!obj.category) {
                obj.category = randomInteger(1, 4);
            }
            if (obj.votes.includes(",")) {
                obj.votes = obj.votes.replace(",", "");
            }
            if (obj.rating.includes(",")) {
                obj.rating = obj.rating.replace(",", ".");
            }
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
                        { view: "text", label: "Votes", name: "votes", invalidMessage: "Votes must be less than 1000000" },
                        {
                            cols: [
                                { view: "button", label: "Save", width: 100, css: "webix_primary", click: saveItem },
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
                    const currentYear = new Date().getFullYear()
                    return value > 1970 && value < currentYear;
                },
                rating: function (value) {
                    return +value;
                },
                votes: function (value) {
                    return value < 1000000;
                },
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

webix.protoUI({
    name: "editlist"
}, webix.EditAbility, webix.ui.list);

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
                                return obj.country.toLowerCase().indexOf(value) !== -1 || obj.name.toLowerCase().indexOf(value) !== -1
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
                {
                    view: "button",
                    label: "Add user",
                    id: "btn_add_user",
                    autowidth: true,
                    css: "webix_primary",
                    click: addRandomUser
                },
            ]
        },
        {
            view: "editlist",
            editable: true,
            editor: "text",
            editValue: "name",
            id: "user_list",
            template: `#name# from #country#, age: #age#. <span class="webix_icon wxi-close right"></span>`,
            url: "data/users.js",
            autowidth: true,
            select: true,
            on: {
                onBeforeEditStop: function (field) {
                    if (field.value === "") {
                        return false;
                    }
                }
            },
            onClick: {
                "wxi-close": function (e, id) {
                    this.remove(id)
                }
            },
            scheme: {
                $init: function (obj) {
                    if (obj.age < 26) obj.$css = "yellow"
                }
            }

        }
    ]
}

const chart = {
    view: "chart",
    id: "chart_table",
    type: "bar",
    barWidth: 40,
    value: "#name#",
    xAxis: {
        template: "#country#",
        title: "Country"
    },
    yAxis: {}
}

const treeTable = {
    view: "treetable",
    id: "price_tree",
    columns: [
        { id: "id", header: "", width: 50 },
        { id: "title", editor: "text", header: "Title", template: "{common.treetable()} #title#", width: 200 },
        { id: "price", editor: "text", header: "Price", width: 200 }
    ],
    rules: {
        "title": webix.rules.isNotEmpty,
        "price": webix.rules.isNumber
    },
    autowidth: true,
    editable: true,
    select: "cell",
    scroll: "y",
    url: "data/products.js",
    ready: function () {
        this.openAll();
    }
}

const main = {
    cells: [
        { id: "Dashboard", cols: [{ rows: [tabbar, datatable] }, form] },
        { id: "Users", rows: [userList, chart] },
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

    $$("form").bind("table");
    $$("chart_table").sync($$("user_list"), function () {
        this.group({
            by: "country",
            map: {
                name: ["country", "count"]
            }
        })
    });

    $$("table").registerFilter(
        $$("tab_bar"),
        {
            columnId: "year", compare: function (year, filter) {
                const currentYear = new Date().getFullYear();
                switch (filter) {
                    case "old":
                        return year < 1950;
                    case "modern":
                        return year > 1950 && year < 1990;
                    case "new":
                        return year > 1990 && year < currentYear;
                    default:
                        return true;
                }
            }
        },
        {
            getValue: function (node) {
                return node.getValue();
            },
            setValue: function (node, value) {
                node.setValue(value);
            }
        }
    );
})

