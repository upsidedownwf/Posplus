POSplus.Currency = function (params) {
    "use strict";
    var rooturl = window.sessionStorage.getItem("POSPlusApi");
    var token = window.sessionStorage.getItem("Token");
    var itemdata = [], currency = "";
    $.ajax(
        {
            url: rooturl + "Orders/GetAllCurrencies/" + token,
            type: "GET",
            success: function (data) {
                console.log("item data", data);
                itemdata = data.item2;
                getDataGridInstance().option("dataSource", itemdata);
            },
            error: function (error) {
                alert(error.statusText);
            }
        });

    var viewModel = {
        //  Put the binding properties here
    };
    function getDataGridInstance() {
        return $("#currencygrid").dxDataGrid("instance");
    }

    $(function () {
        $("#currencygrid").dxDataGrid({
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
                    dataField: "currencyId",
                    caption: "Code",
                    alignment: "left"
                },
                {
                    width: "50%",
                    dataField: "currencyType",
                    caption: "Currency Type",
                    alignment: "left"
                },
                {
                    caption: "Select",
                    type: "buttons",
                    width: "25%",
                    buttons: [{
                        hint: "Select",
                        icon: "check",
                        onClick: function (e) {
                            window.sessionStorage.removeItem("selectedcurrencyid");
                            var item = e.row.data.currencyId;
                            currency = item;
                            window.sessionStorage.setItem("selectedcurrencyid", currency);
                            POSplus.app.navigate("Order", { root: true });
                            //e.component.refresh(true);
                            //e.event.preventDefault();
                        }
                    }]
                }

            ]
        })
    });
};