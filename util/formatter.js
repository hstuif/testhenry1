jQuery.sap.declare("spgrints.util.formatter");
jQuery.sap.require("sap.ui.core.format.DateFormat");

spgprints.util.formatter = {
	date : function (value) {
		if (value) {
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"}); 
			return oDateFormat.format(new Date(value));
		} else {
			return value;
		}
	}
};