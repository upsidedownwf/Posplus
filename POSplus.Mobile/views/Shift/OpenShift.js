POSplus.OpenShift = function (params) {
    "use strict";
    var rooturl = window.sessionStorage.getItem("POSPlusApi");
    var token = window.sessionStorage.getItem("Token");

    var employeeid = ko.observable(""), shifttype = ko.observable(""), openShiftModel = {}, username = JSON.parse(window.sessionStorage.getItem("userInfo"));
    var viewModel = {
        //  Put the binding properties here
    };
    employeeid(window.sessionStorage.getItem("selectedemployeeshift"));
    if (JSON.parse(window.sessionStorage.getItem("selectedShiftType")) != null) {
        shifttype(JSON.parse(window.sessionStorage.getItem("selectedShiftType")).shiftTypeDescription);
    }
    function gotoemployeeshift() {
        POSplus.app.navigate("EmployeeShift", { root: false });
    }
    function gotoshifttype() {
        POSplus.app.navigate("ShiftType", { root: false });
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
        var shiftGroup = "shiftGroup";
        $("#employeeid")
            .dxTextBox({ placeholder: 'Employee ID', onFocusIn: gotoemployeeshift, value: employeeid() })
            .dxValidator({
                validationGroup: shiftGroup,
                validationRules: [{
                    type: 'required',
                    message: 'Employee ID is required!'
                }]
            });
        $("#shifttype")
            .dxTextBox({ placeholder: 'Shift Type', onFocusIn: gotoshifttype, value: shifttype()})
            .dxValidator({
                validationGroup: shiftGroup,
                validationRules: [{
                    type: 'required',
                    message: 'Shift Type is required!'
                }]
            });

        $("#openshift").dxButton({
            text: "Open Shift", icon:"fa fa-plus",
            validationGroup: shiftGroup,
            useSubmitBehavior: true,
            onClick: function (e) {
                var result = e.validationGroup.validate();
                if (result.isValid) {

                }
            }
        });

        $("#shiftform").on("submit", function (e) {
            e.preventDefault();
            employeeid($("#employeeid").dxTextBox("instance").option("value"));
            openShiftModel.employeeId = employeeid();
            openShiftModel.machineName = JSON.parse(window.sessionStorage.getItem("selectedShiftType")).shiftTypeId;
            var info = JSON.stringify(openShiftModel);
                $.ajax(
                    {
                        url: rooturl + "Shifts/" + token + "?employee=" + username.cAgentName,
                        type: "POST",
                        contentType: "application/json",
                        data: info,
                        success: function (data) {
                            $("#employeeid").dxTextBox("instance").option("value", "");
                            $("#shifttype").dxTextBox("instance").option("value", "");
                            window.sessionStorage.removeItem("selectedemployeeshift");
                            window.sessionStorage.removeItem("selectedShiftType");
                            var message = data.item1.message + " Shift opened successfully for <span style =\"color:dodgerblue\"><strong>" + data.item2.employeeId + "</strong></span>";
                            showDialog("", message, 90000);

                        },
                        error: function (error) {
                            console.log("error", error.statusText);
                        }

                    });

        });
    });
    return {

    };
};