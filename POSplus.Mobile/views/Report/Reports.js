POSplus.Reports = function (params) {
    "use strict";
    function orderlisting() {
        window.sessionStorage.removeItem("orderlistingreport");
        window.sessionStorage.removeItem("currencysymb");
        window.sessionStorage.removeItem("reportperiod"); 
        POSplus.app.navigate("OrdersListing", { root: false });
    }
    function saleslisting() {
        window.sessionStorage.removeItem("orderlistingreport");
        window.sessionStorage.removeItem("currencysymb");
        window.sessionStorage.removeItem("reportperiod");
        POSplus.app.navigate("SalesListing", { root: false });
    }
    var viewModel = {
//  Put the binding properties here
    };

    return {
        orderlisting: orderlisting,
        saleslisting: saleslisting
    };
};