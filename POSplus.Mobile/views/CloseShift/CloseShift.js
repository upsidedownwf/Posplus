POSplus.CloseShift = function (params) {
    "use strict";
    var rooturl = window.sessionStorage.getItem("POSPlusApi");
    var token = window.sessionStorage.getItem("Token");

    var employee = "", shifttype = ko.observable(""), shiftdate = ko.observable(""), closeShiftModel = {}, username = JSON.parse(window.sessionStorage.getItem("userInfo"));
    employee = sessionStorage.getItem("selectedemployeeshift");
    var viewModel = {
        //  Put the binding properties here
    };
    function gotoemployeeshift() {
        POSplus.app.navigate("CloseEmployeeShift", { root: false });
    }
    function returndate(dates) {
        var date = new Date(dates)
        var dd = date.getDate();
        var mm = date.getMonth() + 1;
        var yy = date.getFullYear();
        if (mm < 10) {
            mm = '0' + mm;
        }
        if (yy < 10) {
            yy = '0' + yy;
        }
        return dd + "/" + mm + "/" + yy;
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
        var closeShiftGroup = "closeShiftGroup";
        $("#employeeid")
            .dxTextBox({ placeholder: 'Employee ID', onFocusIn: gotoemployeeshift, value: employee, readOnly: true })
            .dxValidator({
                validationGroup: closeShiftGroup,
                validationRules: [{
                    type: 'required',
                    message: 'Employee ID is required!'
                }]
            });

        $("#shiftdate")
            .dxTextBox({ placeholder: 'Shift Date', readOnly: true, value: shiftdate() })

        $("#shifttype")
            .dxTextBox({ placeholder: 'Shift Type', readOnly: true, value: shifttype() })

        if (employee && typeof employee !== "object") {
            $.ajax(
                {
                    url: rooturl + "Shifts/GetOpenShift/" + token + "?employee=" + employee,
                    type: "GET",
                    success: function (data) {
                        console.log("item data", data);
                        shiftdate(data.item2.shiftOpenDate);
                        shifttype(data.item2.machineName);
                        console.log("shiftdate", shiftdate())
                        console.log("shiftdate", typeof shiftdate())
                        var shiftdattee = returndate(shiftdate());
                        if (shiftdate() == "undefined" || typeof shiftdate() === "undefined") {
                            shiftdattee = null;
                        }
                        $("#shiftdate").dxTextBox("instance").option("value", shiftdattee);
                        $("#shifttype").dxTextBox("instance").option("value", shifttype());
                        window.sessionStorage.setItem("selectedemployeeshiftid", JSON.stringify(data.item2));
                    },
                    error: function (error) {
                        console.log(error.statusText);
                    }
                });
        }
        else { }
        $("#closeshift").dxButton({
            text: "Close Shift", icon:"fa fa-times",
            validationGroup: closeShiftGroup,
            useSubmitBehavior: true,
            onClick: function (e) {
                var result = e.validationGroup.validate();
                if (result.isValid) {

                }
            }
        });

        $("#closeshiftform").on("submit", function (e) {
            e.preventDefault();
            shifttype($("#shifttype").dxTextBox("instance").option("value"));
            closeShiftModel.employeeId = employee;
            closeShiftModel.shiftId = JSON.parse(window.sessionStorage.getItem("selectedemployeeshiftid")).shiftId;
            closeShiftModel.machineName = JSON.parse(window.sessionStorage.getItem("selectedemployeeshiftid")).machineName;
            var info = JSON.stringify(closeShiftModel);
            $.ajax(
                {
                    url: rooturl + "Shifts/CloseShift/" + token + "?employee=" + username.cAgentName,
                    type: "POST",
                    contentType: "application/json",
                    data: info,
                    success: function (data) {
                        if (data.item1.status == "Success") {
                            if (data.item1.message != "No Open Shifts") {
                                $("#employeeid").dxTextBox("instance").option("value", "");
                                $("#shiftdate").dxTextBox("instance").option("value", "");
                                $("#shifttype").dxTextBox("instance").option("value", "");
                                window.sessionStorage.removeItem("selectedemployeeshift");
                                window.sessionStorage.removeItem("selectedShiftType");
                                window.sessionStorage.removeItem("selectedemployeeshiftid");
                                var message = data.item1.message + " Shift closed successfully for <span style =\"color:dodgerblue\"><strong>" + data.item2.employeeId + "</strong></span>";
                                showDialog("", message, 90000);
                            }
                            else {
                                $("#employeeid").dxTextBox("instance").option("value", "");
                                $("#shiftdate").dxTextBox("instance").option("value", "");
                                $("#shifttype").dxTextBox("instance").option("value", "");
                                window.sessionStorage.removeItem("selectedemployeeshift");
                                window.sessionStorage.removeItem("selectedShiftType");
                                window.sessionStorage.removeItem("selectedemployeeshiftid");
                                var message=" No Open shift was found for <span style =\"color:dodgerblue\"><strong>" + data.item2.employeeId + "</strong></span>";
                                showDialog("", message, 90000);
                            }
                        }

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