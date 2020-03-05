"use strict"

const userCollection = new webix.DataCollection({
    url: "data/users.js",
    scheme: {
        $init: function (obj) {
            if (obj.age < 26) obj.$css = "yellow"
        }
    }
})

const categories = new webix.DataCollection({
    url: "data/categories.js"
})

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
    userCollection.add({
        name: names[randomInteger(0, countries.length - 1)],
        country: countries[randomInteger(0, names.length - 1)],
        age: randomInteger(1, 100)
    }, 0)
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
            data: ["Dashboard", "Users", "Products", "Admin", "Form"],
            on: {
                onItemClick: function (id) {
                    $$(id).show();
                }
            },
            ready: function(){
                this.select(this.getFirstId());
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
        { id: "category", header: ["Category", { content: "selectFilter" }], options: categories },
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
                        { view: "richselect", label: "Genre", name: "category", value: 1, options: categories },
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
        { id: "price", editor: "text", header: "Price", width: 200, fillspace:true }
    ],
    rules: {
        "title": webix.rules.isNotEmpty,
        "price": webix.rules.isNumber
    },
    editable: true,
    select: "cell",
    scroll: "y",
    url: "data/products.js",
    ready: function () {
        this.openAll();
    }
}

const categoriesTable = {
    rows: [
        {
            view: "toolbar",
            elements: [
                {
                    view: "text",
                    id: "category_input",
                    placeholder: "Category name",
                },
                {
                    view: "button",
                    label: "Add Category",
                    autowidth: true,
                    css: "webix_primary",
                    click: function () {
                        const genre = $$("category_input").getValue();
                        if (genre === "") {
                            webix.message(`Categoty should not be empty`);
                        } else {
                            categories.add({ value: genre }, 0);
                            webix.message(`New category added`);
                            $$("category_input").setValue("");
                        }
                    }
                },
                {
                    view: "button",
                    label: "Delete Category",
                    autowidth: true,
                    css: "webix_primary",
                    click: function () {
                        const id = $$("categoriesTable").getSelectedId();
                        if (id) {
                            categories.remove(id);
                            webix.message(`Category deleted`);
                        }
                    }
                },
            ]
        },
        {
            view: "datatable",
            id: "categoriesTable",
            scroll: "y",
            editable: true,
            editaction: "dblclick",
            select: true,
            hover: "datatable_hover",
            columns: [
                { id: "value", header: "Genre", width: 200, sort: "int", editor: "text", fillspace: true }
            ],

        }
    ]
}

