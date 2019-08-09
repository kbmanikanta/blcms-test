
exports.dialog=function($){
    var dialog={
        title: "Editable Component",
        items: {
            title:{widget:"textfield", description:"Idetifying label for this component"},
            template_path:{widget:"textfield"}
        }
    };
    return dialog;
};
