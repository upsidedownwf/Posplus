POSplus.AdminHome = function (params) {
    "use strict";
    var username = {},
        username = JSON.parse(window.sessionStorage.getItem("userInfo")), currentshift = window.sessionStorage.getItem("currentShift");
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
    function itemEvent(e) {
        console.log(e);
        if (e.itemData.text == "Open Shift") {
            POSplus.app.navigate("OpenShift", { root: false });
        }
        else if (e.itemData.text == "Close Shift") {
            POSplus.app.navigate("CloseShift", { root: false });
        }

    }
    function order() {
        if (username.placeOrder == true || username.placeOrder) {
            POSplus.app.navigate("Order", { root: true });
        }
        else {
            var message = "<p><center>User not allowed to place orders!</center></p>";
            showDialog("", message, 90000);
        }
    }
    function customers() {
        POSplus.app.navigate("Customers", { root: true });
    }
    function recall() {
        if (username.placeOrder == true || username.placeOrder) {
            POSplus.app.navigate("Recall", { root: true });
        }
        else {
            var message = "<p><center>User not allowed to recall orders!</center></p>";
            showDialog("", message, 90000);
        }
    }
    function reports() {
        POSplus.app.navigate("Reports", { root: true });
    }

    if (currentshift && typeof currentshift !== "object") {
        var index = currentshift.indexOf("|");
        var shifttdate = currentshift.slice(0, index);
        var shiffttype = currentshift.slice(index + 1);
    }
    var powerby = "Powered by Powersoft &copy; " + new Date().getFullYear() + ".";
    $(function () {
                $("#admingreeting").html("Welcome " + username.cAgentName).append(`
                <div class="rows" style="width:100%;padding:0px"><strong>Shift Type: </strong> &nbsp;` + shiffttype + `</div>
                    <div class="rows" style="width:100%;padding:0px"><strong>Shift Date: </strong> &nbsp;`+ shifttdate + `</div>`);

        $("#powersoftcopy").html(powerby);

    });
    return {
        order: order,
        itemEvent: itemEvent,
        customers: customers,
        recall: recall,
        reports: reports
    };
};