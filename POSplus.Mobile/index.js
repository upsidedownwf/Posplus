$(function() {
    var startupView;

    var baseurl = window.localStorage.getItem("POSPlusApi"), token = window.localStorage.getItem("Token");
    // Uncomment the line below to disable platform-specific look and feel and to use the Generic theme for all devices
    // DevExpress.devices.current({ platform: "generic" });
    if (typeof baseurl === "object" || typeof token === "object") {
        startupView = "ApiSetup";
    }
    else {
        startupView = "Login";
    }
    var viewName, navigation;
    if(DevExpress.devices.real().platform === "win") {
        $("body").css("background-color", "#000");
    }

    var isDeviceReady = false,
        isViewShown = false;

    function hideSplashScreen() {
        if(isDeviceReady && isViewShown) {
            navigator.splashscreen.hide();
        }
    }

	if(document.addEventListener) {
		document.addEventListener("deviceready", function () {
			isDeviceReady = true;
			hideSplashScreen();
			document.addEventListener("backbutton", function () {
				DevExpress.processHardwareBackButton();
			}, false);
		}, false);
	}

    function onViewShown() {
        isViewShown = true;
        hideSplashScreen();
        POSplus.app.off("viewShown", onViewShown);
    }

    function onNavigatingBack(e) {
        if(e.isHardwareButton && !POSplus.app.canBack()) {
            e.cancel = true;
            exitApp();
        }
    }

    function exitApp() {
        switch (DevExpress.devices.real().platform) {
            case "android":
                navigator.app.exitApp();
                break;
            case "win":
                MSApp.terminateApp('');
                break;
        }
    }

    var layoutSet = DevExpress.framework.html.layoutSets[POSplus.config.layoutSet],
        navigation = POSplus.config.navigation;


    POSplus.app = new DevExpress.framework.html.HtmlApplication({
        namespace: POSplus,
        layoutSet: layoutSet,
        animationSet: DevExpress.framework.html.animationSets[POSplus.config.animationSet],
        navigation: navigation,
        commandMapping: POSplus.config.commandMapping,
        navigateToRootViewMode: "keepHistory",
        useViewTitleAsBackText: true
    });

    $(window).on("unload", function() {
        POSplus.app.saveState();
    });

    POSplus.app.router.register(":view/:id", { view: startupView, id: undefined });
    POSplus.app.on("resolveLayoutController", (function (args) {
        viewName = args.viewInfo.viewName;




        if (viewName == "Login" || viewName == "ApiSetup") {




            args.layoutController = args.availableLayoutControllers[1].controller;

        } else {
            navigation = POSplus.config.navigation;
            args.layoutController = args.availableLayoutControllers[0].controller;
        }
    }));
    POSplus.app.on("viewShown", onViewShown);
    POSplus.app.on("navigatingBack", onNavigatingBack);
    POSplus.app.navigate();
});