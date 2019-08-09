
var _=require("lodash");

module.exports={
	dialog: function(title,fields){
		var dialog={
			title: title || "Unnamed widget",
			items: {
				tabpanel: {
					widget:"tabs",
					items:{
						general: {
							widget: 'panel',
							title: 'General',
							items: {
								label: {widget:"textfield", description:"The visible field label.  Defaults to 'name' above, but can be customized here."},
								name: {widget:"textfield", description:"Field name under which this field's value will be stored. Example: 'my_field'"},
								description: {widget:"textfield", description:"Help/hint text which is shown below the field in the dialog."}
							}
						},
						validation: {
							widget: 'panel',
							title: 'Validation',
							items: {
								required: {widget: "selection", type: "checkbox",name: 'validation/required' },
								requiredText: {widget: 'textfield', description: 'Optional. Defaults to "This field is required."', name: 'validation/requiredMessage'},
								pattern: {widget: "textfield",name: 'validation/pattern', description: 'Must be a valid regular expression. Validates that the entered value matches this pattern.' },
								patternText: {widget: 'textfield', description: 'Optional. Defaults to "The field value you provided is not allowed"', name: 'validation/patternMessage'}
							}
						}
					}
				}
			}
		}

		console.log('dialog', dialog);
		_.assign(dialog.items.tabpanel.items.general.items,fields)

		return dialog;
	}
}