/* globals window, $ */

var blacklight={develop:{}}


////////////////////////////////////////////////////////////////////////////////////////////
blacklight.develop.bl={

	pageMenus:{
		"component":function(context){
			if(/jcr:content\/template/.test(context.path)){
				return [
					{
						title:"Add dialog field",
						icon:"add_circle_outline",
						action:dialogFieldAction
					},
					{
						title:"Add full component",
						icon:"add_circle_outline",
						action:addChildAction
					},

					{
						title:"Go to definition",
						icon:"launch",
						action:goToComponentDefinition
					},

				]
			}else if(/jcr:content\/dialog_fields/.test(context.path)){
				return[
					{
						title:"Change widget type",
						icon:"shuffle"
					}
				]
			}
		}
	},


	menus:{
		"component":[
			{
				title:"Dialog Fields",
				icon:"desktop_windows",
				action:dialogFieldAction
			}
		]
	}
}


/***************************************************************************************************/
function addChildAction(context){

	var match=context.path.match(/\/?(.*)\/jcr:content\/template\/(.*)/);
	if(!match){
		throw new Error("Unexpected path for editable child comopnenent add: " + context.path)
	}

	var slingPath="/" + match[1] + "/jcr:content/includes/";
	
	var $btn=$("<a class='tmp-button'></a>")
	$btn.attr("data-sling-type","blacklight/develop/component/include")
	$btn.attr("data-title", "Add new editable child component" );
	$btn.attr("data-add-mode", true);
	$btn.attr("data-target", context.editDialog.getId());
	$btn.attr("data-sling-path", slingPath);
	$btn.data("content", {template_path:match[2]})
	$btn.modalButton(context.editDialog.getStandardEditDialogOptions());
	$btn.click();
}

/***************************************************************************************************/
function goToComponentDefinition(context){
	var path=window.BL.page.path.match(/(.*)(\/develop\/components\/)(.*)/);
	var prefix=window.BL.config.appsMount || "";
	var newUrl = prefix + "blacklight/edit/page/alt/apps/blacklight/develop/components/" + context.type
	window.document.location.assign(newUrl);
}

/***************************************************************************************************/
function dialogFieldAction(context){

	var dialogUrl= window.BL.config.appsMount + "blacklight/develop/dialog-fields.js"
	var $dialog=context.buildDialog({
		noSave:true
	});

	$dialog.loadBody({url:dialogUrl, data:{path:context.path, type:context.type}, title:"Manage Dialog Fields"})
	.then(function(data, $dialogBody){
		$dialogBody.find(".bl-add").each(function(){
			var $btn=$(this);
			var content=$btn.data("content");
			var path=$btn.data("path");
			var rtype="blacklight/develop/widgets/" + content.widget;
			$btn.attr("data-sling-type",rtype)
			$btn.attr("data-title", "Add new dialog field" );
			$btn.attr("data-add-mode", true);
			$btn.attr("data-target", context.editDialog.getId());
			$btn.css("cursor", "pointer");

			var slingPath=window.BL.config.page.path + "/" + "jcr:content/dialog_fields/"
			$btn.attr("data-sling-path", slingPath);

			content.name = path;
			content.label = content.fieldLabel;
			delete content.fieldLabel;  delete content.widget;

			// console.log("BTN CONTENT:", content);
			$btn.modalButton(context.editDialog.getStandardEditDialogOptions());
			$btn.click(function(){
				$dialog.closeModal();
			})
		});
	})
}



module.exports=blacklight.develop;



