
module.exports.getResourceType=function(slingPath){
	var marker="blacklight/develop/components/", index=slingPath.indexOf(marker);
	return slingPath.slice(index + marker.length).split("/");
}