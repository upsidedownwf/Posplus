POSplus.Customers = function (params) {
    "use strict";
    var rooturl = window.sessionStorage.getItem("POSPlusApi");
    var token = window.sessionStorage.getItem("Token");
    var itemdata = [];
    $.ajax(
        {
            url: rooturl + "CustomerInformation/" + token,
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
    function addcustomer() {
        POSplus.app.navigate("AddCustomer", { root: false });
    }
    function getDataGridInstance() {
        return $("#addcustomersections").dxDataGrid("instance");
    }
    $(function () {
        $("#addcustomersections").dxDataGrid({
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
                    width: "40%",
                    dataField: "customerName",
                    caption: "Name",
                    alignment: "left"
                },
                {
                    width: "40%",
                    dataField: "customerEmail",
                    caption: "Email",
                    alignment: "left"
                },
                {
                    width: "20%",
                    dataField: "customerPhone",
                    caption: "Phone",
                    alignment: "left"
                }
                

            ]
        })
    });
    return {
        addcustomer: addcustomer
    };
};