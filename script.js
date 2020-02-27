"use strict"

const small_film_set = [
    { id: 1, title: "The Shawshank Redemption", year: 1994, votes: 678790, rating: 9.2, rank: 1, category: "Thriller" },
    { id: 2, title: "The Godfather", year: 1972, votes: 511495, rating: 9.2, rank: 2, category: "Crime" },
    { id: 3, title: "The Godfather: Part II", year: 1974, votes: 319352, rating: 9.0, rank: 3, category: "Crime" },
    { id: 4, title: "The Good, the Bad and the Ugly", year: 1966, votes: 213030, rating: 8.9, rank: 4, category: "Western" },
    { id: 5, title: "Pulp fiction", year: 1994, votes: 533848, rating: 8.9, rank: 5, category: "Crime" },
    { id: 6, title: "12 Angry Men", year: 1957, votes: 164558, rating: 8.9, rank: 6, category: "Western" }
]

const toolbar = {
    view: "toolbar",
    css: "webix_dark",
    elements: [
        { view: "label", label: "My app" },
        {},
        { view: "button", label: "Profile", autowidth: true, css: "webix_transparent", type: "icon", icon: "wxi-user" }
    ]
}

const list = {
    css: "lightgraylist",
    type: "clean",
    rows: [
        {
            view: "list",
            css: "lightgraylist",
            id: "mylist",
            autowidth: true,
            scroll: false,
            data: ["Dashboard", "Users", "Products", "Locations"]
        },
        {},
        { view: "button", label: "Connected", autowidth: true, css: "greenbutton", type: "icon", icon: "wxi-check" }
    ]
}

const datatable = {
    view: "datatable",
    data: small_film_set,
    autoConfig: true,
    scroll: "y"
}

const form = {
    type: "clean",
    rows: [
        {
            view: "form",
            width: 250,
            elements: [
                {
                    rows: [
                        { template: "EDIT FILMS", type: "section" },
                        { view: "text", label: "Title" },
                        { view: "text", label: "Year" },
                        { view: "text", label: "Rating" },
                        { view: "text", label: "Votes" },
                        {
                            cols: [
                                { view: "button", label: "Add new", width: 100, css: "webix_primary" },
                                {},
                                { view: "button", label: "Clear", width: 100 },
                            ]
                        }
                    ]
                }
            ]
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
})