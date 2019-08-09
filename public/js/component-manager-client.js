/* globals $, window */

$(function(){

		$("#page-actions a[data-target]").each(function(idx,val){
		var $btn=$(val);
		var action=$btn.data("action");
		var view = window.BL.view;

		switch(action){
			case "delete":
				$btn.click(onDeleteRequest);
			break;

			case "add":
				$btn.click(onAddComponent);
			break;
		}





		/****************************************************/
		// TODO: NOT DRY!  Shared with page-manager-client.js
		function onDeleteRequest(){
			var $dialog=$("#bl-delete-component-dialog");
			var $deleteButton = $dialog.find(".bl-delete-button");
			var $modalContent=$dialog.find(".modal-content");
			var slingPath=view.path();

			$deleteButton.off().click(function(){
				var uri;
				uri= window.BL.config.slingProxyPrefix + view.path();

				var fd=new window.FormData();
				fd.append("_charset_", "utf-8");
				fd.append(":operation", "delete");

				var request = new window.XMLHttpRequest();
				request.open("POST",uri);
				request.send(fd);
				request.onload = function(event) {
					if (request.status === 200) {
						var pathParts=slingPath.split("/");
						pathParts.pop();
						view.path(pathParts.join("/"));
						window.document.location.reload(true);
						$dialog.closeModal();
					} else {
						$modalContent.html("<span class='red-text'>Error deleting content at '" + slingPath +"' </span>");
					}
				};
			});

			$dialog.css({height:"80%", width:"90%", maxWidth:"900px"});

			$modalContent.html("<span class='red-text'>Are you sure you wish to delete this <span class='page-and-children'>component</span>?</span><div class='card' style='margin:12px; width: calc(100% - 72px); max-height:calc(100% - 200px); overflow-y:scroll; overflow-x:scroll;  padding:8px;'><ul style='margin:0;' class='page-delete-listing'><li>" + slingPath + "</li></ul></div>");
			$dialog.openModal({top:"14%"});

			var pageListingUrl = window.BL.config.slingProxyPrefix + slingPath + ".list-pages.1.json";
			$.ajax({url:pageListingUrl, dataType:"json"})
				.done(function(data){
					if(data){
						var html=$.map(data,function(val){return("<li>"+val+"</li>");});
						$("ul.page-delete-listing").append(html.join("\n"));

						if(data.length>0){
							$("span.page-and-children").html("component and its " + data.length + " child components" + (data.length>1?"s":"") );
						}

					}
				});

		}	




		/****************************************************/
		// TODO: NOT DRY!  Shared with page-manager-client.js
		function onAddComponent(){
			var slingPath=view.path()
			var marker = "/develop/components/";

			if(slingPath.slice(slingPath.indexOf(marker) + marker.length).split("/").length < 2){
				window.alert("The parent folder is a site-level path.\n\nPlease create or install a Blacklight module here if you wish to have a folder.");
				return;
			}

			var $dialog=$("#bl-add-component-dialog");
			$dialog.css({height:"80%", width:"90%", maxWidth:"900px"});
			$dialog.openModal({top:"14%"});
			var $modalContent=$dialog.find(".modal-content");

			var $addButton = $dialog.find(".bl-add-button");
			var $addPathNameField=$("#add_path");

			$addButton.off().click(function(){

				var uri;
				uri= window.BL.config.slingProxyPrefix + view.path() + "/*";

				var fd=new window.FormData();

				fd.append("_charset_", "utf-8");

				var pathName = $addPathNameField.val();
				var title= (window.BL && window.BL.utils) ? window.BL.utils.prettyName(pathName, {allCaps:true}) : pathName.replace(/[^a-zA-Z0-9]/g," ");

				fd.append(":name", pathName);
				fd.append("jcr:primaryType", "nt:folder");
				fd.append("jcr:content/jcr:primaryType", "nt:unstructured");
				fd.append("jcr:content/sling:resourceType", "blacklight/develop/component");
				fd.append("jcr:content/title", title);


				var request = new window.XMLHttpRequest();
				request.open("POST",uri);
				request.send(fd);
				request.onload = function(event) {
					if (request.status >= 200 && request.status < 300) {					
						var newPage =  request.getResponseHeader("location");
						if(!newPage){
							$modalContent.html("<span class='red-text'>Error adding component at '" + slingPath +"' </span>" + "<pre>No redirect header from sling server\n" + request.response.toString() + "</pre>" );
							return;
						}
						newPage= newPage.split("/").pop();
						var newPath = view.path() + "/" + newPage;
						view.path(newPath);
						window.document.location.reload(true);
					} else {
						$modalContent.html("<span class='red-text'>Error adding component at '" + slingPath +"' </span>");
					}
				};

			});

		}
	});




})