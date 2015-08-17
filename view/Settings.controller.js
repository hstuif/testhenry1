sap.ui.controller("spgprints.view.Settings", {
	// 19.05.2015
	getStoredValues: function() {
		var storedServerName = window.localStorage.getItem("servername");
		this.getView().byId("inpServerName").setValue(storedServerName);
		var storedUserName = window.localStorage.getItem("username");
		this.getView().byId("inpUserName").setValue(storedUserName);
		var storedPassWord = window.localStorage.getItem("password");
		this.getView().byId("inpPassWord").setValue(storedPassWord);
		var storedReplacement = window.localStorage.getItem("replacement");
		if (storedReplacement === 'true') {
			this.getView().byId("inpReplacement").setSelected(storedReplacement);
		}
		var storedOffline = window.localStorage.getItem("offline");

		if (storedOffline === 'true') {
			this.getView().byId("inpOffline").setSelected(storedOffline);
		}
	},

	handleSaveSettings: function() {
		var value = this.getView().byId("inpServerName").getValue();
		window.localStorage.setItem("servername", value);
		var value1 = this.getView().byId("inpUserName").getValue();
		window.localStorage.setItem("username", value1);
		var value2 = this.getView().byId("inpPassWord").getValue();
		window.localStorage.setItem("password", value2);
		var value3 = this.getView().byId("inpReplacement").getSelected();
		window.localStorage.setItem("replacement", value3);
		var value4 = this.getView().byId("inpOffline").getSelected();
		window.localStorage.setItem("offline", value4);
		// Reload app		
		location.reload();
		//console.log(value3);
	},

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf spgprints.view.Settings
	 */
	//onInit: function() {
	//this.getStoredValues();
	//},

	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	 * (NOT before the first rendering! onInit() is used for that one!).
	 * @memberOf spgprints.view.Settings
	 */
	onBeforeRendering: function() {
		this.getStoredValues();
	}

	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @memberOf spgprints.view.Settings
	 */
	//	onAfterRendering: function() {
	//
	//	},

	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 * @memberOf spgprints.view.Settings
	 */
	//	onExit: function() {
	//
	//	}

});