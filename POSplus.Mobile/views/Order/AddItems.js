POSplus.AddItems = function (params) {
    "use strict";

    var rooturl = window.sessionStorage.getItem("POSPlusApi");
    var token = window.sessionStorage.getItem("Token"),ordernumber = window.sessionStorage.getItem("Ordernumber");
    var itemname = ko.observable(""), price = ko.observable(""), discount = ko.observable(""), quantity = ko.observable(1), itemresult = JSON.parse(window.sessionStorage.getItem("itemssearchresult")), singleitemdata = {}, itemdata = [];
    var getcurrentitems = [], username = JSON.parse(window.sessionStorage.getItem("userInfo"));
    itemdata = JSON.parse(window.sessionStorage.getItem("itemstoorder"));
    var heldorder = window.sessionStorage.getItem("held");
    console.log("itemselect ", itemresult);
    console.log("itemselect2 ", itemdata);
    var viewModel = {
//  Put the binding properties here
    };
    if (itemresult != null) {
        itemname(itemresult.itemName);
        price(itemresult.price);
        discount();
    } 
    function getDataGridInstance() {
        return $("#itemsection").dxDataGrid("instance");
    }
    function continueorder(e) {
        e.event.preventDefault();
        e.event.stopPropagation();
        POSplus.app.navigate("Order", { root: true });
    }
    function deleteitem(ordernumber, orderlinenumber) {
        $.ajax(
            {
                url: rooturl + "Orders/DeleteOrderItem/" + token + "?Ordernumber=" + ordernumber + "&Orderlinenumber=" + orderlinenumber,
                type: "POST",
                contentType: "application/json",
                data: {},
                success: function (data) {

                },
                error: function (error) {
                    console.log(error.statusText);
                }
            });
    }
    function additemtoorder(e) {
        //console.log("singleitemdata.itemname", itemresult.itemId);
        if (itemresult == null || typeof itemresult.itemId === "undefined")
        {
        }
        else {
            getcurrentitems = JSON.parse(window.sessionStorage.getItem("itemstoorder"));
            if (getcurrentitems != null) {
                //alert("here")
                var itemexist = getcurrentitems.find(x => x.itemId == itemresult.itemId);
                if (itemexist != null || itemexist) {
                    var index = getcurrentitems.indexOf(itemexist);
                    itemexist.quantity += quantity();
                    getcurrentitems.splice(index, 1, itemexist);
                    window.sessionStorage.removeItem("itemstoorder");
                    window.sessionStorage.removeItem("itemssearchresult");
                    window.sessionStorage.setItem("itemstoorder", JSON.stringify(getcurrentitems));
                    itemresult = {};
                    singleitemdata = {};
                    itemname("");
                    price("");
                    quantity(1);
                    itemdata = JSON.parse(window.sessionStorage.getItem("itemstoorder"));
                    getDataGridInstance().option("dataSource", getcurrentitems);
                }
                else {
                    singleitemdata.itemId = itemresult.itemId;
                    singleitemdata.itemName = itemresult.itemName;
                    singleitemdata.price = itemresult.price;
                    singleitemdata.quantity = quantity();
                    singleitemdata.itemDescription = itemresult.itemDescription;
                    singleitemdata.itemCategoryId = itemresult.itemCategoryId;
                    singleitemdata.EmployeeId = username.cAgentName;
                    singleitemdata.orderNumber = ordernumber;
                    var index = ordernumber.indexOf("/");
                    var shiftid = ordernumber.slice(0, index);
                    singleitemdata.shiftId = shiftid;
                    window.sessionStorage.removeItem("itemssearchresult");
                    getcurrentitems = JSON.parse(window.sessionStorage.getItem("itemstoorder"));
                    itemdata = getcurrentitems ?? [];
                    itemdata.push(singleitemdata);
                    window.sessionStorage.setItem("itemstoorder", JSON.stringify(itemdata));
                    itemresult = {};
                    singleitemdata = {};
                    itemname("");
                    price("");
                    quantity(1);
                    itemdata = JSON.parse(window.sessionStorage.getItem("itemstoorder"));
                    getDataGridInstance().option("dataSource", itemdata);
                }
            }
            else {
                singleitemdata.itemId = itemresult.itemId;
                singleitemdata.itemName = itemresult.itemName;
                singleitemdata.price = itemresult.price;
                singleitemdata.quantity = quantity();
                singleitemdata.itemDescription = itemresult.itemDescription;
                singleitemdata.itemCategoryId = itemresult.itemCategoryId;
                singleitemdata.EmployeeId = username.cAgentName;
                singleitemdata.orderNumber = ordernumber;
                var index = ordernumber.indexOf("/");
                var shiftid = ordernumber.slice(0, index);
                singleitemdata.shiftId = shiftid;
                window.sessionStorage.removeItem("itemssearchresult");
                getcurrentitems = JSON.parse(window.sessionStorage.getItem("itemstoorder"));
                itemdata = getcurrentitems ?? [];
                itemdata.push(singleitemdata);
                window.sessionStorage.setItem("itemstoorder", JSON.stringify(itemdata));
                itemresult = {};
                singleitemdata = {};
                itemname("");
                price("");
                quantity(1);
                itemdata = JSON.parse(window.sessionStorage.getItem("itemstoorder"));
                getDataGridInstance().option("dataSource", itemdata);
            }
        }
    }
    //function changequantity(e) {
    //    console.log(e)
    //    var event = e.event;
    //    event.preventDefault();
    //    event.stopPropagation();
    //        alert(quantity());
    //}
    function searchitem() {
        POSplus.app.navigate("ItemSearch", { root: false });
    }
    $(function () {
        $("#itemsection").dxDataGrid({
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
                    width: "60%",
                    dataField: "itemName",
                    caption: "Item Name",
                    alignment: "left"
                },

                {
                    width: "15%",
                    dataField: "quantity",
                    caption: "Qty",
                    alignment: "left"
                },
                {
                 caption: "Actions",
                type: "buttons",
                width: "25%",
                    buttons: [
                        {
                            hint: "Reduce",
                            icon: "fa fa-minus",
                            onClick: function (e) {
                                var itemid = e.row.data.itemId;
                                var itemdatum = itemdata.find(x => x.itemId == itemid);
                                var index = itemdata.indexOf(itemdatum);
                                itemdatum.quantity -= 1;
                                if (itemdatum.quantity == 0) {
                                    itemdata.splice(index, 1);
                                    if (typeof heldorder !== "object" && heldorder == "1") {
                                        if (e.row.data.orderLineNumber == "undefined" || typeof e.row.data.orderLineNumber === "undefined" || e.row.data.orderLineNumber == "") {
                                        }
                                        else {
                                            deleteitem(e.row.data.orderNumber, e.row.data.orderLineNumber);
                                        }
                                    }
                                }
                                else {
                                    itemdata.splice(index, 1, itemdatum);
                                }
                                window.sessionStorage.setItem("itemstoorder", JSON.stringify(itemdata));
                                getDataGridInstance().option("dataSource", itemdata);

                            }
                        },
                        {
                    hint: "Remove",
                    icon: "fa fa-trash",
                    onClick: function (e) {
                        var itemid = e.row.data.itemId;
                        var itemdatum = itemdata.find(x => x.itemId == itemid);
                        var index = itemdata.indexOf(itemdatum);
                        itemdata.splice(index, 1);
                            if (typeof heldorder !== "object" && heldorder == "1") {
                                if (e.row.data.orderLineNumber == "undefined" || typeof e.row.data.orderLineNumber === "undefined" || e.row.data.orderLineNumber == "") {
                                }
                                else {
                                    deleteitem(e.row.data.orderNumber, e.row.data.orderLineNumber);
                                }
                            }
                        window.sessionStorage.setItem("itemstoorder", JSON.stringify(itemdata));
                        getDataGridInstance().option("dataSource", itemdata);
                        //e.component.refresh(true);
                        //e.event.preventDefault();
                    }
                }]
                },

            ]
        })
    });
    return {
        searchitem: searchitem,
        additemtoorder: additemtoorder,
        itemname: itemname,
        quantity: quantity,
        price: price,
        discount: discount,
        continueorder: continueorder
    };
};