POSplus.ItemsCategory = function (params) {
    "use strict";
    var rooturl = window.sessionStorage.getItem("POSPlusApi");
    var token = window.sessionStorage.getItem("Token");
    var itemdata = [], itemsCategories = {};
   
    $.ajax(
        {
            url: rooturl + "InventoryItems/GetItemCategories/" + token,
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
        return $("#itemcategorygrid").dxDataGrid("instance");
    }
       
    $(function () {
        $("#itemcategorygrid").dxDataGrid({
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
                    dataField: "categoryName",
                    caption: "Category Name",
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
                            window.sessionStorage.removeItem("itemscategory");
                            var item = e.row.data.itemCategoryId;
                            var itemName = e.row.data.categoryName;
                            itemsCategories.categoryid = item;
                            itemsCategories.categoryname = itemName;
                            window.sessionStorage.removeItem("itemsfamily");
                            window.sessionStorage.setItem("itemscategory", JSON.stringify(itemsCategories));
                            POSplus.app.navigate("ItemSearch", { root: false });
                            //e.component.refresh(true);
                            //e.event.preventDefault();
                        }
                    }]
                },
            ]
        })
    });
    return viewModel;
};