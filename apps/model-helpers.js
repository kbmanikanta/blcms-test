
var $={blacklight:{develop:{}}};

$.blacklight.develop.mything = "my thing";


$.blacklight.develop.rtypeFromPath=function($){
	var match = $.page.trimmedPath.match(/\/blacklight\/develop\/components\/(.*)/);
	if(match){
		return match[1];	
	}else{
		return "";
	}
}






module.exports = $.blacklight.develop;
