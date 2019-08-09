'use strict';

var _=require("lodash");
var fs=require("fs");
var _url=require("url");
var _path=require("path");
var listingCache={};
var slingService;
var stream=require("stream");
const crypto = require('crypto');
var log = global.bl.logger.get("develop/components")

// TODO:  Handle sling service 404's

//**********************************************************************************************/
module.exports.process = function(data, $, cb){

	if(!slingService){initSlingService();}

	var config=$.express.req.bl.config;

	var urlBase = config.appsMount + "blacklight/develop/components";
	var docRoot = _path.join(global.bl.appRoot, "components", $.page.action || "");
	var pages=[];
	var req = $.express.req, res=$.express.res, next=$.express.next;


	if(req.method==="POST"){
		///////////////////////////////////////////////////////////////////////
		if($.page.selectors.indexOf("code")>-1){
			var partialPath = req.body.partialPath;
			var subfolder;
			_path.join(global.bl.appRoot, "components", $.page.action || "");

			if(!partialPath){$.handleError("Missing 'partialPath' parameter in POST", 403); return;}

			var hash=global.bl.getHash(partialPath);
			if(hash !== req.body.hash){$.handleError("Bad hash value", 403); return;}

			var depth=partialPath.split("/").length;
			if(depth===3){
				subfolder = "apps";
			}else{
				subfolder = "components";				
			}

			var fullPath = _path.join(global.bl.appRoot,subfolder, partialPath);

			fs.writeFile(fullPath, req.body.code, (err)=>{
				if(err){log.error(err); $.handleError("Problem saving file: " + fullPath);}
				else{res.json({message:"OK! Wrote file."});}
			})
			
		///////////////////////////////////////////////////////////////////////
		}else{
			slingService(req,res,next);			
		}

	}else{
		if($.page.extension==="json"){
			if($.page.selectors.indexOf("list")>-1){ // todo:  list-pages should be part of sling-service.  But cache clear needs to be available.
				pageListingJson();
			}else{
				slingService(req,res,next);
			}
		}else{
			req.skipStatic=true;
			next();
		}
	}



	/**********************************************************************************************/
	function pageListingJson(){

		var files=listFiles(docRoot);
		if(files){
			_.each(files, (file)=>{
				var match=file.match(/^([^.]*)$/);
				if(match){
					var childFiles = listFiles(docRoot + "/" + file) || [];
					pages.push({path: _path.join(urlBase, $.page.action, file), title: file,hasChildren:childFiles.length>0, childPagesCount: childFiles.length})
				}
			});

			data.pageCount=pages.length;
			data.pages=pages;

			cb(null);		
		}

		/////////////////////////////////////////////
		function listFiles(root){
			try{
				var files=listingCache[root];
				if(!files){
					files=fs.readdirSync(root);
					_.remove(files,(file)=>{return file.indexOf(".")>-1;})
					listingCache[root]=files;
				}
				return files;
			}catch(err){
				var msg="Error reading: " + root;
				throw new Error(msg);
			}
		}	
	}


}


///// Clear page listing cache when components on disk change
if(global.bl.componentWatch){
	global.bl.componentWatch.on("change", (f)=>{
		listingCache={};
	});
}



//**********************************************************************************************/
function initSlingService(){
	if(slingService){return;}
	var serviceBuilder = require("sling-middleware")
	slingService=serviceBuilder(
		{
			fileRoot: _path.join(global.bl.appRoot, "components/"),
			fileFormat: "json",
			namespaces: {bl: {}},
			pathRewrite: (path)=>{return path.slice(11)},  // "11" is the length of "components/"

			folderDefaults: function(context, cb){

				var defaults={}
				var parts=context.path.split("/");
				var rtype="blacklight/develop/component";

				if(parts.length===2){
					rtype="blacklight/develop/site";
				}else if(parts.length===3){
					rtype="blacklight/develop/module";
				}

				defaults.content={
					"jcr:primaryType":"nt:folder",
					"jcr:content":{
						"sling:resourceType":rtype
					}
				} 
				
				cb(null, defaults);

			},
			
			on:{
				read: function(err, result, req, cb){ 

					if(err && req.sling.path.split("/").length>4){     /// Send back an empty component type if actual compnent data is missing
						err=null;
						result={
							"sling:resourceType":"blacklight/develop/component",
							"bl:placeholderStub":true
						}
					}
					cb(err, result);
				}
			}
		}
	);

}

//**********************************************************************************************/
module.exports.componentSling = function(resourceType, callback){
	var path=_path.join(global.bl.appRoot, "components", resourceType);
	fs.readdir(path,(err, files)=>{
		if(err){callback(err);return;}
		callback(null, {
			"jcr:title":"My fancy component",
			"sling:resourceType":"blacklight/develop/component", resourceType, path, files,			
			dialog:{
				"sling:resourceType":"blacklight/develop/component/dialog-item",
				"title": "My fancy component"
			}
		});


		/// HOW DO YOU DETECT IF THE DIALOG.js FILE IS manually including the component.json file?
		/// What about, don't detect it?  Or, do detect it with a special property in the json file, auto-injected by the injector. 
		/// so if invoked manually the auto-injector can detect it, and abort.
		/// But either way, you'll want a facility to auto-merge the component.json values at the BL level.


		//// you'll want  blacklight/develop/widgets/datefield/dialog.js   etc.
		//// and   blacklight/develop/component/dialog  and .../container  and  .../page
	})
}



//**********************************************************************************************/
module.exports.slingProxy = function(info, slingConnector, callback){
	initSlingService();

	var marker="/blacklight/develop/components/";
	var offset=info.path.indexOf(marker) + marker.length;
																								// var resourceType = info.path.slice(offset).replace(/\/[^\/]*$/,"");
	var path = info.path.slice(offset);


	var res={
		json:function(slingData){
			callback(null,slingData);
		},
		status:function(){return;},
		end:function(){}
	}

	if(slingConnector.mode!=="author"){
		throw new Error("This tool is not available in this mode.");
	}

	var req={
		method:"GET",
		url: "/components/" + path
	}


	slingService(req,res);


	// // if(!slingService){initSlingService();}
	// module.exports.componentSling(resourceType, callback)

}



module.exports.editProxyOverride = function(req,res,next){
	initSlingService();
	
	slingService(req, res, next)
}





