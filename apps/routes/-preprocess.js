

module.exports.process=function(model, $, cb){
	if($.express.req.bl.mode!=="author"){
		cb("Tools not available in this mode");
	}else{
		cb();
	}
};

