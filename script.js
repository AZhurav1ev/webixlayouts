"use strict"

const small_film_set = [
    { id: 1, title: "The Shawshank Redemption", year: 1994, votes: 678790, rating: 9.2, rank: 1, category: "Thriller" },
    { id: 2, title: "The Godfather", year: 1972, votes: 511495, rating: 9.2, rank: 2, category: "Crime" },
    { id: 3, title: "The Godfather: Part II", year: 1974, votes: 319352, rating: 9.0, rank: 3, category: "Crime" },
    { id: 4, title: "The Good, the Bad and the Ugly", year: 1966, votes: 213030, rating: 8.9, rank: 4, category: "Western" },
    { id: 5, title: "Pulp fiction", year: 1994, votes: 533848, rating: 8.9, rank: 5, category: "Crime" },
    { id: 6, title: "12 Angry Men", year: 1957, votes: 164558, rating: 8.9, rank: 6, category: "Western" }
]

function saveItem() {
    const validationResult = $$("form").validate();
    if (validationResult) {
        const item_data = $$("form").getValues();
        $$("table").add(item_data);
        $$("form").clear();
        webix.message({
            text: `Validation is successful`,
            type: "success",
            expire: 1000
        });
    }
}

function clearValidation() {
    webix.confirm(`Do you realy want to clear form?`)
        .then(() => {
            $$("form").clearValidation();
            $$("form").clear();
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
            data: ["Dashboard", "Users", "Products", "Locations"]
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
    data: small_film_set,
    autoConfig: true,
    scroll: "y"
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
                        { view: "text", label: "Rating", name: "rating", invalidMessage: "Rating cannot be empty or 0", type: "number" },
                        { view: "text", label: "Votes", name: "votes", invalidMessage: "Votes must be less than 100000", type: "number" },
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

webix.ready(function () {
    webix.ui({
        rows: [
            toolbar,
            {
                cols: [
                    list,
                    { view: "resizer" },
                    datatable,
                    form
                ]
            },
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

