POSplus.ShiftType = function (params) {
    "use strict";
    var rooturl = window.sessionStorage.getItem("POSPlusApi");
    var token = window.sessionStorage.getItem("Token");
    var itemdata = [], ShiftType = {};
    $.ajax(
        {
            url: rooturl + "Shifts/GetShiftType/" + token,
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
        return $("#shifttypegrid").dxDataGrid("instance");
    }

    $(function () {
        $("#shifttypegrid").dxDataGrid({
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
                width: 350,
                placeholder: "Search..."
            },
            hoverStateEnabled: true,
            showBorders: true,
            columns: [
                {
                    width: "80%",
                    dataField: "shiftTypeId",
                    caption: "ShiftType ID",
                    alignment: "left"
                },
                {
                    caption: "Select",
                    type: "buttons",
                    width: "20%",
                    buttons: [{
                        hint: "Select",
                        icon: "check",
                        onClick: function (e) {
                            window.sessionStorage.removeItem("selectedShiftType");
                            var item = e.row.data.shiftTypeId;
                            ShiftType.shiftTypeId = item;
                            ShiftType.shiftTypeDescription = e.row.data.shiftTypeDescription;
                            window.sessionStorage.setItem("selectedShiftType", JSON.stringify(ShiftType));
                            POSplus.app.navigate("OpenShift", { root: true });
                            //e.component.refresh(true);
                            //e.event.preventDefault();
                        }
                    }]
                }

            ]
        })
    });
};