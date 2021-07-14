POSplus.SalesListing = function (params) {
    "use strict";

    var rooturl = window.sessionStorage.getItem("POSPlusApi");
    var token = window.sessionStorage.getItem("Token");
    var username = JSON.parse(window.sessionStorage.getItem("userInfo")), orderlistingreport = JSON.parse(window.sessionStorage.getItem("orderlistingreport"));
    var periodFrom = "", periodTo = "", orderdata = [], period = {}, subtotal = "", symbcurr = "", Indicator = ko.observable(false);

    function getDataGridInstance() {
        return $("#saleslistinggrid").dxDataGrid("instance");
    }
    function getsaleslisting() {
        Indicator(true);
        periodFrom = $("#startDate").dxDateBox("instance").option("value");
        periodTo = $("#endDate").dxDateBox("instance").option("value");
        if (periodFrom != "" && periodTo != "") {
            period.periodFrom = periodFrom;
            period.periodTo = periodTo;
            var info = JSON.stringify(period);
            $.ajax(
                {
                    url: rooturl + "Reports/GetSalesListing/" + token + "?EmployeeID=" + username.cAgentName,
                    type: "POST",
                    contentType: "application/json",
                    data: info,
                    success: function (data) {
                        periodFrom = "";
                        periodTo = "";
                        orderdata = data.item2;
                        Indicator(false);
                        getDataGridInstance().option("dataSource", orderdata);
                        window.sessionStorage.setItem("orderlistingreport", JSON.stringify(orderdata));
                        window.sessionStorage.setItem("reportperiod", JSON.stringify(period));
                        if (orderdata != null || orderdata) {
                            subtotal = 0
                            for (var i = 0; i < orderdata.length; i++) {
                                var totalcost = orderdata[i].total
                                subtotal += totalcost;
                            }
                            subtotal = currencyFormat(subtotal);
                        }
                        window.sessionStorage.setItem("currencysymb", data.item3);
                        $("#subbtotal").text(data.item3 + " " + subtotal);
                        $("#total").text(data.item3 + " " + subtotal);
                    },
                    error: function (error) {
                        Indicator(false);
                        console.log("error", error.statusText);
                    }
                });
        }
    }
    if (orderdata != null || orderdata) {
        subtotal = 0
        for (var i = 0; i < orderdata.length; i++) {
            var totalcost = orderdata[i].total;
            subtotal += totalcost;
        }
        subtotal = currencyFormat(subtotal);
    }
    function currencyFormat(num) {
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    $(function () {
        $("#saleslistinggrid").dxDataGrid({
            dataSource: orderdata,
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
            groupPanel: {
                visible: true
            }, grouping: {
                autoExpandAll: false,
            },
            hoverStateEnabled: true,
            showBorders: true,
            allowColumnResizing: true,
            columns: [
                {
                    width: "20%",
                    dataField: "orderNumber",
                    caption: "Code",
                    alignment: "left"
                },
                {
                    width: "15%",
                    dataField: "orderDate",
                    caption: "Date",
                    alignment: "left"
                },
                {
                    width: "20%",
                    dataField: "customer",
                    caption: "Customer",
                    alignment: "left"
                }, {
                    width: "15%",
                    dataField: "employeeID",
                    caption: "Employee",
                    alignment: "left",
                    groupIndex: 0
                },
                {
                    width: "25%",
                    dataField: "total",
                    caption: "Total",
                    alignment: "left",
                    dataType: "number",
                    format: currencyFormat
                },
                {
                    caption: "Actions",
                    type: "buttons",
                    width: "10%",
                    buttons: [{
                        hint: "View",
                        icon: "fa fa-eye",
                        onClick: function (e) {
                            window.sessionStorage.removeItem("orderNumberDetail");
                            var item = e.row.data.orderNumber;
                            window.sessionStorage.setItem("orderNumberDetail", item);
                            POSplus.app.navigate("OrderListingDetails", { root: false });
                            //e.component.refresh(true);
                            //e.event.preventDefault();
                        }
                    }]
                }

            ],
            summary: {
                groupItems: [{
                    column: "orderNumber",
                    summaryType: "count",
                    displayFormat: "{0} orders",
                }, {
                        column: "total",
                    summaryType: "sum",
                     valueFormat: currencyFormat,
                    showInGroupFooter: false,
                    alignByColumn: true
                }],
                totalItems: [{
                    column: "orderNumber",
                    summaryType: "count"
                }, {
                    column: "total",
                    summaryType: "sum",
                    valueFormat: currencyFormat
                }]
            }
        });

        if (typeof orderlistingreport !== "object" || orderlistingreport != null) {
            subtotal = 0
            for (var i = 0; i < orderlistingreport.length; i++) {
                var totalcost = orderlistingreport[i].total
                subtotal += totalcost;
            }
            subtotal = currencyFormat(subtotal);
        }
        symbcurr = window.sessionStorage.getItem("currencysymb");
        $("#subbtotal").text(symbcurr + " " + subtotal);
        $("#total").text(symbcurr + " " + subtotal);

        var startDate = $("#startDate").dxDateBox({
            placeholder: 'Enter Period From', width: '95%', value: periodFrom,
            showClearButton: true, onContentReady: clearButton, displayFormat: "dd/MM/yyyy",
            onValueChanged: function (e) {
                endDate.option("min", e.value);
            }
        }).dxDateBox("instance");
        var endDate = $("#endDate").dxDateBox({
            placeholder: 'Enter Period To', width: '95%', value: periodTo,
            showClearButton: true, onContentReady: clearButton, displayFormat: "dd/MM/yyyy",
            onValueChanged: function (e) {
                startDate.option("max", e.value);
            }
        }).dxDateBox("instance");
        if (typeof orderlistingreport !== "object" || orderlistingreport != null) {
            getDataGridInstance().option("dataSource", orderlistingreport);
            var searchperiod = JSON.parse(window.sessionStorage.getItem("reportperiod"));
            $("#startDate").dxDateBox("instance").option("value", searchperiod.periodFrom);
            $("#endDate").dxDateBox("instance").option("value", searchperiod.periodTo);
        }
        else {
        }
        if (orderlistingreport != null || orderlistingreport) {
            subtotal = 0
            for (var i = 0; i < orderlistingreport.length; i++) {
                var totalcost = orderlistingreport[i].total
                subtotal += totalcost;
            }
            subtotal = currencyFormat(subtotal);
            $("#subbtotal").text(symbcurr + " " + subtotal);
            $("#total").text(symbcurr + " " + subtotal);
        }
        else {

            $("#subbtotal").text(subtotal);
            $("#total").text(subtotal);
        }
        function clearButton(e) {
            e.component.element().find(".dx-icon-clear").click(function () {
                orderdata = [];
                subtotal = "0.00";
                $("#subbtotal").text(subtotal);
                $("#total").text(subtotal);
                window.sessionStorage.removeItem("orderlistingreport");
                window.sessionStorage.removeItem("currencysymb");
                window.sessionStorage.removeItem("reportperiod"); 
                getDataGridInstance().option("dataSource", orderdata);
            })
        }
        $("#subbtotal").text(subtotal);
        $("#total").text(subtotal);
    });
    return {
        getsaleslisting: getsaleslisting,
        Indicator: Indicator
    };
};