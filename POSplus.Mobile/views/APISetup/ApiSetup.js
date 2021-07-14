POSplus.ApiSetup = function (params) {
    "use strict";
    var baseurl = "", token = "", Indicator = ko.observable(false);
    var viewModel = {
        //  Put the binding properties here
    };
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
        var apiSetupGroup = "apiSetupGroup";
        $("#baseurl")
            .dxTextBox({
                placeholder: 'https://www.APIURL.com/' })
            .dxValidator({
                validationGroup: apiSetupGroup,
                validationRules: [{
                    type: 'required',
                    message: 'Base URL is required!'
                }]
            });
        $("#token")
            .dxTextBox({ placeholder: 'Token', mode:'password' })
            .dxValidator({
                validationGroup: apiSetupGroup,
                validationRules: [{
                    type: 'required',
                    message: 'Token is required!'
                }]
            });

        $("#submitsetup").dxButton({
            text: "Save", icon:"fa fa-save",
            validationGroup: apiSetupGroup,
            useSubmitBehavior: true,
            onClick: function (e) {
                var result = e.validationGroup.validate();
                if (result.isValid) {

                }
            }
        });

        $("#apisetupform").on("submit", function (e) {
            e.preventDefault();
            baseurl = $("#baseurl").dxTextBox("instance").option("value");
            token = $("#token").dxTextBox("instance").option("value");
            if ((baseurl != "" || baseurl != null) && (token != "" || token != null))
                Indicator(true);
            $.ajax(
                {
                    url: baseurl + "Login/CheckToken/" + token,
                    type: "GET",
                    success: function (data) {
                        // "http://localhost:18368/api/"
                        //"MFMPSPrsdLfDB0620ApiESC3smvjlV20"
                        if (data.status == "Success") {
                            var message = "<p><center> Setup Successful!</center></p>";
                            window.localStorage.setItem("POSPlusApi", baseurl);
                            window.localStorage.setItem("Token", token);
                            Indicator(false);
                            $("#baseurl .dx-texteditor-input").val("");
                            $("#token .dx-texteditor-input").val("");
                            showDialog("", message, 90000);
                            POSplus.app.navigate("Login", { root: true });
                        }
                        else {
                            var message1 = "<p><center>" + data.message + "</center></p>";
                            Indicator(false);
                            showDialog("", message1, 90000);
                        }
                    },
                    error: function (error) {
                        if (error.status === 404) {
                            var message2 = "<p><center> Invalid Url!</center></p>";
                            Indicator(false);
                            showDialog("", message2, 90000);
                        }
                    }

                });
        });

        $("#powersoftcopy").html("Powered by Powersoft &copy; " + new Date().getFullYear() + ".");
    });
   
    return {
        Indicator: Indicator
    };
};