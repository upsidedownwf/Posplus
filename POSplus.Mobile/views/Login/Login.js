POSplus.Login = function (params) {
    "use strict";
   
    var viewModel = {
//  Put the binding properties here
    };
    var baseurl = window.localStorage.getItem("POSPlusApi"), tokenvalue = window.localStorage.getItem("Token");
    window.sessionStorage.setItem("POSPlusApi", baseurl);
    window.sessionStorage.setItem("Token", tokenvalue);

    var rooturl = window.sessionStorage.getItem("POSPlusApi");
    var token = window.sessionStorage.getItem("Token");

    var username = ko.observable("");
    var password = ko.observable(""), Indicator = ko.observable(false);


    function showDialog(mtitle, Mymessage, timeout) {

        var myDialog = DevExpress.ui.dialog.custom({
            title: mtitle,
            message: Mymessage,
            buttons: [{ text: "OK" }]
        })
        myDialog.show();
        setTimeout(function () { myDialog.hide(); }, timeout);
    }
    function showDialogs(mtitle, Mymessage, timeout, userinfo, currentshift) {

        var myDialog = DevExpress.ui.dialog.custom({
            title: mtitle,
            message: Mymessage,
            buttons: [{
                text: "OK", onClick: function (e) {
                    window.sessionStorage.setItem("userInfo", JSON.stringify(userinfo));
                    window.sessionStorage.setItem("currentShift", currentshift);
                    POSplus.app.navigate("Home", { root: true });
                }
            }, {
                    text: "Cancel", onClick: function (e) {
                        POSplus.app.navigate("Login", { root: true });
                }
            }]
        })
        myDialog.show();
        setTimeout(function () { myDialog.hide(); }, timeout);
    }
    $(function () {

        $("#username")
            .dxTextBox({ placeholder: 'Username', value: username})
            .dxValidator({
                validationRules: [{
                    type: 'required',
                    message: 'Username is required!'
                }]
            });

        $("#password")
            .dxTextBox({
                placeholder: "Password",
                mode: "password", value:password
            })
            .dxValidator({
                validationRules: [{
                    type: 'required',
                    message:'Password is required!'
                }]
            });
      

        $("#submit").dxButton({
            text: "Login",icon:"fa fa-sign-in",
            useSubmitBehavior: true,
            onClick: function (e) {
                var result = e.validationGroup.validate();
                if (result.isValid) {
                    username = $("#username").dxTextBox("instance").option("value");
                     password = $("#password").dxTextBox("instance").option("value");
                   // username = $("#username .dx-texteditor-input").val();
                   // password = $("#password .dx-texteditor-input").val();
                }
            }
        });

        $("#forms").on("submit", function (e) {
            e.preventDefault();
            Indicator(true);
            var info = JSON.stringify({ username, password });
            if (username != "" && password != "") {
                $.ajax(
                    {
                        url: rooturl + "Login/" + token,
                        type: "POST",
                        contentType: "application/json",
                        data: info,
                        success: function (data) {
                            if (data.item1.status == "Success") {
                                if (data.item1.message == "Success") {
                                    window.sessionStorage.setItem("userInfo", JSON.stringify(data.item2));
                                    if (data.item3) {
                                        window.sessionStorage.setItem("currentShift", data.item3);
                                    }
                                    Indicator(false);
                                    if (data.item2.isSupervisor == true || data.item2.isSupervisor) {
                                        POSplus.app.navigate("AdminHome", { root: true });
                                    }
                                    else {
                                        POSplus.app.navigate("Home", { root: true });
                                    }
                                }
                                else if (data.item1.message == "No Open Shift") {
                                    var message = "<p><center>No open shift for <span style=\"color:dodgerblue\"><strong>" + data.item2.cAgentName + "</strong></span>,  Contact your Administrator to open a shift for you.</center></p>";
                                    Indicator(false);
                                    showDialog("", message, 90000);
                                }
                                else
                                {
                                    var index = data.item1.message.indexOf("|");
                                    var shifttdate = data.item1.message.slice(0, index);
                                    var shiffttype = data.item1.message.slice(index+1);
                                    var message = "<p><center>Hello <span style=\"color:dodgerblue\"><strong>" + data.item2.cAgentName + "</strong></span>, Your <span style=\"color:dodgerblue\"><strong>" + shiffttype + "</strong></span> shift as at <span style=\"color:dodgerblue\"><strong>" + shifttdate + "</strong></span> is still currently open, Do you want to continue with it?</center></p >";
                                    Indicator(false);
                                    showDialogs("", message, 90000, data.item2, data.item1.message);
                                }
                            }
                            else {
                                var message = "<p><center>" + data.item1.message + "</center></p>";
                                Indicator(false);
                                showDialog("", message, 90000);
                            }
                        },
                        error: function (error) {
                            if (error.status === 404) {
                                var message2 = "<p><center> Invalid Url!</center></p>";
                                Indicator(false);
                                showDialog("", message2, 90000);
                            }
                            else if(error.status === 500){
                                var message3 = "<p><center> Internal Server Error!</center></p>";
                                Indicator(false);
                                showDialog("", message3, 90000);
                            }
                        }

                    });
            }
            
        });
    });
    return {
        Indicator: Indicator
    }
};