var _=require("lodash");
var _path=require("path");
var codeEditor=require("../code-editor/code-editor")
var helpers = global.bl.modules.modelHelpers.blacklight.develop;
var modelHelpers = global.bl.modules.modelHelpers;
var util=require("util");


/**************************************************************************/
/**************************************************************************/
exports.process=function(model, $){

	var modulePath;
	var req=$.express.req;

	model.blConfig = modelHelpers.blacklight.edit.getBlConfigClient(req);
	const publicMount = model.publicMount = model.blConfig.publicMount;
	model.meta=model.meta||{}

	var rtype=helpers.rtypeFromPath($);
	_.set(model,"meta.page_type", rtype);
	

	if($.page.selectors.indexOf("template")>-1){
		model.meta.templateMode = true;
		
		if(model.template && model.template._meta){
			model.template._meta._sling_resourceType = rtype;
		}else{
			model.template={_meta:{_sling_resourceType: rtype}}
		}

		$.resolve();
	}else{

		var tail=rtype.split("/").pop();
		modulePath=rtype.split("/").slice(0,2).join("/");
		var root=_path.join(global.bl.appRoot, "components", rtype);
		var fileList;

		codeEditor.getScripts(model);

		model.rtype=rtype;
		model.files={};
		var files={
			SCSS: {path:`${tail}.scss`, mode:"sass", default:`.${tail} {\n\n}`},
			Template: {path:`${tail}.hbs`, mode:"handlebars", default: req.bl.renderRegistry.getDefaultTemplate(rtype)}, 
			Processor: {path:`${tail}.js`, mode:"javascript"}, 
			Dialog: {path:`dialog.js`, mode:"javascript"}, 
			Container: {path:`container.js`, mode:"javascript"},
			Documentation: {path:`${tail}.md`, mode:"markdown"}
		};


		codeEditor.getFiles(files, {root:root, partialPath:rtype}, (err, files)=>{
			if(err){$.reject(err);}			
			else{ model.files=files; $.resolve(); }
		});
	}

};

exports.async=true;



/**************************************************************************/
/**************************************************************************/
/**************************************************************************/
exports.preprocess=function(model, $, cb){
	var rtype = helpers.rtypeFromPath($);
	var modulePath;

	if($.page.selectors.indexOf("template")>-1){

		var page=model.page || {};

		if(page.component_type === "is_content" || (page.component_type !== "is_page" && /\/content\//.test(rtype))){
			modulePath = rtype.split("/").slice(0,2).join("/");
			var site=modulePath.split("/").shift();
			var registry = _.get(global.bl.sites,[site,"registry"]);
			var preview_template = page.preview_template
			var placement_path = page.placement_path || "";
			var template;

			if(!preview_template){
				var mod = registry.get(modulePath);
				preview_template = _.get(mod, "configFromGui.preview_template");
				placement_path = placement_path || _.get(mod, "configFromGui.placement_path", "");
			}

			if(preview_template){
				placement_path = placement_path.replace(/^template\//, "");
				var templateComponent = registry.get(preview_template);
				template = templateComponent ? templateComponent.mangledTemplate : null;

				if(!template){
					/// TODO: This should use  templateComponent.getGuiTempate({mangled:true})
					template = _.get(templateComponent, "configFromGui.template");
					templateComponent.mangledTemplate = _.cloneDeep(template);
					$.sling.mangleNamespaces(templateComponent.mangledTemplate);
					template = templateComponent.mangledTemplate;
				}


				var targetStruct = _.get(template, placement_path.split("/"));
				if(!targetStruct){throw new Error("Error: no preview target found in preview page '" + preview_template + "' at property path: '" + placement_path + "'");}
				var newContent = {"_sling_resourceType":targetStruct._sling_resourceType, preview:model.template}
				_.set(template, placement_path.split("/"), newContent);

				model.template = template;

				global.bl.mappingDeref(model.template, $, {markLocals:false,leaveMangledNames:false}, cb)
			}else{
				global.bl.mappingDeref(model.template, $, {markLocals:false,leaveMangledNames:false}, cb)
			}
		}else{
			global.bl.mappingDeref(model.template, $, {markLocals:false,leaveMangledNames:false}, cb)			
		}
	}else{
		global.bl.mappingDeref(model.template, $, {markLocals:false,leaveMangledNames:false}, cb)			
	}
}




