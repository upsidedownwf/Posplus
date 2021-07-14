POSplus.OrderListingDetails = function (params) {
    "use strict";
    var rooturl = window.sessionStorage.getItem("POSPlusApi"), ordernumberdetail= window.sessionStorage.getItem("orderNumberDetail");
    var token = window.sessionStorage.getItem("Token");
    var itemdata = [], customername = "", table = ko.observable(""), tableDescription = "", subtotal;
    var username = {},
        username = JSON.parse(window.sessionStorage.getItem("userInfo"));
   
    function formatdate(value) {
        var date = new Date(value);
        var dd = date.getDate();
        var mm = date.getMonth() + 1;
        var yy = date.getFullYear();
        if (mm < 10) {
            mm = '0' + mm;
        }
        if (dd < 10) {
            dd = '0' + dd;
        }
        var today = dd + "/" + mm + "/" + yy;
        return today
    }
    var viewModel = {
        //  Put the binding properties here
    };
    
    function currencyFormat(num) {
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    $(function (e) {
        $("#currencyDropdown").dxTextBox({
            readOnly: true
        });
        $("#customerValue").dxTextBox({
            readOnly: true
        });
        $("#orderdetailsgrid").dxDataGrid({
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
                    width: "50%",
                    dataField: "itemName",
                    caption: "Item",
                    alignment: "left"
                },
                {
                    width: "15%",
                    dataField: "quantity",
                    caption: "Qty",
                    alignment: "left"
                },
                {
                    width: "35%",
                    dataField: "price",
                    caption: "Price",
                    alignment: "left",
                    dataType: "number",
                    format: currencyFormat
                }
            ], summary: {
                totalItems: [{
                    column: "itemName",
                    summaryType: "count"
                }, {
                    column: "price",
                    summaryType: "sum",
                    displayFormat: "Unit Price Sum: {0} ",
                    valueFormat: currencyFormat
                }]
            }
        });
        function getDataGridInstance() {
            return $("#orderdetailsgrid").dxDataGrid("instance");
        }
        if (typeof ordernumberdetail !== "object") {
            $.ajax(
                {
                    url: rooturl + "Orders/GetOrdersByOrderNumber/" + token + "?EmployeeID=" + username.cAgentName + "&OrderNumber=" + ordernumberdetail,
                    type: "GET",
                    success: function (data) {
                        console.log("item data", data);
                        itemdata = data.item2;
                        if (data.item2 != null || data.item2) {
                            subtotal = 0
                            for (var i = 0; i < data.item2.length; i++) {
                                var totalcost = data.item2[i].price * data.item2[i].quantity
                                subtotal += totalcost;
                            }
                            subtotal = currencyFormat(subtotal);
                        }
                        var symbcurr = window.sessionStorage.getItem("currencysymb");
                        $("#subtotalde").text(symbcurr + " " + subtotal);
                        $("#totalde").text(symbcurr + " " + subtotal);
                        getDataGridInstance().option("dataSource", itemdata);
                        $("#currencyDropdown").dxTextBox("instance").option("value", data.item2[0].currencyId);
                        var index = data.item2[0].tableId.indexOf("|");
                        tableDescription = data.item2[0].tableId.slice(index + 1);
                        table(tableDescription);
                        var index1 = data.item2[0].customerId.indexOf("|");
                        customername = data.item2[0].customerId.slice(index1 + 1);
                        $("#customerValue").dxTextBox("instance").option("value", customername);
                        $("#one").html("<strong>Order Number: </strong>" + data.item2[0].orderNumber);
                        $("#two").html("<strong>Order Date: </strong>" + formatdate(data.item2[0].transDateTime));
                        $("#one").html("<strong>Order Number: </strong>" + data.item2[0].orderNumber);
                    },
                    error: function (error) {
                        alert(error.statusText);
                    }
                });
        }
    });
    return {
        table: table
    };
};