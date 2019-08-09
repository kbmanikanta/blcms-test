var _=require("lodash");

//**********************************************************************************************/
module.exports.process = function(data, $, cb){


 	var helpers = global.bl.modules.modelHelpers;

	_.assign(data, helpers.blacklight.edit.getPageData($.express.req, null, data.modes));

	data.scripts.js.push("blacklight/develop/js/component-manager-client.js")


	data.blConfig.modes = {
		edit:{prefix:global.bl.appsMount + "blacklight/edit/page", icon:"mode_edit",title:"Edit"},
		code:{prefix:"", icon:"code",title:"Code"},
		view:{postfix:".template.html", icon:"visibility", title:"View"},
		raw:{postfix:".raw", icon:"view_quilt", title:"X-ray"}
	}

	data.blConfig.treeBasePath = data.blConfig.appsMount + "blacklight/develop/components";
	data.blConfig.hasPageListingCapability = true;
	data.blConfig.treeIgnoreProxy=true;
	data.blConfig.treeIcon = "fa fa-cube";
	data.blConfig.defaultFrameMode = "edit";

	data.menuItems={
		add:{
			linkAttributes:'data-target="bl-add-component-dialog"',
			title:"Add component"},

		delete:{
			linkAttributes:'data-target="bl-delete-component-dialog"',
			title:"Delete component", divider:true  },
	}



	data.config.breadcrumb.push({name:"Components", link:data.blConfig.appsMount + "blacklight/develop/cm"})
	data.config.pageTitle = "Edit Components";

	helpers.blacklight.edit.setFrameScripts(data);
	helpers.blacklight.edit.processScripts(data, $.express.req.bl.config.publicMount);


 cb(null);

}