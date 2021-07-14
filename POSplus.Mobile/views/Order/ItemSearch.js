POSplus.ItemSearch = function (params) {
    "use strict";

    var rooturl = window.sessionStorage.getItem("POSPlusApi");
    var token = window.sessionStorage.getItem("Token");
    var itemsfamily = JSON.parse(window.sessionStorage.getItem("itemsfamily")), itemscategory= JSON.parse(window.sessionStorage.getItem("itemscategory"));
    var name = ko.observable(""), code = ko.observable(""), upc = ko.observable(""), family = ko.observable(""), category = ko.observable(""), itemdata = [], items = {}, Indicator = ko.observable(false);
    
    if (itemsfamily != null) {
        family(itemsfamily.familyid);
    }
    else {
        family("");
    }
    if (itemscategory != null) {
        category(itemscategory.categoryid);
    }
    else {
        category("")
    }
    var viewModel = {
//  Put the binding properties here
    };
    function getDataGridInstance() {
        return $("#itemsearchgrid").dxDataGrid("instance");
    }
    // name, code, phone, email= ko
    function search(value) {
        $.ajax(
            {
                url: rooturl + "InventoryItems/" + token + "?SearchValue=" + value,
                type: "GET",
                success: function (data) {
                    console.log("item data", data);
                    itemdata = data.item2;
                    Indicator(false);
                    getDataGridInstance().option("dataSource", itemdata);
                },
                error: function (error) {
                    Indicator(false);
                    alert(error.statusText);
                }
            });
    }
    function focusinname() {
        upc("");
        code("");
        window.sessionStorage.removeItem("itemscategory");
        window.sessionStorage.removeItem("itemsfamily");
        family("");
        category("");
    }
    function focusinupc() {
        name("");
        code("");
        window.sessionStorage.removeItem("itemscategory");
        window.sessionStorage.removeItem("itemsfamily");
        family("");
        category("");
    }
    function focusincode() {
        upc("");
        name("");
        window.sessionStorage.removeItem("itemscategory");
        window.sessionStorage.removeItem("itemsfamily");
        family("");
        category("");
    }
    function gotofamily() {
        category("");
        POSplus.app.navigate("ItemsFamily", { root: false });
       
    }
    function gotocategory() {
        family("");
        POSplus.app.navigate("ItemsCategory", { root: false });
    }
    function searchitem() {
        Indicator(true);
        if (name() != "") {
            search(name());

        }
        else if (code() != "") {
            search(code());
        }
        else if (upc() != "") {
            search(upc());
        }
        else if (family() != "") {
            window.sessionStorage.removeItem("itemscategory");
            search(family());
        }
        else if (category() != "") {
            window.sessionStorage.removeItem("itemsfamily"); 
            search(category());
        }

    }
    function clearButton(e) {
        e.component.element().find(".dx-icon-clear").click(function () {
            itemdata = [];
            getDataGridInstance().option("dataSource", itemdata);
        })
    }
    function currencyFormat(num) {
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    $(function () {
        $("#itemsearchgrid").dxDataGrid({
            dataSource: itemdata,
            loadPanel: {
                enabled: true
            },
            scrolling: {
                mode: "virtual",
                rowRenderingMode: "virtual"
            },
            hoverStateEnabled: true,
            showBorders: true,
            columns: [
                {
                    width: "55%",
                    dataField: "itemName",
                    caption: "Item Name",
                    alignment: "left"
                },

                {
                    width: "25%",
                    dataField: "price",
                    caption: "Price",
                    alignment: "left",
                    dataType: "number",
                    format: currencyFormat
                },
                {
                    caption: "Select",
                    type: "buttons",
                    width: "20%",
                    buttons: [{
                        hint: "Select",
                        icon: "check",
                        onClick: function (e) {
                            name("");
                            code("");
                            upc("");
                            var item = e.row.data.itemId;
                            items = itemdata.find(x => x.itemId == item);
                            window.sessionStorage.setItem("itemssearchresult", JSON.stringify(items));
                            upc("");
                            name("");
                            code("");
                            window.sessionStorage.removeItem("itemscategory");
                            window.sessionStorage.removeItem("itemsfamily");
                            family("");
                            category("");
                            POSplus.app.navigate("AddItems", { root: true });
                            //e.component.refresh(true);
                        }
                    }]
                }

            ]
        })
    });
    return {
        clearButton: clearButton,
        code: code,
        upc: upc,
        name: name,
        searchitem: searchitem,
        family: family,
        category: category,
        gotocategory: gotocategory,
        gotofamily: gotofamily,
        focusinname: focusinname,
        focusincode: focusincode,
        focusinupc: focusinupc,
        Indicator: Indicator
    };
};