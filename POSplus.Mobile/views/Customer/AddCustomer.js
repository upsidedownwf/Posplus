POSplus.AddCustomer = function (params) {
    "use strict";
    var rooturl = window.sessionStorage.getItem("POSPlusApi");
    var token = window.sessionStorage.getItem("Token");

    var name = "", dob = ko.observable(""), phone = "", code = ko.observable(""), email = "", address = ko.observable(""), customer = {}, Indicator = ko.observable(false);
    var viewModel = {
//  Put the binding properties here
    };
    function newcustomer() {
        $("#name").dxTextBox("instance").option("value", null);
        $("#email").dxTextBox("instance").option("value", null);
        $("#phone").dxTextBox("instance").option("value", null);
        address("");
        dob("");
        code("");
    }
    function showDialog(mtitle, Mymessage, timeout) {

        var myDialog = DevExpress.ui.dialog.custom({
            title: mtitle,
            message: Mymessage,
            buttons: [{ text: "OK" }]
        })
        myDialog.show();
        setTimeout(function () { myDialog.hide(); }, timeout);
    }

    $(function () {
        var customerGroup = "customerGroup";
        $("#name")
            .dxTextBox({ placeholder: 'Name' })
            .dxValidator({
                validationGroup: customerGroup,
                validationRules: [{
                    type: 'required',
                    message: 'Name is required!'
                }]
            });
        $("#email")
            .dxTextBox({ placeholder: 'Email' })
            .dxValidator({
                validationGroup: customerGroup,
                validationRules: [{ 
                        type: 'pattern',
                        pattern: '^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$',
                        message: 'Enter a valid email!'
                    }]
            });
        $("#phone")
            .dxTextBox({ placeholder: 'Phone' })
            .dxValidator({
                validationGroup: customerGroup,
                validationRules: [{
                    type: 'required',
                    message: 'Phone is required!'
                }, {
                    type: 'pattern',
                     pattern: '^[0-9]+$',
                    message: 'Enter a valid phone number!'
                }]
            });

        $("#submitcustomer").dxButton({
            text: "Save", icon:"fa fa-save",
            validationGroup: customerGroup,
            useSubmitBehavior: true,
            onClick: function (e) {
                var result = e.validationGroup.validate();
                if (result.isValid) {
                    
                }
            }
        });

        $("#cusform").on("submit", function (e) {
            e.preventDefault();
            Indicator(true);
            name = $("#name").dxTextBox("instance").option("value");
            email = $("#email").dxTextBox("instance").option("value");
            phone = $("#phone").dxTextBox("instance").option("value");
            var cuscode = code();
            customer.customerName = name;
            customer.customerEmail = email;
            customer.customerAddress1 = address();
            customer.customerPhone = phone;
            customer.customerDob = dob();
            var info = JSON.stringify(customer);
            if ((name != "" || name != null) && (cuscode == null || cuscode== "")) {
                $.ajax(
                    {
                        url: rooturl + "CustomerInformation/" + token,
                        type: "POST",
                        contentType: "application/json",
                        data: info,
                        success: function (data) {
                            $("#name .dx-texteditor-input").val(data.item2.customerName);
                            $("#email .dx-texteditor-input").val(data.item2.customerEmail);
                            $("#phone .dx-texteditor-input").val(data.item2.customerPhone);
                            address(data.item2.customerAddress1);
                            dob(data.item2.customerDob);
                            code(data.item2.customerId);
                            var message = "<p><center> Customer <span style=\"color:dodgerblue\"><strong>" + data.item2.customerId + "</strong></span> has been created successfully!</center></p>";
                            Indicator(false);
                            showDialog("", message, 90000);
                        },
                        error: function (error) {
                            Indicator(false);
                            console.log("error", error.statusText);
                        }

                    });
            }


        });
    });
    return {
        dob: dob,
        code:code,
        email: email,
        address: address,
        newcustomer: newcustomer,
        Indicator : Indicator
    };
};