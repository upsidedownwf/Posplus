POSplus.Order = function (params) {
    "use strict";
    var rooturl = window.sessionStorage.getItem("POSPlusApi");
    var token = window.sessionStorage.getItem("Token");
    var firstName = "", username = {};
    var ordernumber = window.sessionStorage.getItem("Ordernumber"), Indicator = ko.observable(false), Indicators = ko.observable(false),currentshift = window.sessionStorage.getItem("currentShift");

    username = JSON.parse(window.sessionStorage.getItem("userInfo"));
    var customer, customerid = "", subtotal = "", currency = window.sessionStorage.getItem("selectedcurrencyid"), table = ko.observable("");
    var customersearch = {};
    customersearch = JSON.parse(window.sessionStorage.getItem("customer"));
    var itemdata = [], tabletosend = "", urls="";
    var heldorder = window.sessionStorage.getItem("held");
   
    itemdata = JSON.parse(window.sessionStorage.getItem("itemstoorder"));
    if (customersearch == null) {
        customer = "CASH";
        customerid = "CASH";
    }
    else {
        customer = customersearch.customername;
        customerid = customersearch.customerid;
    }
    var tables = JSON.parse(window.sessionStorage.getItem("selectedtable"));
    if (tables != null ) {
        table(tables.tableDescription);
    }
    if (itemdata != null || itemdata) {
        subtotal=0
        for (var i = 0; i < itemdata.length; i++) {
            var totalcost = itemdata[i].price * itemdata[i].quantity
            subtotal += totalcost;
        }
        subtotal = currencyFormat(subtotal);
    }
    function currencyFormat(num) {
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    function gettable() {
        POSplus.app.navigate("Tables", { root: false });
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
    function showDialog(mtitle, Mymessage, timeout) {

        var myDialog = DevExpress.ui.dialog.custom({
            title: mtitle,
            message: Mymessage,
            buttons: [{ text: "OK" }]
        })
        myDialog.show();
        setTimeout(function () { myDialog.hide(); }, timeout);
    }
    
    function placeorder() {
        if (itemdata != null || itemdata) {
            Indicator(true);
            var order = JSON.stringify(itemdata);
            if (tables == null) {
                tabletosend = "";
            }
            else {
                tabletosend = tables.tableId;
            }
            if (heldorder == "undefined" || typeof heldorder === "object" ) {
                urls = rooturl + "Orders/" + token + "?Customer=" + customerid + "&currency=" + currency + "&table=" + tabletosend;
            }
            else if (heldorder == "1") {
                urls = rooturl + "Orders/UpdateHoldOrder/" + token + "?Customer=" + customerid + "&currency=" + currency + "&table=" + tabletosend;
            }
                $.ajax(
                    {
                        url: urls,
                        type: "POST",
                        contentType: "application/json",
                        data: order,
                        success: function (data) {
                            console.log("item data", data);
                            itemdata = [];
                            getDataGridInstance().option("dataSource", itemdata);
                            table("");
                            customersearch = {}
                            subtotal = ""
                            currency = "";
                            customer = "CASH";
                            customerid = "CASH";
                            // window.sessionStorage.removeItem("Ordernumber");
                            window.sessionStorage.removeItem("held");
                            window.sessionStorage.removeItem("itemstoorder");
                            window.sessionStorage.removeItem("selectedtable");
                            window.sessionStorage.removeItem("customer");
                            $("#customerValue").dxTextBox("instance").option("value", customer);
                            $("#subbtotal").text("");
                            $("#total").text("");
                            window.sessionStorage.removeItem("selectedcurrencyid");
                            window.sessionStorage.setItem("Ordernumber", data.item1.message);
                            if (currency == "" || currency == null || typeof currency === "object") {
                                $.ajax(
                                    {
                                        url: rooturl + "Orders/GetDefaultCurrency/" + token,
                                        type: "GET",
                                        async:true,
                                        success: function (data) {
                                            console.log("item data", data);
                                            $("#currencyDropdown").dxTextBox("instance").option("value", data.item2);
                                            window.sessionStorage.setItem("selectedcurrencyid", data.item2);
                                        },
                                        error: function (error) {
                                            console.log(error.statusText);
                                        }
                                    });
                            }
                            $("#one").html("<strong>Order Number: </strong>" + data.item1.message);
                            var message = "<p><center> Order <span style=\"color:dodgerblue\"><strong>" + data.item2[0].orderNumber + "</strong></span> has been placed successfully!</center></p>";
                            Indicator(false);
                            showDialog("", message, 90000);

                        },
                        error: function (error) {
                            Indicator(false);
                            console.log(error.statusText);
                        }
                    });

        }
        else {

        }
   
    }
    function holdorder() {
        if (itemdata != null || itemdata) {
            Indicators(true);
            var order = JSON.stringify(itemdata);
            if (tables == null) {
                tabletosend = "";
            }
            else {
                tabletosend=  tables.tableId;
            }
            $.ajax(
                {
                    url: rooturl + "Orders/HoldOrder/" + token + "?Customer=" + customerid + "&currency=" + currency + "&table=" + tabletosend,
                    type: "POST",
                    contentType: "application/json",
                    data: order,
                    success: function (data) {
                        console.log("item data", data);
                        itemdata = [];
                        getDataGridInstance().option("dataSource", itemdata);
                        table("");
                        customersearch = {}
                        subtotal = ""
                        currency = "";
                        customer = "CASH";
                        customerid = "CASH";
                        // window.sessionStorage.removeItem("Ordernumber");
                        window.sessionStorage.removeItem("held");
                        window.sessionStorage.removeItem("itemstoorder");
                        window.sessionStorage.removeItem("selectedtable");
                        window.sessionStorage.removeItem("customer");
                        $("#customerValue").dxTextBox("instance").option("value", customer);
                        $("#subbtotal").text("");
                        $("#total").text("");
                        window.sessionStorage.removeItem("selectedcurrencyid");
                        window.sessionStorage.setItem("Ordernumber", data.item1.message);
                        if (currency == "" || currency == null || typeof currency === "object") {
                            $.ajax(
                                {
                                    url: rooturl + "Orders/GetDefaultCurrency/" + token,
                                    type: "GET",
                                    async: true,
                                    success: function (data) {
                                        console.log("item data", data);
                                        $("#currencyDropdown").dxTextBox("instance").option("value", data.item2);
                                        window.sessionStorage.setItem("selectedcurrencyid", data.item2);
                                    },
                                    error: function (error) {
                                        console.log(error.statusText);
                                    }
                                });
                        }
                        $("#one").html("<strong>Order Number: </strong>" + data.item1.message);
                        var message = "<p><center> Order <span style=\"color:dodgerblue\"><strong>" + data.item2[0].orderNumber + "</strong></span> has been placed on hold!</center></p>";
                        Indicators(false);
                        showDialog("", message, 90000);

                    },
                    error: function (error) {
                        Indicators(false);
                        console.log(error.statusText);
                    }
                });

        }
        else {

        }

    }
    var viewModel = {
//  Put the binding properties here
    };
    if (currentshift && typeof currentshift !== "object") {
        var index = currentshift.indexOf("|");
        var shiftdate = currentshift.slice(0, index);

        var date = shiftdate.split(" ");
        var today = date[0];
    }

    function additem() {
        POSplus.app.navigate("AddItems", { root: true });
    }
    function searchcustomer() {
        POSplus.app.navigate("CustomerSearch", { root: false });
    }
    function searchcurrency() {
        POSplus.app.navigate("Currency", { root: false });
    }
    function getDataGridInstance() {
        return $("#section").dxDataGrid("instance");
    }
   // return viewModel;
    var actions = [
        { id: "NGN", text: "NGN" }
    ];
    $(function () { 
        if (typeof ordernumber === "object") {
            if (username != null || username) {
                $.ajax(
                    {
                        url: rooturl + "Orders/GetOrderNumber/" + token + "?EmployeeID=" + username.cAgentName,
                        type: "GET",
                        success: function (data) {
                            console.log("item data", data);
                            ordernumber = data.item2;
                            $("#onetext").text(data.item2);
                            window.sessionStorage.setItem("Ordernumber", ordernumber);
                        },
                        error: function (error) {
                            console.log(error.statusText);
                        }
                    });
            }
        }
        else {
            $("#onetext").text(ordernumber);
        }
        $("#currencyDropdown").dxTextBox({
            readOnly: true,
            value: currency,
            onFocusIn: searchcurrency
        });
        if (currency == "" || currency == null || typeof currency === "object") {
            $.ajax(
                {
                    url: rooturl + "Orders/GetDefaultCurrency/" + token,
                    type: "GET",
                    success: function (data) {
                        console.log("item data", data);
                        $("#currencyDropdown").dxTextBox("instance").option("value", data.item2);
                        window.sessionStorage.setItem("selectedcurrencyid", data.item2);
                    },
                    error: function (error) {
                        console.log(error.statusText);
                    }
                });
        }
        else {
            $("#currencyDropdown").dxTextBox("instance").option("value", currency);
        }
        $("#section").dxDataGrid({
            dataSource: itemdata,
            loadPanel: {
                enabled: true
            },
            scrolling: {
                mode: "virtual",
                rowRenderingMode: "virtual"
            },
            //groupPanel: {
            //    visible: true
            //},
            //scrolling: {
            //    columnRenderingMode: "virtual"
            //},
            hoverStateEnabled: true,
            showBorders: true,
            columns: [
                {
                    width: "45%",
                    dataField: "itemName",
                    caption: "Item Name",
                    alignment: "left"
                },

                {
                    width: "20%",
                    dataField: "price",
                    caption: "Price",
                    alignment: "left",
                    dataType: "number",
                    format:  currencyFormat
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
                    width: "20%",
                    buttons: [
                        {
                            hint: "Reduce",
                            icon: "fa fa-minus",
                            onClick: function (e) {

                                console.log("typeof heldorder", typeof heldorder);
                                console.log("typeof orderline", typeof e.row.data.orderLineNumber);
                                console.log("value of orderline",  e.row.data.orderLineNumber);
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
                                    subtotal = 0
                                    for (var i = 0; i < itemdata.length; i++) {
                                        var totalcost = itemdata[i].price * itemdata[i].quantity
                                        subtotal += totalcost;
                                    }
                                    subtotal = currencyFormat(subtotal);
                                
                                $("#subbtotal").text(subtotal);
                                $("#total").text(subtotal);
                                window.sessionStorage.setItem("itemstoorder", JSON.stringify(itemdata));
                                getDataGridInstance().option("dataSource", itemdata);
                                //e.component.refresh(true);
                                //e.event.preventDefault();
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
                                subtotal = 0
                                for (var i = 0; i < itemdata.length; i++) {
                                    var totalcost = itemdata[i].price * itemdata[i].quantity
                                    subtotal += totalcost;
                                }
                                subtotal = currencyFormat(subtotal);
                                $("#subbtotal").text(subtotal);
                                $("#total").text(subtotal);
                                window.sessionStorage.setItem("itemstoorder", JSON.stringify(itemdata));
                                getDataGridInstance().option("dataSource", itemdata);
                                //e.component.refresh(true);
                                //e.event.preventDefault();
                            }
                        }
                    ]
                }
            ]
        })
        $("#customerValue").dxTextBox({
            value: customer,
            readOnly: true,
            onFocusIn: searchcustomer
        });

        $("#customerValue").dxTextBox("instance").option("value", customer);
        $("#two").html("<strong>Order Date: </strong>" + today);
        $("#subbtotal").text(subtotal);
        $("#total").text(subtotal);
        $("#discount").text();
        $("#tax").text();
    });

    return {
        additem: additem,
        searchcustomer: searchcustomer,
        placeorder: placeorder,
        gettable: gettable,
        table: table,
        holdorder: holdorder,
        Indicator: Indicator,
        Indicators: Indicators
    }

};