var _=require("lodash");
var _path=require("path");
var registry=global.bl.componentRegistry;
var excludedWidgets=["panel","tabs", "heading"];
var excludedTypes=["foundation/components/parsys"];

exports.process=function(data, $, cb){
	var req=$.express.req;
	if(!req.query.path){$.handleError("No 'path' specified in query string.");return;}
	var allFields=[], existingFields=[];


	var sc=req.bl.sling;
	sc.get(req.query.path,"infinity",(err,model)=>{
		var rtype=model._sling_resourceType;
		var pageLevelMode = rtype==="blacklight/develop/component";

		if(err){$.handleError("Problem getting: " + req.query.path, err);return;}
		_.each(model.dialog_fields,(field,idx)=>{
			if(field._sling_resourceType){
				var name=field.name.replace(/^\.\//,"");
				existingFields[name]=field;
			}
		});

		if(pageLevelMode){
			getAllFields(model.template,"","");
		}else{
			var match=req.query.path.match(/.*\/jcr:content\/template\/(.*)/);
			if(match){				
				getAllFields(model,match[1],"")
			}else{
				console.error("Unexpected path param to bl/develop/dialog-fields.js:", req.query.path)
			}
		}
		data.allFields = allFields;
		cb();
	})


	function getAllFields(model, basePath, componentPath){
		if(!model){return;}
		var rtype=model._sling_resourceType;
		if(rtype){
			var component=registry.get(rtype);
			if(excludedTypes.indexOf(rtype)<0){
				componentPath=componentPath + (componentPath?" / ":"") + component.title;
				allFields.push({componentTitle: componentPath});
				_.each(component.allWidgets,(widget,idx)=>{
					if(widget.widget && excludedWidgets.indexOf(widget.widget)<0){
						var path=_path.resolve("/" + basePath + "/", widget.name).replace(/^\//,"").replace(/\\/g,"/");
						allFields.push({path, widget:widget, exists:existingFields[path]?true:false});
					}
				});
			}
		}
		_.each(model,(val,key)=>{
			if(_.isPlainObject(val)){
				var curBasePath = basePath + (basePath?"/":"") + key;
				getAllFields(val, curBasePath, componentPath);
			}
		})
	}
};



