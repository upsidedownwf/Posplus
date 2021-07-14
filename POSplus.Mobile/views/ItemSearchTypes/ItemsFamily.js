POSplus.ItemsFamily = function (params) {
    "use strict";
    var rooturl = window.sessionStorage.getItem("POSPlusApi");
    var token = window.sessionStorage.getItem("Token");
    var itemdata = [], itemsFamilies = {};
    $.ajax(
        {
            url: rooturl + "InventoryItems/GetItemFamilies/" + token,
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
        return $("#itemfamilygrid").dxDataGrid("instance");
    }

    $(function () {
        $("#itemfamilygrid").dxDataGrid({
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
                    width: "80%",
                    dataField: "familyName",
                    caption: "Family Name",
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
                            window.sessionStorage.removeItem("itemsfamily");
                            var item = e.row.data.itemFamilyId;
                            var itemName = e.row.data.familyName;
                            itemsFamilies.familyid = item;
                            itemsFamilies.familyname = itemName;
                            window.sessionStorage.removeItem("itemscategory");
                            window.sessionStorage.setItem("itemsfamily", JSON.stringify(itemsFamilies));
                            POSplus.app.navigate("ItemSearch", { root: false });
                            //e.component.refresh(true);
                            //e.event.preventDefault();
                        }
                    }]
                }

            ]
        })
    });
};