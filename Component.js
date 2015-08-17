jQuery.sap.declare("spgprints.Component");

jQuery.sap.require("sap.ca.ui.message.message");

// 19.05.2015
sap.ui.core.UIComponent.extend("spgprints.Component", {

	createContent: function() {

		// create root view
		var oView = sap.ui.view({
			id: "app",
			viewName: "spgprints.view.App",
			type: "JS",
			viewData: {
				component: this
			}

		});

		var storedOffline = window.localStorage.getItem("offline");
		if (storedOffline === 'true') {
			var oModel = new sap.ui.model.json.JSONModel("model/workitems.json");
		} else {
			var storedServerName = window.localStorage.getItem("servername");
			var storedUserName = window.localStorage.getItem("username");
			var storedReplacement = window.localStorage.getItem("replacement");
			if (storedReplacement === 'true') {
				var rplcment = 'X';
				
			}

			var workitemService = "http://" + storedServerName + ":8000/test/zfmcall/ZMOB_INV_GET_WORKITEMS?IV_GEBRUIKER=" + storedUserName +
				"&IV_OWN=X&IV_OWN_EN_REPLCMNT=" + rplcment + "&format=json";
            //console.log(workitemService);
			var oModel = new sap.ui.model.json.JSONModel(workitemService);
    
			oModel.attachRequestFailed(function(oEvent) {
				sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.ERROR,
					message: oEvent.getParameter("message") + "\n" + oEvent.getParameter("responseText") + "\n" + oEvent.getParameter("statusText")
				});
			});
		}
		// Set the model
		oView.setModel(oModel);
		console.log(oModel);
		
		//sap.ui.getCore().setModel(oModel);

		// set device model
		var deviceModel = new sap.ui.model.json.JSONModel({
		    isDesktop: sap.ui.Device.system.desktop,
			isNoDesktop: !sap.ui.Device.system.desktop,
			isPhone: jQuery.device.is.phone,
			isNoPhone: !jQuery.device.is.phone,
			listMode: (jQuery.device.is.phone) ? "None" : "SingleSelectMaster",
			listItemType: (jQuery.device.is.phone) ? "Active" : "Inactive"
		});
		deviceModel.setDefaultBindingMode("OneWay");
		oView.setModel(deviceModel, "device");

		// set i18n model
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl: "i18n/messageBundle.properties"
		});
		oView.setModel(i18nModel, "i18n");

		// done
		return oView;
	}
});