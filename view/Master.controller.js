jQuery.sap.require("sap.ca.ui.model.format.AmountFormat");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
// 19.05.2015
sap.ui.controller("spgprints.view.Master", {

		_oView: null, // this view. This attribute is initialized in onInit and never changed afterwards.
		_oList: null, // the master list. This attribute is initialized in onInit and never changed afterwards.
		_oListBinding: null, // binding of the master list. Is initialized when the view is rendered the first time and never changed afterwards.
		_oEmptyPage: null, //  detail view in case no PO exists (more precisely, no PO matches the filter criteria). Initialized on demand.
		_bFirstCall: true, // is set to false when the first PO is displayed on the detail screen

		oDialog: null,
		oDialogFragment: null,

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf spgprints.view.Master
		 */
		onInit: function() {
			this._oView = this.getView();
			this._oList = this.byId("list"); // initialize
		},

		handleSearch: function(evt) {
			// create model filter
			var filters = [];
			var query = evt.getParameter("query");
			if (query && query.length > 0) {
				var filter = new sap.ui.model.Filter("INVOICE_LEV", sap.ui.model.FilterOperator.Contains, query);
				filters.push(filter);
			}
			// update list binding
			var list = this.getView().byId("list");
			var binding = list.getBinding("items");
			binding.filter(filters);
		},

		handleRefresh: function(evt) {
			location.reload();

		},

		handleListItemPress: function(evt) {
			var context = evt.getSource().getBindingContext();
			this.nav.to("Detail", context);
		},

		handleSettings: function(evt) {
			var context = evt.getSource().getBindingContext();
			this.nav.to("Settings", context);
		},

		onUpdateFinished: function() {
			this._setItem();
		},

		_setItem: function() {
			var aItems = this._oList.getItems();
			//console.log(aItems);
			if (aItems.length > 0) { // If there are POs in the list, display one
				var oItemToSelect = aItems[0]; // Fallback: Display the first PO in the list
				// Now we know which item to select
				this._oList.setSelectedItem(oItemToSelect); // Mark it as selected in the master list
				// When the App is started the scroll position should be set to the item to be selected.
				// Note that this is only relevant when the App has been started with a route specifying the
				// PO to be displayed, because otheriwse the first PO in the list will be the selected one anyway.
				var context = oItemToSelect.getBindingContext();
				this.nav.to("Detail", context);
			}
		}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf spgprints.view.Master
			 */
			//	onBeforeRendering: function() {
			//
			//	},

			/**
			 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
			 * This hook is the same one that SAPUI5 controls get after being rendered.
			 * @memberOf spgprints.view.Master
			 */
			//	onAfterRendering: function() {
			//
			//	},

			/**
			 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
			 * @memberOf spgprints.view.Master
			 */
			//	onExit: function() {
			//
			//	}

		});