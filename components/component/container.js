
var _path=require("path");
var fs=require("fs");
var _=require("lodash");
var widgets;

exports.container = function($){
	loadWidgets();



	return {
		title:"Component definition",
		includes:[
			{name: "page", type:"blacklight/develop/component/page-config"},
			{name: "settings", type:"blacklight/develop/component/component-config"},

			{name: "template", type:"foundation/components/parsys", title:"Template content", icon:"view_compact",
				eccItems:($)=>{
					var path =$?$.slingPath:"";

					var pageOptions={
						suggested:["*/*/layouts/*"],
						allowed:["*/*/pages/*"]
					}

					var componentOptions={
						suggested:["*/*/content/*"]
					}

					if(/\/content\//.test(path)){
						return componentOptions;
					}else if(/\/pages\//.test(path)){
						return pageOptions;
					}else{
						_.merge(pageOptions.suggested, componentOptions.suggested);
						return pageOptions;
					}
				}
			},


			{name: "dialog_fields", type:"foundation/components/parsys", title:"Dialog fields", icon:"web_asset",
				eccItems:widgets,
			},

			{name: "includes", type:"foundation/components/parsys", title:"Editable components (from template)",
				eccItems:"blacklight/develop/component/include", icon:"apps"
			},

			{name: "named_maps", type:"foundation/components/parsys", title:"Named data mappings",
				eccItems:"blacklight/develop/component/datamap", icon:"location_searching"
			},

		]
	}
}


function loadWidgets(){
	if(widgets){return widgets;}
	var path=_path.resolve(global.bl.appRoot, "components/blacklight/develop/widgets");
	widgets=[];
	var widgetDirs = fs.readdirSync(path) 
	_.each(widgetDirs, (widget)=>{
		try{
			var testPath = _path.resolve(path, widget, "dialog.js");
			fs.statSync(testPath);
			widgets.push({type:"blacklight/develop/widgets/" + widget})
		}catch(err){}
	})
}

