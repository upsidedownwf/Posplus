POSplus.Recall = function (params) {
    "use strict";
    var rooturl = window.sessionStorage.getItem("POSPlusApi");
    var token = window.sessionStorage.getItem("Token");
    var itemdata = [], itemdatas = [], username = {}, singleitemdata = {}, Indicator = ko.observable(false);
    username = JSON.parse(window.sessionStorage.getItem("userInfo"));
   
    var viewModel = {
        //  Put the binding properties here
    };
    function currencyFormat(num) {
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    function getDataGridInstance() {
        return $("#recallordergrid").dxDataGrid("instance");
    }

    $(function () {
        $("#recallordergrid").dxDataGrid({
            dataSource: itemdata,
            loadPanel: {
                enabled: true
            },
            scrolling: {
                mode: "virtual",
                rowRenderingMode: "virtual"
            },
            searchPanel: {
                visible: true,
                width: "100vw",
                placeholder: "Search..."
            },
            hoverStateEnabled: true,
            showBorders: true,
            columns: [

                {
                    width: "25%",
                    dataField: "orderNumber",
                    caption: "Order Number",
                    alignment: "left"
                },
                {
                    width: "25%",
                    dataField: "customer",
                    caption: "Customer",
                    alignment: "left"
                },
                {
                    width: "20%",
                    dataField: "orderDate",
                    caption: "Date",
                    alignment: "left"
                },
                {
                    width: "15%",
                    dataField: "total",
                    caption: "Total",
                    alignment: "left",
                    dataType: "number",
                    format: currencyFormat
                },
                {
                    caption: "Recall",
                    type: "buttons",
                    width: "15%",
                    buttons: [{
                        hint: "Recall",
                        icon: "fa fa-undo",
                        onClick: function (e) {
                            Indicator(true);
                            window.sessionStorage.removeItem("itemtoorder");
                            window.sessionStorage.removeItem("held");
                            var item = e.row.data.orderNumber;
                            $.ajax(
                                {
                                    url: rooturl + "Orders/GetOrdersByOrderNumber/" + token + "?EmployeeID=" + username.cAgentName + "&OrderNumber=" + item,
                                    type: "GET",
                                    success: function (data) {
                                        $.each(data.item2, function (index, itemresult) {
                                            singleitemdata.itemId = itemresult.itemId;
                                            singleitemdata.itemName = itemresult.itemName;
                                            singleitemdata.price = itemresult.price;
                                            singleitemdata.quantity = itemresult.quantity;
                                            singleitemdata.itemDescription = itemresult.itemDescription;
                                            singleitemdata.itemCategoryId = itemresult.itemCategoryId;
                                            singleitemdata.EmployeeId = itemresult.employeeId;
                                            singleitemdata.orderNumber = itemresult.orderNumber;
                                            singleitemdata.shiftId = itemresult.shiftId;
                                            singleitemdata.orderLineNumber = itemresult.orderLineNumber;
                                            itemdatas.push(singleitemdata);
                                            singleitemdata = {};

                                        });
                                        window.sessionStorage.setItem("held", "1");
                                        window.sessionStorage.setItem("Ordernumber", item);
                                        var customer = {};
                                        var index1 = data.item2[0].customerId.indexOf("|");
                                        customer.customerid = data.item2[0].customerId.slice(0, index1);
                                        customer.customername = data.item2[0].customerId.slice(index1 + 1);
                                        window.sessionStorage.setItem("customer", JSON.stringify(customer));
                                        var table = {};
                                        if (data.item2[0].tableId == null) { }
                                        else {
                                            var index = data.item2[0].tableId.indexOf("|");
                                            table.tableId = data.item2[0].tableId.slice(0, index);
                                            table.tableDescription = data.item2[0].tableId.slice(index + 1);
                                            window.sessionStorage.setItem("selectedtable", JSON.stringify(table))
                                        }
                                        window.sessionStorage.setItem("selectedcurrencyid", data.item2[0].currencyId);
                                        window.sessionStorage.setItem("itemstoorder", JSON.stringify(itemdatas));
                                        Indicator(false);
                                        POSplus.app.navigate("Order", { root: true });
                                    },
                                    error: function (error) {
                                        Indicator(false);
                                        alert(error.statusText);
                                    }
                                });
                            //e.component.refresh(true);
                            //e.event.preventDefault();
                        }
                    }]
                },
            ]
        });
        if (username != null || username) {
            $.ajax(
                {
                    url: rooturl + "Orders/GetHeldOrdersDetail/" + token + "?EmployeeID=" + username.cAgentName,
                    type: "GET",
                    success: function (data) {
                        itemdata = data.item2;
                        getDataGridInstance().option("dataSource", itemdata);
                    },
                    error: function (error) {
                        console.log(error.statusText);
                    }
                });
        }
    });
    return {
        Indicator: Indicator
    };
};