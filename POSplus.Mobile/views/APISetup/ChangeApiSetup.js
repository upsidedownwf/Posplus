POSplus.ChangeApiSetup = function (params) {
    "use strict";
    var baseurl = "", token = "", Indicator = ko.observable(false);
     baseurl = window.sessionStorage.getItem("POSPlusApi");
     token = window.sessionStorage.getItem("Token");
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
        $("#submitdiv").hide();
        var apiChangeSetupGroup = "apiChangeSetupGroup";
        $("#baseurl")
            .dxTextBox({ placeholder: 'https://www.APIURL.com/', readOnly: true, value: baseurl })
            .dxValidator({
                validationGroup: apiChangeSetupGroup,
                validationRules: [{
                    type: 'required',
                    message: 'Base URL is required!'
                }]
            });
        $("#token")
            .dxTextBox({ placeholder: 'Token', readOnly: true, value: token, mode: "password"})
            .dxValidator({
                validationGroup: apiChangeSetupGroup,
                validationRules: [{
                    type: 'required',
                    message: 'Token is required!'
                }]
            });

        $("#submitsetup").dxButton({
            text: "Save", icon: "fa fa-save",
            validationGroup: apiChangeSetupGroup,
            useSubmitBehavior: true,
            onClick: function (e) {
                var result = e.validationGroup.validate();
                if (result.isValid) {

                }
            }
        });
        $("#edit").dxButton({
            text: "Edit", icon:"fa fa-edit",
            validationGroup: apiChangeSetupGroup,
            onClick: function (e) {
                $("#editdiv").hide();
                $("#submitdiv").show();
                $("#baseurl").dxTextBox("instance").option("value", "");
                $("#token").dxTextBox("instance").option("value", "");
                $("#baseurl").dxTextBox("instance").option("readOnly", false);
                $("#token").dxTextBox("instance").option("readOnly", false);
            }
        });
        $("#cancel").dxButton({
            text: "cancel", icon: "fa fa-times",
            validationGroup: apiChangeSetupGroup,
            onClick: function (e) {
                $("#editdiv").show();
                $("#submitdiv").hide();
                $("#baseurl").dxTextBox("instance").option("value", window.sessionStorage.getItem("POSPlusApi"));
                $("#token").dxTextBox("instance").option("value", window.sessionStorage.getItem("Token"));
                $("#baseurl").dxTextBox("instance").option("readOnly", true);
                $("#token").dxTextBox("instance").option("readOnly", true);
            }
        });

        $("#apisetupform").on("submit", function (e) {
            e.preventDefault();
            Indicator(true);
            baseurl = $("#baseurl").dxTextBox("instance").option("value");
            token = $("#token").dxTextBox("instance").option("value");
            if ((baseurl != "" || baseurl != null) && (token != "" || token != null)) {
                Indicator(true);
                $.ajax(
                    {
                        url: baseurl + "Login/CheckToken/" + token,
                        type: "GET",
                        contentType: "application/json",
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
                                //$("#editdiv").show();
                                //$("#submitdiv").hide();
                                //$("#baseurl").dxTextBox("instance").option("readOnly", true);
                                //$("#token").dxTextBox("instance").option("readOnly", true);
                                //$("#baseurl").dxTextBox("instance").option("value", baseurl);
                                //$("#token").dxTextBox("instance").option("value", token);
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
            }


        });
    });
    return {
        Indicator: Indicator
    };
};