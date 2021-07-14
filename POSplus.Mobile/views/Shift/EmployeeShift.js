POSplus.EmployeeShift = function (params) {
    "use strict";
    var rooturl = window.sessionStorage.getItem("POSPlusApi");
    var token = window.sessionStorage.getItem("Token");
    var itemdata = [], employee = "";

    var viewModel = {
        //  Put the binding properties here
    };
    function getDataGridInstance() {
        return $("#employeesgrid").dxDataGrid("instance");
    }

    $(function () {
        $("#employeesgrid").dxDataGrid({
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
                    dataField: "cAgentName",
                    caption: "Employee ID",
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
                            window.sessionStorage.removeItem("selectedemployeeshift");
                            var item = e.row.data.cAgentName;
                            employee = item;
                            window.sessionStorage.setItem("selectedemployeeshift", employee);
                            POSplus.app.navigate("OpenShift", { root: true });
                            //e.component.refresh(true);
                            //e.event.preventDefault();
                        }
                    }]
                }

            ]
        });

        $.ajax(
            {
                url: rooturl + "Shifts/" + token,
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
    });
};