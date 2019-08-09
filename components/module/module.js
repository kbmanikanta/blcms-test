var _=require("lodash");
var _path=require("path");
var codeEditor=require("../code-editor/code-editor")



exports.process=function(model, $){
	var rtype;

	model.blConfig = global.bl.modules.modelHelpers.blacklight.edit.getBlConfigClient($.express.req);
	model.publicMount = model.blConfig.publicMount;
	var match = $.page.trimmedPath.match(/\/blacklight\/develop\/components\/(.*)/);
	if(match){
		rtype=match[1];		
		_.set(model,"meta.page_type", rtype);
	}

	var tail=rtype.split("/").pop();
	var module=rtype.split("/").slice(0,2).join("/");
	var root=_path.join(global.bl.appRoot, "apps", rtype);
	var fileList;

	codeEditor.getScripts(model);

	model.rtype=rtype;
	model.files={};
	var files={
		Routes: {path:`routes.js`, mode:"javascript"}, 
		Rooted_Routes: {path:`rooted-routes.js`, mode:"javascript"}, 
		Helpers: {path:`model-helpers.js`, mode:"javascript"},
		Collections: {path:`collections.js`, mode:"javascript"}
	};

	if(/\/site$/.test(rtype)){
		files.Site={path:"site.js", mode:"javascript"};
	}

	codeEditor.getFiles(files, {root:root, partialPath:rtype}, (err, files)=>{
		if(err){$.reject(err);}			
		else{ 
			model.files=files; 
			$.resolve(); 
		}
	});

};

exports.async=true;
