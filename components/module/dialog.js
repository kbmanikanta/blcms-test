exports.dialog=function($){
    var dialog={
        title: "Module Settings",
        items: {
            title:{widget:"textfield"},
            preview_template:{widget:"textfield", description:"Resource type of page template to place content (non-page) components for preview"},
            placement_path:{widget:"textfield", description:"Path to the parsys inside of above preview template in which to place a component for preview."}
        }
    };
    return dialog;
};
