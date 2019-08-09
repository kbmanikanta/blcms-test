
exports.dialog=function($){
	var dialog={
			title: "Component details",
			items: {
				fields: {
					widget:"panel",
					items:{
						name_hint: {widget:"textfield", description:"Preferred node name to use when writing to repository"},
						dont_append_configuration: {widget:"selection", label:"Don't auto-append GUI configurations", type:"checkbox", description:"If checked, Blacklight will NOT automatically append any configuration entered via this component's bl.develop GUI.  Please note that configs entered via the GUI are always available for manual inclusion (for example as the first parameter to the 'dialog' function in 'dialog.js').  If you wish to include your GUI configuration manually like this, then check this box to minimize the risk of the configurations appearing twice."},
						template_write_rules: {widget:"selection", options:[{title:"Default", value:""},{title:"Always write",value:"always_write"},{title:"Never write",value:"never_write"}],  description:"By default a component's template will write locally when created under /content/, and will dynamically map when created under /develop/ (i.e. when composited into another component). If written locally, the template will no longer track changes to the source template's content.  However, writing locally has the advantage of being able to be searched and directly acted upon at the Sling server level."},
						help: {widget:"markdown", description:"Here is where you can enter expanded help text for this component, using Markdown."}
					}
				}
			}
	}

	return dialog;
}


