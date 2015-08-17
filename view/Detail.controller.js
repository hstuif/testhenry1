jQuery.sap.require("sap.ca.ui.model.format.AmountFormat");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
jQuery.sap.require("sap.ca.ui.dialog.factory");
jQuery.sap.require("sap.ca.ui.message.message");
jQuery.sap.require("sap.m.MessageBox");

var globalId = '';
// 19.05.2015

sap.ui.controller("spgprints.view.Detail", {
	inputId: '',
	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf spgprints.view.Detail
	 */

	onSelectChanged: function(oEvent) {
		var that = this;
		var notes;
		var key = oEvent.getParameters().key;
		if (key == '1') {
			//alert("Click Test1");
		} else if (key == '2') {

		} else if (key == '3') {

			var sId = that.byId('idWorkflow').getText();

			var storedOffline = window.localStorage.getItem("offline");
			//console.log(storedOffline);
			if (storedOffline != 'true') {
				var storedServerName = window.localStorage.getItem("servername");
				var url = "http://" + storedServerName + ":8000/test/zfmcall/ZMOB_INV_GET_PDF?IV_WORKITEM=" + sId + "&amp;format=json";
				var oModel = new sap.ui.model.json.JSONModel(url);
			}
			//var url = 'http://bxmsa104.colours.inter:8000/test/zfmcall/ZMOB_INV_GET_PDF?IV_WORKITEM=' + sId + '&amp;format=json';

			$.ajax({
				type: "GET",
				url: url,
				datatype: "json",
				contentType: "application/json",
				success: function(data) {
					var htmlText = '<embed width=100% height="700"' + ' type="application/pdf"' + ' src="data:application/pdf;base64,' + data.E_XSTRING +
						'"></embed>';
					that.getView().byId('htmlpdf').setContent(htmlText);
				}
			});
		}
	},

	handleCostCenterValueHelp: function(oController) {
		this.inputID = oController.oSource.sId;
		if (!this._valueHelpDialogCC) {
			this._valueHelpDialogCC = sap.ui.xmlfragment("spgprints.view.CostCenter", this);
			this.getView().addDependent(this._valueHelpDialogCC);
		}

		var storedOffline = window.localStorage.getItem("offline");
		if (storedOffline === 'true') {
			var oModelCC = new sap.ui.model.json.JSONModel("model/costcenters.json");
		} else {
			var storedServerName = window.localStorage.getItem("servername");
			var costcenterService = "http://" + storedServerName + ":8000/test/zfmcall/ZMOB_INV_GET_COSTCENTER";
			var oModelCC = new sap.ui.model.json.JSONModel(costcenterService);
		}
		// Set model costcenters
		var oView1 = this.getView();
		oView1.setModel(oModelCC, "costcenters");
		this._valueHelpDialogCC.open();
	},

	_handleValueHelpClose: function(evt) {
		//alert('hi');
		var oSelectedItem = evt.getParameter("selectedItem");
		//console.log(oSelectedItem);
		if (oSelectedItem) {
			var ccInput = this.getView().byId(this.inputID);
			//console.log(ccInput);
			ccInput.setValue(oSelectedItem.getTitle());
		}
		evt.getSource().getBinding("items").filter([]);
	},

	handleGLAccountValueHelp: function(oController) {
		this.inputID = oController.oSource.sId;
		if (!this._valueHelpDialogGL) {
			this._valueHelpDialogGL = sap.ui.xmlfragment("spgprints.view.GLAccounts", this);
			this.getView().addDependent(this._valueHelpDialogGL);
		}
		var storedOffline = window.localStorage.getItem("offline");
		if (storedOffline === 'true') {
			var oModelGL = new sap.ui.model.json.JSONModel("model/glaccounts1.json");
		} else {
			var storedServerName = window.localStorage.getItem("servername");
			var storedUserName = window.localStorage.getItem("username");
			var glaccountService = "http://" + storedServerName + ":8000/test/zfmcall/ZMOB_INV_GET_GLACCOUNT?IV_GEBRUIKER=" + storedUserName;
			var oModelGL = new sap.ui.model.json.JSONModel(glaccountService);
		}
		// Set model GLAccounts
		var oView1 = this.getView();
		oView1.setModel(oModelGL, "glaccounts");
		this._valueHelpDialogGL.open();
	},

	validateCostCenter: function() {
		var items = this.getView().getBindingContext().getProperty("WORKFLOW_ID_ITEMS");
		var state = 'G';
		for (i = 0; i < items.length; i++) {
			// costcenter tussen 42000 en 46999 
			if (items[i].ITEM_COSTC !== "") {
				if (items[i].ITEM_GL.toString() < "42000" || items[i].ITEM_GL.toString() > "46999") {
					this.displayError("GL Account must be between 42000 and 46999");
					state = 'E';
					return state;
				} else {
					state = 'G';
				}
			}
		}
		return state;
	},

	validateGLAccount: function() {
		var i;
		var items = this.getView().getBindingContext().getProperty("WORKFLOW_ID_ITEMS");
		var state = 'G';
		for (i = 0; i < items.length; i++) {
			var glAccount = items[i].ITEM_GL.toString();
			var costCenter = items[i].ITEM_COSTC.toString();
			var purchOrder = items[i].ITEM_PURCHASEORDER.toString();
			var salesOrder = items[i].ITEM_SALESORDER.toString();
			var salesOrderItem = items[i].ITEM_SOITEM.toString();
			if ((glAccount.charAt(0) === "1" || glAccount.charAt(0) === "9") && glAccount.length === 5) {
				if (costCenter !== "" || purchOrder !== "" || salesOrder !== "" || salesOrderItem !== "") {
					this.displayError("This GL-Account number does not allow other fields filled");
					state = 'E';
					return state;
				} else {
					state = 'G';
				}
			}
		}
		return state;
	},

	validateSalesOrder: function() {
		var i;
		var items = this.getView().getBindingContext().getProperty("WORKFLOW_ID_ITEMS");
		var state = 'G';
		for (i = 0; i < items.length; i++) {
			var salesOrder = items[i].ITEM_SALESORDER.toString();
			var salesOrderItem = items[i].ITEM_SOITEM.toString();
			var purchaseOrder = items[i].ITEM_PURCHASEORDER.toString();
			var glAccount = items[i].ITEM_GL.toString();
			if (salesOrder !== "" && salesOrderItem === "") {
				this.displayError("Salesorder Item must also be filled");
				state = 'E';
				return state;
			} else {
				state = 'G';
			}
			if (salesOrder === "" && salesOrderItem !== "") {
				this.displayError("Salesorder must also be filled");
				state = 'E';
				return state;
			} else {
				state = 'G';
			}
			//console.log(glAccount.substring(0, 2));
			if (salesOrder !== '' || purchaseOrder !== '') {
				if (glAccount.substring(0, 2) !== '48') {
					this.displayError("GL-Accountnumber should start with '48'");
					state = 'E';
					return state;
				} else {
					state = 'G';
				}
			}
		}
		return state;
	},

	validateAmount: function() {
		var that = this;
		var i;
		var amount;
		var totalledAmount;
		var items = this.getView().getBindingContext().getProperty("WORKFLOW_ID_ITEMS");
		var state = 'G';
		for (i = 0; i < items.length; i++) {
		    amount = items[i].ITEM_AMOUNT.replace(".", "").replace(",", ".");
		    console.log(amount);
			if (i === 0) {
				totalledAmount = parseFloat(amount);
			} else {
				totalledAmount = totalledAmount + parseFloat(amount);
			}
			console.log(totalledAmount);
		}
		var totalAmount = that.byId('idNetAmount').getText().replace(".","").replace(",",".").replace(".00","");
		console.log(totalAmount);
		if (totalAmount.toString() !== totalledAmount.toString()) {
			this.displayError('Total invoice amount not equal to item-amount(s)');
			state = 'E';
			return state;
		} else {
			state = 'G';
		}
        console.log(state);
		return state;
	},

	displayError: function(msg) {
		var dialog = new sap.m.Dialog({
			title: 'Error',
			type: 'Message',
			state: 'Error',
			content: new sap.m.Text({
				text: msg
			}),

			beginButton: new sap.m.Button({
				text: 'OK',
				press: function() {
					dialog.close();
				}
			}),
			afterClose: function() {
				dialog.destroy();
			}
		});

		dialog.open();
	},

	displayMessage: function(msg) {
		var dialog = new sap.m.Dialog({
			title: 'Info',
			type: 'Message',
			content: new sap.m.Text({
				text: msg
			}),

			beginButton: new sap.m.Button({
				text: 'OK',
				press: function() {
					dialog.close();
				}
			}),
			afterClose: function() {
				dialog.destroy();
				location.reload();
			}
		});

		dialog.open();
	},

	onInit: function() {
		// Afhankelijk van inhoud functie PDF maken
		var idAttachment = this.getView().byId("idAttach");
		idAttachment.setVisible(true);
		this.getView().addEventDelegate({ // not added the controller as delegate to avoid controller functions with similar names as the events 
			onBeforeShow: jQuery.proxy(function(evt) {
				this.onBeforeShow(evt);
			}, this)
		});
	},

	doApprove: function() {
		var sText = sap.ui.getCore().byId('confirmDialogTextarea').getValue();
		sap.m.MessageToast.show('Note is: ' + sText);
		this.dialog.close();
	},

	handleApprove: function(e) {
		var that = this;
		var checkAmounts = this.validateAmount();
		if (checkAmounts == 'G') {
			var checkCostCenter = this.validateCostCenter();
			//console.log('cc' + checkCostCenter);
			if (checkCostCenter == 'G') {
				var checkGLAccount = this.validateGLAccount();
				//console.log('gl' + checkGLAccount);
				if (checkGLAccount == 'G') {
					var checkSalesOrder = this.validateSalesOrder();
					//console.log('so' + checkSalesOrder);
					if (checkSalesOrder == 'G') {
						var dialog = new sap.m.Dialog({
							title: 'Approve',
							type: 'Message',
							content: [
                                new sap.m.TextArea('confirmDialogTextarea', {
									width: '100%',
									placeholder: 'Add note (optional)'
								})
                ],
							beginButton: new sap.m.Button({
								text: 'Submit',
								press: function() {
									var sText = sap.ui.getCore().byId('confirmDialogTextarea').getValue();
									var sId = that.byId('idWorkflow').getText();
									var data_to_sap = {
										"IS_ZMOB_WF_TO_SAP": {
											"WORKFLOW_STATUS": "0001",
											"WORKFLOW_ID": sId,
											"WORKFLOW_TEKST": sText
										}
									};

									var wfItems = that.getView().getBindingContext().sPath + "/WORKFLOW_ITEMS[]";

									var storedOffline = window.localStorage.getItem("offline");
									if (storedOffline === 'true') {
										sap.ca.ui.message.showMessageBox({
											type: sap.ca.ui.message.Type.ERROR,
											message: oEvent.getParameter("message") + "\n" + oEvent.getParameter("responseText") + "\n" + oEvent.getParameter(
												"statusText")
										});
									} else {
										var storedServerName = window.localStorage.getItem("servername");
										var approveService = "http://" + storedServerName + ":8000/test/zfmcall/ZMOB_INV_CHANGE_WORKITEM?format=JSON";

										$.ajax({
											type: "POST",
											url: approveService,
											datatype: "json",
											contentType: "application/json",
											success: function(msg) {
												//console.log(msg);
												if (msg.OK_CODE === 'X') {
													dialog.close();
													that.displayMessage('Invoice succesfully approved');
												} else {
													dialog.close();
													that.displayError('Error approving invoice!');
												}
											},
											data: JSON.stringify(data_to_sap)
										});
										var changeInvoiceService = "http://" + storedServerName + ":8000/test/zfmcall/ZMOB_INV_UPDATE_INVOICE";
										var model = that.getView().getModel();
										var sPath = that.getView().getBindingContext().sPath;
										var data = model.getProperty(sPath);
										var wfItems = data.WORKFLOW_ID_ITEMS;
										var invoice_to_sap = {
											"IS_WORKFLOW_DATA": {
												"WORKFLOW_ID": sId,
												"WORKFLOW_ID_ITEMS": wfItems
											}
										};

										$.ajax({
											type: "POST",
											url: changeInvoiceService,
											datatype: "json",
											contentType: "application/json",
											success: function(msg) {
												//console.log(msg);
												if (msg.OK_CODE === 'X') {
													// Reload app		
													//location.reload();
												} else {
													this.displayError('Error updating invoice!');
												}
											},
											data: JSON.stringify(invoice_to_sap)
										});

									}

								}
							}),
							endButton: new sap.m.Button({
								text: 'Cancel',
								press: function() {
									dialog.close();
								}
							}),
							afterClose: function() {
								dialog.destroy();
							}
						});
						dialog.open();
					}
				}
			}
		}
	},

	handleReject: function(e) {
		var that = this;

		var dialog = new sap.m.Dialog({
			title: 'Reject',
			type: 'Message',
			content: [
        new sap.m.Text({
					text: 'Are you sure you want to reject this invoice?'
				}),
        new sap.m.TextArea('rejectDialogTextarea', {
					width: '100%',
					placeholder: 'Add note (optional)'
				})
      ],
			beginButton: new sap.m.Button({
				text: 'Reject',
				press: function() {
					var sText = sap.ui.getCore().byId('rejectDialogTextarea').getValue();
					var sId = that.byId('idWorkflow').getText();
					var data_to_sap = {
						"IS_ZMOB_WF_TO_SAP": {
							"WORKFLOW_STATUS": "0002",
							"WORKFLOW_ID": sId,
							"WORKFLOW_TEKST": sText
						}
					};
					var storedServerName = window.localStorage.getItem("servername");
					var approveService = "http://" + storedServerName + ":8000/test/zfmcall/ZMOB_INV_CHANGE_WORKITEM?format=JSON";

					$.ajax({
						type: "POST",
						url: approveService,
						datatype: "json",
						contentType: "application/json",
						success: function(msg) {
							if (msg.OK_CODE === 'X') {
								dialog.close();
								that.displayMessage('Invoice succesfully rejected');
							} else {
								dialog.close();
								that.displayError('Error rejecting invoice!');
							}
						},
						data: JSON.stringify(data_to_sap)
					});

				}
			}),
			endButton: new sap.m.Button({
				text: 'Cancel',
				press: function() {
					dialog.close();
				}
			}),
			afterClose: function() {
				dialog.destroy();
			}
		});
		dialog.open();
	},

	handleForwardValueHelp: function(oController) {
		//console.log(oController.getSource());
		var that = this;
		this.inputID = oController.oSource.sId;
		console.log(this.inputID);
		if (!this._valueHelpDialogFW) {
			this._valueHelpDialogFW = sap.ui.xmlfragment("spgprints.view.Forward", that);
			//that.getView().addDependent(this._valueHelpDialogFW);
		}
		var storedOffline = window.localStorage.getItem("offline");
		if (storedOffline === 'true') {
			//var oModelfw = new sap.ui.model.json.JSONModel("model/costcenters.json");
		} else {
			var storedServerName = window.localStorage.getItem("servername");
			var userService = "http://" + storedServerName + ":8000/test/zfmcall/ZMOB_INV_GET_USERS";
			var oModelfw = new sap.ui.model.json.JSONModel(userService, "users");
		}
		//console.log(oModelfw);

		//		var storedOffline = window.localStorage.getItem("offline");
		//		if (storedOffline === 'true') {
		//			var oModelCC = new sap.ui.model.json.JSONModel("model/costcenters.json");
		//		} else {
		//			var storedServerName = window.localStorage.getItem("servername");
		//			var costcenterService = "http://" + storedServerName + ":8000/test/zfmcall/ZMOB_INV_GET_COSTCENTER";
		//			var oModelCC = new sap.ui.model.json.JSONModel(costcenterService);
		//		}
		// Set model costcenters
		//var oView1 = this.getView();
		this._valueHelpDialogFW.setModel(oModelfw, "users");
		this._valueHelpDialogFW.open();
	},

	_handleFWClose: function(evt) {

		var oSelectedItem = evt.getParameter("selectedItem");
		//console.log('selected' + oSelectedItem);
		if (oSelectedItem) {
			var ccInput = this.getView().byId(this.inputID);
			//console.log(ccInput);
			ccInput.setValue(oSelectedItem.getTitle());
		}
		evt.getSource().getBinding("items").filter([]);
	},

	handleForward2: function(e) {
		var that = this;
		globalId = that.byId('idWorkflow').getText();
		console.log(globalId);
		sap.ca.ui.dialog.forwarding.start(this.fnStartSearch, this.fnForwardClose);
	},

	fnStartSearch: function(sQeury) {
		//do the backend request based on the sQuery text       
		var storedServerName = window.localStorage.getItem("servername");
		var getUSersService = "http://" + storedServerName + ":8000/test/zfmcall/ZMOB_INV_GET_USERS?format=JSON";

		$.get(getUSersService, function(data) {
			var arrayLength = data.ET_USERS.length;
			var arrAgents = [];
			var user = {};
			var fullname = '';
			for (var i = 0; i < arrayLength; i++) {
				fullname = data.ET_USERS[i].FIRST + data.ET_USERS[i].LAST;
				user = {
					"UserId": data.ET_USERS[i].UNAME,
					"FullName": fullname
				};
				arrAgents.push(user);
			}

			var filteredArray = arrAgents.filter(function(element) {
				if (sQeury !== '*') {
					return element.FullName.toUpperCase().indexOf(sQeury.toUpperCase()) > -1;
				} else {
					return element.FullName;
				}
			});
			sap.ca.ui.dialog.forwarding.setFoundAgents(filteredArray);
		});
	},

	fnForwardClose: function(oResult) {
		if (oResult.bConfirmed) {
			//oSelectedAgent = oResult.oAgentToBeForwarded;
			//jQuery.sap.log.info("ForwardDialog - forward agent userid: " + oResult.oAgentToBeForwarded.UserId + " note: " + oResult.sNote);
			//console.log(oResult.oAgentToBeForwarded.UserId);
			//console.log(oResult.sNote);
			//console.log(globalId);
			var data_to_sap = {
				"UNAME": oResult.oAgentToBeForwarded.UserId,
				"WI_ID": globalId
			};
			var storedServerName = window.localStorage.getItem("servername");
			var forwardService = "http://" + storedServerName + ":8000/test/zfmcall/ZMOB_INV_FORWARD?format=JSON";
			$.ajax({
				type: "POST",
				url: forwardService,
				datatype: "json",
				contentType: "application/json",
				success: function(msg) {
					//dialog.close();
					switch (msg.OK_CODE) {
						case 'E':
							sap.m.MessageToast.show('Error forwarding to ' + oResult.oAgentToBeForwarded.UserId);
							break;
						case 'F':
							this.displayMessage('Invoice succesfully forwarded to: ' + oResult.oAgentToBeForwarded.UserId);
							break;
						default:
							sap.m.MessageToast.show('Error forwarding to ' + oResult.oAgentToBeForwarded.UserId);
					}
					//location.reload();
				},
				error: function(msg) {
					//dialog.close();
					switch (msg.OK_CODE) {
						case 'E':
							sap.m.MessageToast.show('Error forwarding to ' + oResult.oAgentToBeForwarded.UserId);
							break;
						case 'F':
							this.displayMessage('Invoice succesfully forwarded to: ' + oResult.oAgentToBeForwarded.UserId);
							break;
						default:
							sap.m.MessageToast.show('Error forwarding to ' + oResult.oAgentToBeForwarded.UserId);
					}
					//location.reload();
				},
				data: JSON.stringify(data_to_sap)
			});
			//trigger confirmed forwarding process based on the result parameters          
			//...
			//...
		}
	},

	handleForward: function(e) {
		var that = this;
		var dialog = new sap.m.Dialog({
			title: 'Forward',
			type: 'Message',
			content: [
        new sap.m.Text({
					text: 'Forward to?'
				}),
		new sap.m.Input('emailInput', {
					showValueHelp: true,
					valueHelpRequest: that.handleForwardValueHelp
				})
      ],
			beginButton: new sap.m.Button({
				text: 'Forward',
				press: function() {
					var sText = sap.ui.getCore().byId('emailInput').getValue();
					var sId = that.byId('idWorkflow').getText();
					//console.log(sText);
					//console.log(sId);
					var data_to_sap = {
						"UNAME": sText,
						"WI_ID": sId
					};
					var storedServerName = window.localStorage.getItem("servername");
					var forwardService = "http://" + storedServerName + ":8000/test/zfmcall/ZMOB_INV_FORWARD?format=JSON";
					$.ajax({
						type: "POST",
						url: forwardService,
						datatype: "json",
						contentType: "application/json",
						success: function(msg) {
							dialog.close();
							switch (msg.OK_CODE) {
								case 'E':
									sap.m.MessageToast.show('Error forwarding to ' + sText);
									break;
								case 'F':
									that.displayMessage('Invoice succesfully forwarded to: ' + sText);
									break;
								default:
									sap.m.MessageToast.show('Error forwarding to ' + sText);
							}
							//location.reload();
						},
						error: function(msg) {
							dialog.close();
							switch (msg.OK_CODE) {
								case 'E':
									sap.m.MessageToast.show('Error forwarding to ' + sText);
									break;
								case 'F':
									that.displayMessage('Invoice succesfully forwarded to: ' + sText);
									break;
								default:
									sap.m.MessageToast.show('Error forwarding to ' + sText);
							}
							//location.reload();
						},
						data: JSON.stringify(data_to_sap)
					});

				}
			}),
			endButton: new sap.m.Button({
				text: 'Cancel',
				press: function() {
					dialog.close();
				}
			}),
			afterClose: function() {
				dialog.destroy();
			}
		});
		dialog.open();
	},

	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	 * (NOT before the first rendering! onInit() is used for that one!).
	 * @memberOf spgprints.view.Detail
	 */

	onBeforeRendering: function() {
		// Afhankelijk van inhoud notes maken
		//var notes = this.getView().getBindingContext().getProperty("NOTES");
		//var items = this.getView().getBindingContext().getProperty("WORKFLOW_ID_ITEMS");
		//var bc = this.getView().getBindingContext();
		//var idNotes = this.getView().byId("idNotes");
		//idNotes.setVisible(true);
	},

	onpressAddline: function() {
		var items = this.getView().getBindingContext().getProperty("WORKFLOW_ID_ITEMS");
		//console.log('items' + items);
		items.push({
			"ITEM_AMOUNT": "",
			"ITEM_COSTC": "",
			"ITEM_DESCR": "",
			"ITEM_GL": "",
			"ITEM_PURCHASEORDER": "",
			"ITEM_QUANTITY": "",
			"ITEM_SALESORDER": "",
			"ITEM_SOITEM": "",
			"WORKFLOW_ID": "100XTENSIO"
		});
		//console.log('items' + items);

		var idTable = this.getView().byId("idTable");
		var bc = idTable.getBindingContext();
		//onsole.log('bc' + bc);
		var bcwi = bc.getProperty("WORKFLOW_ID_ITEMS");
		//console.log('bcwi' + bcwi);
		idTable.setBindingContext("WORKFLOW_ID_ITEMS", items);
		sap.ui.getCore().byId("Detail").getModel().refresh(true);

		//var bc = this.getView().getBindingContext();
		//console.log(bc);
		//bc.setProperty("WORKFLOW_ID_ITEMS", items);
		//console.log(bc);
		//this.getView().getBindingContext().setProperty("WORKFLOW_ID_ITEMS", items);
		//var aEmployees = model.getProperty("/employees");

	},

	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @memberOf spgprints.view.Detail
	 */
	onAfterRendering: function() {
		//var bc = this.getView().getBindingContext();
		//console.log(bc);
		//var vis = true;
		//var idNotes = this.getView().byId("idNotes");
		//console.log(idNotes);
		//idNotes.setVisible(vis);
	},

	onBeforeShow: function(e) {}

	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 * @memberOf spgprints.view.Detail
	 */
	//	onExit: function() {
	//
	//	}

});