var _=require("lodash");
var fs=require("fs");
var _path=require("path");



/************************************************************************************/
exports.getFiles = function(fileList, options, cb){
	var todo=_.keys(fileList);
	var foundFiles;
	var result={};

	var nextItem=function(){
		if(todo.length){
			var key=todo.shift();
			var curItem = fileList[key];
			var fullPath = _path.join(options.root, curItem.path);
			var partialPath = _path.join(options.partialPath, curItem.path)
			var curTarget = result[key] = {title:key, path:curItem.path, mode: curItem.mode, partialPath, hash: global.bl.getHash(options.partialPath + "/" + curItem.path)}
			
			if(foundFiles.indexOf(curItem.path)>-1){
				fs.readFile(fullPath, (err, data)=>{
					if(err){curTarget.contents="Problem reading file " + fullPath;}
					else{curTarget.contents=data.toString();}
					nextItem();
				})
			}else{
				curTarget.default=curItem.default || "";
				nextItem();
			}
		}else{
			cb(null, result)
		}
	}


	fs.readdir(options.root,(err, files)=>{
		if(err){cb("Problem reading component folder: " + options.root); return;}
		foundFiles=files;
		nextItem();
	})

}


/************************************************************************************/
exports.getScripts=function(model){
	const publicMount = model.blConfig.publicMount;	
	model.scripts={
			css:["blacklight/develop/css/develop.css", "blacklight/develop/vendor/codemirror/lib/codemirror.css"],
			js:[
				publicMount + "blacklight/develop/vendor/codemirror/lib/codemirror.js",
				publicMount + "blacklight/develop/vendor/codemirror/addon/mode/simple.js",
				publicMount + "blacklight/develop/vendor/codemirror/addon/mode/multiplex.js",
				publicMount + "blacklight/develop/vendor/codemirror/mode/xml/xml.js",
				publicMount + "blacklight/develop/vendor/codemirror/mode/css/css.js",
				publicMount + "blacklight/develop/vendor/codemirror/mode/javascript/javascript.js",
				publicMount + "blacklight/develop/vendor/codemirror/mode/htmlmixed/htmlmixed.js",
				publicMount + "blacklight/develop/vendor/codemirror/mode/handlebars/handlebars.js",
				publicMount + "blacklight/develop/vendor/codemirror/mode/sass/sass.js",
				publicMount + "blacklight/develop/js/develop-code.js",
			]
		}
}





