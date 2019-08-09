/* globals $, CodeMirror, window, document, Materialize */

$(function(){

	$("ul.tabs").tabs({
		onShow:function($tab){
			initializeTab($tab);
		}	
	});


	var activeId = $(".tab .active").attr("href");
	initializeTab($(activeId))

	function initializeTab($tab){
		if(!$tab.data("initialized")){			
			var $textarea = $tab.find("textarea");
			if($textarea.length){
				var mode = $tab.data("mode");
				var dirty=false;
				var $tabButton= $("#" + $tab.attr("id") + "-button" + " i");
				if(mode==="handlebars"){mode={name: "handlebars", base: "text/html"};}
				var mirror = CodeMirror.fromTextArea($textarea.get(0), 
					{
						lineNumbers: true,
						indentUnit: 4,
						indentWithTabs: true,
						mode: mode
					}
				);
				$textarea.data("mirror", mirror);
				if(!mirror.getValue()){
					mirror.setValue($tab.data("default-value"));
				}

				mirror.on("change",function(){
					if(!dirty){
						$tabButton.text("error_outline");
						dirty=true;
					}
				});

				$tab.on("save", function(){
					$tabButton.text("check");
					dirty=false;
				});
			}

			$tab.data("initialized", true);
		}
	}



	$(".save-code").click(function(){
		var $btn = $(this);
		var $txt = $btn.siblings("textarea");
		var $tab = $btn.parent(".tab-body");
		var mirror = $txt.data("mirror");
		var partialPath = $txt.data("partial-path");
		var hash = $txt.data("hash");
		var val=mirror.getValue();

		$.ajax({url:document.location.href + ".code.json", method:"POST", data:{code: val, partialPath:partialPath,  hash:hash}})
		.done(function(x){
			Materialize.toast(x.message, 2000);
		})
		.fail(function(conn, other, body){
			console.error("uh-oh, error:", conn.responseJSON)
			Materialize.toast("Error saving file.", 15000);
		})

		$tab.trigger("save");

	});




	$(window).keydown(function (e){
	    if ((e.metaKey || e.ctrlKey) && e.keyCode === 83) { /*ctrl+s or command+s*/
	    	var $link=$("ul.tabs li a.active");
	    	var $active=$($link.attr("href"));
	    	$active.find(".save-code").click();
			e.preventDefault();
			return false;
	    }
	});


})