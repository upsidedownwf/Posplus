POSplus.CustomerSearch = function (params) {
    "use strict";

    var viewModel = {
//  Put the binding properties here
    };

    var rooturl = window.sessionStorage.getItem("POSPlusApi");
    var token = window.sessionStorage.getItem("Token");
   var user = JSON.parse(window.sessionStorage.getItem("userInfo"));
    var name = ko.observable(""), code = ko.observable(""), phone = ko.observable(""), email = ko.observable(""), customerdata = [], customer = {}, Indicator = ko.observable(false);

    function addcustomer() {
        POSplus.app.navigate("AddCustomer", {root: false });
    }
    function getDataGridInstance() {
        return $("#customergrid").dxDataGrid("instance");
    }
    function focusincode() {
        name("");
        phone("");
        email("");
    }
    function focusinname() {
        phone("");
        code("");
        email("");
    }
    function focusinemail() {
        name("");
        code("");
        phone("");
    }
    function focusinphone() {
        name("");
        code("");
        email("");
    }
    // name, code, phone, email= ko
    function search(value) {
            $.ajax(
                {
                    url: rooturl + "CustomerInformation/GetByValue/" + token + "?SearchValue=" + value,
                    type: "GET",
                    success: function (data) {
                        customerdata = data.item2;
                        Indicator(false);
                        getDataGridInstance().option("dataSource", customerdata);
                    },
                    error: function (error) {
                        Indicator(false);
                        console.log("error", error.statusText);
                    }
                });
    }

  
    function searchcustomer() {
        Indicator(true);
         if (name() != "") {
             search(name());
         }
         else if (code() != "") {
             search(code());
         }
         else if (phone() != "") {
             search(phone());
         }
         else if (email() != "") {
             search(email());
         }
        
     }
    function clearButton(e) {
        e.component.element().find(".dx-icon-clear").click(function () {
            customerdata = [];
            getDataGridInstance().option("dataSource", customerdata);
        })
    }

    $(function () {
        $("#customergrid").dxDataGrid({
            dataSource: customerdata,
            loadPanel: {
                enabled: true
            },
            scrolling: {
                mode: "virtual",
                rowRenderingMode: "virtual"
            },
            hoverStateEnabled: true,
            showBorders: true,
            allowColumnResizing:true,
            columns: [
                {
                    width: "25%",
                    dataField: "customerId",
                    caption: "Code",
                    alignment:"left"
                }
                , {
                    width: "50%",
                    dataField: "customerName",
                    caption: "Customer Name",
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
                            window.sessionStorage.removeItem("customer");
                            var item = e.row.data.customerId;
                            var itemName = e.row.data.customerName;
                            customer.customerid = item;
                            customer.customername = itemName;
                            window.sessionStorage.setItem("customer", JSON.stringify(customer));
                            name("");
                            code("");
                            email("");
                            phone("");
                            customerdata = [];
                            getDataGridInstance().option("dataSource", customerdata);
                            POSplus.app.navigate("Order", { root: true });
                            //e.component.refresh(true);
                            //e.event.preventDefault();
                        }
                    }]
                }

            ]
        })
    });
    return {
        searchcustomer: searchcustomer,
        code: code,
        email: email,
        name: name,
        phone: phone,
        clearButton: clearButton,
        addcustomer: addcustomer,
        focusinphone: focusinphone,
        focusinname: focusinname,
        focusincode: focusincode,
        focusinemail: focusinemail,
        Indicator: Indicator
    };
};