// NOTE object below must be a valid JSON
window.POSplus = $.extend(true, window.POSplus, {
  "config": {
    "layoutSet": "slideout",
    "animationSet": "default",
    "navigation": [
      {
        "title": "Home",
            "onExecute": function () {
                var username = {},
                    username = JSON.parse(window.sessionStorage.getItem("userInfo"));
                if (username.isSupervisor == true || username.isSupervisor) {
                    POSplus.app.navigate("AdminHome", { root: true });
                }
                else {
                    POSplus.app.navigate("Home", { root: true });
                }
            },
            "icon": "fa fa-home"
      },
      {
        "title": "Order",
          "onExecute": function () {
              var username = {},
                  username = JSON.parse(window.sessionStorage.getItem("userInfo"))
              function showDialog(mtitle, Mymessage, timeout) {

                  var myDialog = DevExpress.ui.dialog.custom({
                      title: mtitle,
                      message: Mymessage,
                      buttons: [{ text: "OK" }]
                  })
                  myDialog.show();
                  setTimeout(function () { myDialog.hide(); }, timeout);
              }
              if (username.placeOrder == true || username.placeOrder) {
                  POSplus.app.navigate("Order", { root: true });
              }
              else {
                  var message = "<p><center>User not allowed to place orders!</center></p>";
                  showDialog("", message, 90000);
              }
          },
          "icon": "fa fa-shopping-cart"
      },
      {
        "title": "Recall Orders",
          "onExecute": function () {
              var username = {},
                  username = JSON.parse(window.sessionStorage.getItem("userInfo"))
              function showDialog(mtitle, Mymessage, timeout) {

                  var myDialog = DevExpress.ui.dialog.custom({
                      title: mtitle,
                      message: Mymessage,
                      buttons: [{ text: "OK" }]
                  })
                  myDialog.show();
                  setTimeout(function () { myDialog.hide(); }, timeout);
              }
              if (username.placeOrder == true || username.placeOrder) {
                  POSplus.app.navigate("Recall", { root: true });
              }
              else {
                  var message = "<p><center>User not allowed to recall orders!</center></p>";
                  showDialog("", message, 90000);
              }
          },
          "icon": "fa fa-undo"
      },
      {
        "title": "Customers",
        "onExecute": "#Customers",
          "icon": "fa fa-users"
      },
      {
        "title": "Reports",
        "onExecute": "#Reports",
          "icon": "fa fa-file-text"
      }, 
      {
          "title": "Setup",
          "onExecute": function () { POSplus.app.navigate("ChangeApiSetup", { root: true }); },
          "icon": "fa fa-cog"
      },
      {
          "title": "Log Out",
          "onExecute": function () { window.sessionStorage.clear(); POSplus.app.navigate("Login", { root: true }); },
          "icon": "fa fa-sign-out"
      } 
    ]
  }
});
