sap.ui.jsview("spgprints.view.App", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf spgprints.view.App
	*/ 
	getControllerName : function() {
		return "spgprints.view.App";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf spgprints.view.App
	*/ 
	
	createContent: function (oController) {
		
		// to avoid scroll bars on desktop the root view must be set to block display
		this.setDisplayBlock(true);
		
		// create app
			// create app
		this.app = new sap.m.SplitApp();
		//this.app = new sap.m.App();
		
		// load the master page
		var master = sap.ui.xmlview("Master", "spgprints.view.Master");
		master.getController().nav = this.getController();
		this.app.addPage(master, true);
		
		// load the empty page
		var empty = sap.ui.xmlview("Empty", "spgprints.view.Empty");
		this.app.addPage(empty, false);
		
		// load the detail page
		//var detail = sap.ui.xmlview("Detail", "spgprints.view.Detail");
		//detail.getController().nav = this.getController();
		//this.app.addPage(detail, false);
		
		// done
		return this.app;
	}
	/*
	createContent : function(oController) {
		return new sap.m.Page({
			title: "Title",
			content: [
				
			]
		});
	} */

});
