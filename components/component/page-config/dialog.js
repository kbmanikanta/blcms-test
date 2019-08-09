
exports.dialog=function($){

	var dialog={
			title: "Page or Content?",
			items: {
				fields: {
					widget:"panel",
					items:{
						component_type: { widget:"selection",  label:"Page or content component?", options:[{value:"", title:"Determine from parent folder"},  {value:"is_page", title:"Page component"}, {value:"is_content", title:"Content component"}]},

		            preview_template:{widget:"textfield", description:"Resource type of page template to place content (non-page) components for preview"},

		            placement_path:{widget:"textfield", description:"Path to the parsys inside of above preview template in which to place a component for preview."},

						allowedChildPages: {widget:"multifield", multiple: true, options: function(context, cb){
							var x=0;
							console.log("context:", context)
							cb(null, ["one","two","three"]);
						}, fieldConfig:{
							widget:"textfield"
						}},


					}
				},
			}
	}

	return dialog;
}


