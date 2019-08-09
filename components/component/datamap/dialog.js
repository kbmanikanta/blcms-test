
exports.dialog=function($){
	var dialog={
			title: "Named datamap",
			items: {
				fields: {
					widget:"panel",
					items:{
						title: { widget:"textfield", label:"Datamap name", description:"Click 'DATA MAP' button below to edit datamap details."}
					}
				},
			}
	}

	return dialog;
}


