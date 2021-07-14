POSplus.Tables = function (params) {
    "use strict";
    var rooturl = window.sessionStorage.getItem("POSPlusApi");
    var token = window.sessionStorage.getItem("Token");
    var itemdata = [], table = {}, username = {};
    username = JSON.parse(window.sessionStorage.getItem("userInfo"));
    $.ajax(
        {
            url: rooturl + "Orders/GetTables/" + token + "?EmployeeID=" + username.cAgentName,
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
        return $("#tablesgrid").dxDataGrid("instance");
    }

    $(function () {
        $("#tablesgrid").dxDataGrid({
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
                    dataField: "tableId",
                    caption: "Code",
                    alignment: "left"
                },
                {
                    width: "50%",
                    dataField: "tableDescription",
                    caption: "Description",
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
                            window.sessionStorage.removeItem("selectedtable");
                            var item = e.row.data.tableId;
                            table.tableId = item;
                            table.tableDescription = e.row.data.tableDescription;
                            window.sessionStorage.setItem("selectedtable", JSON.stringify(table));
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