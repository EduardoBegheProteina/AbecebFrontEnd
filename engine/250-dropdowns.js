function htRenameDialog( contextHTli ){

   	var currentName = $( contextHTli ).cpGetData('cpTitle')

	bootbox.prompt({
	  title: "Nuevo nombre:",
	  value: currentName,
	  callback: function(result) {
				if ( result === null || result == "" ) {
					// Nothing to do
				} else {
					$( contextHTli ).find('.var-title').text( result );
					$( contextHTli ).cpSetData( {'title': result})
					//console.log("Renombrar a: " + result);
					$('#sortableHtPages').attr("workspaceNameHolder", result);
					$('#sortableHtPages').attr("workspaceIDHolder", contextHTli.attr("workspaceID"));
					$('#sortableHtPages').cpPersist(events.sidebarRename);
					
					//Es la HT activa? reflejar en topTitle
					if ( $("#topHTtitleH1") &&
						$("#topHTtitleH1").cpGetAncestor().cpGetData('abecebObjectId') &&
						$("#topHTtitleH1").cpGetAncestor().cpGetData('abecebObjectId') ==
						$( contextHTli ).cpGetData('abecebObjectId')
						){
						//es la HT activa! reflejamos el cambio.
						$("#topHTtitleH1").text( result );
						widgetSaveToHTidUpdate();
						}
					
					
				}
			}
		});

}


function showMetadataDialog ( metadata ){
		/*
		//formato metadata: key / value
		metadata = { 
			"nombre": "Ingresos Corrientes -IC- (millones de AR$)",
			"metodoDeAgregacion": "" }
		*/
		
		var metadataString = ""
		for (variable in metadata) {
		
			var unCamelVarname = variable
		    	// insert a space before all caps
			    .replace(/([A-Z])/g, ' $1')
			    // uppercase the first character
			    .replace(/^./, function(str){ return str.toUpperCase(); })
			    
			var unEmptyValue = metadata[variable];
			if(unEmptyValue == ""){ unEmptyValue = "–" };
		
			metadataString +=
				'<p>'+
					'<strong>' + unCamelVarname + ":</strong> "+
					unEmptyValue +
				'</p>'
			}
			
			bootbox.dialog({
			  message: metadataString,
			  title: "Metadatos del objeto",
			  buttons: {
				main: {
				  label: "OK",
				  className: "btn-primary",
				  callback: function() {
				  }
				}
			  }
			});
}


function showEditContentDialog( contextWidget ){

	contextWidget = getContextWidget( contextWidget );

		var usrctntKey = 'cpHtml';
    	var targetFinder = ( ".cpHtmlwidgetContent" ); 
    	var currentContent = $( contextWidget )[0].cpData['dataShown'][usrctntKey];
    	var currentCpTitle = $( contextWidget )[0].cpData['dataShown']['cpTitle'];



		bootbox.prompt({
		  title: "Editar contenido: (la primer línea se usará como título del objeto)",
		  inputType: 'textarea',
		  value: ( currentCpTitle+currentContent != "" ?
		  			currentCpTitle + "\n" + currentContent.replace( /<br>/gi, "\n") :
		  			"Titulo del objeto\nContenido…"
		  		)
		  		,
		  callback: function(result) {
					if ( result === null || result === "" ) {
						//es un objeto de texto recien creado?
						if( 
							( currentContent == "" ) &&
							( currentCpTitle == "" )
							){
							//si es un objeto de texto vacío y se canceló el diálogo de edición, lo eliminamos
							var dataRoot = $(contextWidget).cpGetDataRoot();	
							contextWidget.remove();
							compassGlobalUI.update();
							}

						// Nothing to do
					} else {
						result = result.replace(/\n/g, "<br>").split("<br>");
						
						newCpTitle = result[0];
						//newCpTitle strips tags
						newCpTitle = $('<span>'+newCpTitle+'</span>').text();

						//newCpHtml preserves tags
						newCpHtml = result.length>1 ? 
							result.slice(1) : [""];
							newCpHtml = newCpHtml.join("<br>");

						$( contextWidget ).find("H2.cpTitle" ).text( newCpTitle );
						$( contextWidget ).find(targetFinder).html( newCpHtml );


						//aplicamos cpTitle en root y root.dataShown del objeto
						$( contextWidget )[0].cpData['cpTitle'] = newCpTitle;
						$( contextWidget )[0].cpData['dataShown']['cpTitle'] = newCpTitle;
						
						//aplicamos cpHtml en root y root.dataShown del objeto
						$( contextWidget )[0].cpData[usrctntKey] = newCpHtml;
						$( contextWidget )[0].cpData['dataShown'][usrctntKey] = newCpHtml;

						$( contextWidget ).cpPersist(events.widgetEdit);
						
					}
				}
			});


}



$(function() { // Handler for .ready() called.




$("#sortableHtPages").on('click', '.dropdown-menu>LI>A', function() {

	var what = this;
	var action = $( what ).data( "action" );
	var contextHTli = $(what).closest('#sortableHtPages>LI'); 

	switch(action){

    case "rename":
    
    	htRenameDialog( contextHTli );

        break;

    case "export":
		
		if( $( contextHTli ).cpGetData().downloadHref ){
			document.location.href= ( $( contextHTli ).cpGetData().downloadHref );
			}
		break;
	
    case "share":
    	
    	var htId = $( contextHTli ).cpGetData().abecebObjectId;
		var url = "/group/compass-platform/share-workspace-role-selection?ht=" + htId;
		document.location.href=url;
    	break;

    case "delete":
        bootbox.confirm({ 
			message: "¿Está seguro de que desea elminar este elemento?", 
			callback: function(result){ 
					
					if(result){
					
					if( contextHTli.length>0 ){
						$('#sortableHtPages').attr("workspaceIDHolder", contextHTli.attr("workspaceID"));
						contextHTli.remove()

						//actualizamos menu "guardar widget en HT", si existe
						widgetSaveToHTidUpdate(); 

						$('#sortableHtPages').cpPersist(events.sidebarElementDelete);

					}
					
					}//end if result
				}//end bootbox callback
			})//end bootbox
        break;
        
    default:
        //default code block
        break;
	
	}//end switch(action)


	
}); //end $("UL.dropdown-menu")

 
 	function makeURI (strData, type) {
		return 'data:' + type + ';base64,' + strData;
	}

 
 //process widget menu options
 
processWidgetContextMenu = function(itemKey, opt){ 

	var contextWidget = getContextWidget( opt.$trigger );
	var contextDataRoot = $(contextWidget).cpGetDataRoot;

	switch( itemKey ) {
	
	case "resize-3":
	case "resize-4":
	case "resize-6":
	case "resize-12":
		//reset widget size
		for(var i=1; i<=12; i++ ){
			contextWidget.removeClass("col-md-"+i+" col-sm-"+i );
			}
		var requestedSize = itemKey.substr(7);
		contextWidget.addClass('col-md-'+requestedSize+' col-sm-'+requestedSize);
		
		$(contextWidget).cpSetData( { 'gridWidth': requestedSize } );
		$(contextWidget).cpPersist( events.widgetResize );

		break;
		

	case "viewmetadata":
	
		var metadata = $(contextWidget)[0].cpData.dataShown.metadata;
		showMetadataDialog ( metadata );
		
		
		break;

	case "export":
		if($(contextWidget)[0].cpData.downloadHref){
			document.location.href= ( $(contextWidget)[0].cpData.downloadHref );
			}
		break;

	case "exportHT":
		var ancestor = $(contextWidget).cpGetAncestor();
		if($(ancestor)[0].cpData && $(ancestor)[0].cpData.downloadHref){
			document.location.href= ( $(ancestor)[0].cpData.downloadHref );
			}

		break;


	case "exportPNG":
		var widgetName = $( contextWidget )[0].cpData['dataShown']['cpTitle'];
			var nowText = moment().format('YYYYMMDD-Hmm') + "hs";
			var filename = ( nowText + ' ' + widgetName ).
					replace(/[^a-z0-9 _-]/gi, '').replace(/\s+/gi, ' ').toLowerCase().substring(0,120);

		if( $(contextWidget).cpGetData( 'type1' ) == "grafico" ){
			var canvas = $( contextWidget ).find('canvas')[0];
			Canvas2Image.saveAsPNG( canvas, $(canvas).width() , $(canvas).height() , filename + '.png' );
			
		}else if( $(contextWidget).cpGetData( 'type1' ) == "imagen" ){
			var uri = $(contextWidget)[0].cpData['dataShown']['src'];
			//var extension = uri.match(/\.\w+$/gi);
			var originalFileName = uri.split("/").slice(-1).pop();
			var originalExtension = uri.split(".").slice(-1).pop();
			saveFileWithName( uri, filename + "-" + originalExtension );

		}
		
		break;
		

	case "config-cptitle":

		var usrctntKey = 'cpTitle';
    	var targetFinder = ( "H2.cpTitle" ); 
    	var currentContent = $( contextWidget )[0].cpData['dataShown'][usrctntKey];

		bootbox.prompt({

		  title: "Editar título:",
		  value: currentContent,
		  callback: function(result) {
					if ( result === null || result == "" ) {
						// Nothing to do
					} else {
						$( contextWidget ).find(targetFinder).text( result )
						$( contextWidget )[0].cpData[usrctntKey] = result;
						$( contextWidget )[0].cpData['dataShown'][usrctntKey] = result;
						$( contextWidget ).cpPersist(events.widgetEdit);
					}
				}
			});

        break;


	case "config-cphtml":
	
		showEditContentDialog( contextWidget );
		

        break;
        
	
	case "config-usrctnt1":
	case "config-usrctnt2":

		var usrctntKey = ( itemKey == "config-usrctnt1" ?  "usrctnt1" : "usrctnt2" );
    	var targetFinder = ( itemKey == "config-usrctnt1" ?  ".usrctnt-head" : ".usrctnt-foot" ); 
		
    	var currentContent = $( contextWidget )[0].cpData['dataShown'][usrctntKey]; 

		bootbox.prompt({

		  title: "Agregar / editar comentario (dejar en blanco para eliminar):",
		  value: currentContent,
		  callback: function(result) {
					if ( result === null ) { 
						// Nothing to do
					} else {
						$( contextWidget ).find(targetFinder).text( result )
						$( contextWidget )[0].cpData['dataShown'][usrctntKey] = result;
						$( contextWidget ).cpPersist(events.widgetEdit);
					}
				}
			});

        break;

	case "update":
	
		updateWidgetData( $(contextWidget) );		
    
    	break;
        

	case "config-autoupdate-toggle":
		//cual es el valor del autoupdate flag?
		var widgetVarAutoUpdate = $( contextWidget )[0].cpData["autoUpdate"];
		widgetVarAutoUpdate = widgetVarAutoUpdate || false;
		
		//toggle value
		widgetVarAutoUpdate = !widgetVarAutoUpdate
		//store autoUpdate value in cpData
		$(contextWidget).cpSetData( { 'autoUpdate': widgetVarAutoUpdate } );

		
		//si se activo la autoactualizacion, actualizamos
		if( widgetVarAutoUpdate ){ //usr Aactivo autoupdate
		
			if( $(contextWidget)[0].cpData["dataUpdated"] ){
				//si hay datos actualizados a mostrar,
				//esta funcion se encarga de actualizar el widget completo, incluyendo toolbar,
				//y de persistir HT 
				updateWidgetData( contextWidget )
				}else{
				//no hay datos actualizados a mostrar.
				//solo persistimos la opcion.
				$(contextWidget).cpPersist( events.widgetUpdate );
				}
			
				$( contextWidget ).find(".x_panel .x_title .panel_toolbox .autoUpdateBadge").removeClass("autoUpdateStatus-false").addClass("autoUpdateStatus-true");
				
			}else{ //usr desactivo autoupdate
			
			
				$( contextWidget ).find(".x_panel .x_title .panel_toolbox .autoUpdateBadge").removeClass("autoUpdateStatus-true").addClass("autoUpdateStatus-false");
			 
				//persist HT 
				$(contextWidget).cpPersist( events.widgetUpdate );
			}
		
		//store autoUpdate value in cpData
		$(contextWidget).cpSetData( { 'autoUpdate': widgetVarAutoUpdate } );


		 break;
	
	
	case "delete":

        bootbox.confirm({ 
			message: "¿Está seguro de que desea elminar este elemento?", 
			callback: function(result){ 
				
//					console.log("EDU");
//					console.log(contextHTli);
					if(result){
					
					//eliminar widget?
					if( contextWidget.length > 0){
						var dataRoot = $(contextWidget).cpGetDataRoot();
						contextWidget.remove();
						//console.log(dataRoot.cpGetData());
						$( dataRoot ).cpPersist(events.widgetDelete);
						compassGlobalUI.update();
					}else{
						var litem = $(what).closest('#sortableHtPages>LI')
						if( litem.length>0 ){
							litem.remove()
							widgetSaveToHTidUpdate();
							$('#sortableHtPages').cpPersist(events.sidebarElementDelete);
						}
						
					//eliminar HT?
					}//end if widget vs ht
					
					}//end if result
				}//end bootbox callback
			})//end bootbox

		break;
	
	default:
	
	if( itemKey.indexOf('copyToHT-')==0 ){
	
		var what;
		var htID = itemKey.substring(9);
		if( htID == "new"){
			what = $('#htMenuLIcreateNewHT' );
		}else{
			what = $('#htli-' + htID );
		}
		
		console.log ( 'copyToHT- what' , what )

		var ui = {};
			ui.draggable = contextWidget;
		
		compassGlobalUI.htMenuItemAcceptWidget ( what, 'contextmenu', ui );
		
		
	}else{
	
		console.log("Clicked on " + itemKey + " on element: ",  opt.$trigger );
		break;
		}

	}//end switch
		
	compassGlobalUI.update()
	
};


//inicializamos menues de widgets
initContextMenu( );







}); //end document.ready




function initContextMenu( callee ){
	$.contextMenu( 'destroy' );
	//console.log( 'initContextMenu', callee )
 
// init widget contextmenu
// https://swisnl.github.io/jQuery-contextMenu/

	var disabledOnRenderItem = function( key, opt ){
		var contextWidget = getContextWidget( opt.$trigger )[0];
		var editMode = ( $(contextWidget).cpGetData('mode') );
		return ( !(editMode == "edit") );
	};

	var disabledOnRenderAncestor = function( key, opt ){
		var contextWidget = getContextWidget( opt.$trigger )[0];
		var editMode = ( $(contextWidget).cpGetAncestor().cpGetData('mode') );
		return ( !(editMode == "edit") );
	};


	var disabledOnNoDownloadHref = function( key, opt ){
		var contextWidget = getContextWidget( opt.$trigger )[0];		
		var contextWidgetDownloadHref = $(contextWidget).cpGetData('downloadHref') ;
		return ( ! ( contextWidgetDownloadHref && contextWidgetDownloadHref != "" ) );
	};

	var disabledOnNoAncestorDownloadHref = function( key, opt ){
		var contextWidget = getContextWidget( opt.$trigger )[0];	
		var ancestorDownloadHref = $(contextWidget).cpGetAncestor().cpGetData('downloadHref');
		return ( ! ( ancestorDownloadHref && ancestorDownloadHref != "" ) );
	}
	
	var disabledOnNoMetadata = function( key, opt ){
		var contextWidget = getContextWidget( opt.$trigger )[0];
		
		if(	$(contextWidget)[0].cpData &&
			$(contextWidget)[0].cpData.dataShown &&
			$(contextWidget)[0].cpData.dataShown.metadata &&
			!jQuery.isEmptyObject( $(contextWidget)[0].cpData.dataShown.metadata ) ){
			return false;
			}else{
			return true;
			}		
	};

	var disabledOnNotEditableCpHtml = function( key, opt ){
		//es no editable?
		if( disabledOnRenderItem ( key, opt ) ){ return true; }
		
		//es cphtml?
		var contextWidget = getContextWidget( opt.$trigger )[0];	
		var type1 = ( $(contextWidget).cpGetData('type1') );
		return ( !(type1 == "cphtml") );
	};

	var disabledOnNoCanvasOrImgSrc = function( key, opt ){
		var contextWidget = getContextWidget( opt.$trigger )[0];
		
		//opcion 1: es un widget de imagen, con img src
		if( $(contextWidget).cpGetData('type1') == "imagen" ){
			return false;
		}else{
		//opcion 2: si tenemos canvas, es un grafico
			return ( $(contextWidget).find("canvas").length == 0);
		}
	};
	
	var disabledOnNoPossibleUpdate = function ( key, opt ){
		var contextWidget = getContextWidget( opt.$trigger )[0];
 		if( $(contextWidget).cpGetData('dataUpdated') ){
			return false;
		}else{
			return true;
		}
	}
	


/*
	var htList = $("#sortableHtPages").cpGetData();

	//menu "guardar en …" de widget builder form
	if($("#widgetSaveToHTid").length!=0){

		$("#widgetSaveToHTid option").remove();

		$.each( htList.children, function(index, item) {
		  $("#widgetSaveToHTid").append(new Option(item["title"], item["abecebObjectId"] ));
		});
	}
	*/


	var htItems = {}

	var htList = $("#sortableHtPages").cpGetData();
	
	$.each( htList.children, function(index, item) {
//	console.log ('each htList.children', index)
 		htItems[ 'copyToHT-' + item["abecebObjectId"] ] = {
 			"name": item["title"] + ' ' + item["abecebObjectId"] ,
 			"icon": "fa-folder-o"
 			};
//		htItems[ "copyToHT-1" ] = {"name": "uno…", "icon": "fa-plus-square" };
		});
	
	htItems["copyToHTsepBeforeNew"] = "---------";
	htItems["copyToHT-new"] = {"name": "Nueva Hoja de Trabajo", "icon": "fa-plus-square" };

//	console.log ('htItems', JSON.stringify( htItems ) )
	



	var cpObjectWidgetContexMenuItems = {
	
        	"export": {
        		disabled: disabledOnNoDownloadHref,
        		"name": "Exportar datos", "icon": "fa-file-excel-o"
        		},
        	"exportHT": {
        		disabled: disabledOnNoAncestorDownloadHref,
        		"name": "Exportar datos de toda la Hoja de Trabajo", "icon": "fa-file-excel-o"
        		},
        	"exportPNG": {
        		disabled: disabledOnNoCanvasOrImgSrc,
        		"name": "Exportar gráfico", "icon": "fa-file-picture-o"
        		},
        		
        	// "share": {"name": "Compartir", "icon": "fa-share"},

        	"sep1": "---------",

        	"viewmetadata": {
        		disabled: disabledOnNoMetadata,
        		"name": "Ver información del item (metadatos)", "icon": "fa-info-circle"
        		},
        /* "sep2": "---------",
        	
           "copyToHT": {
				"name": "Copiar a Hoja de Trabajo", 
				"icon": "fa-files-o",
				"items": htItems
				},*/
        	"sep3": "---------",
        	
        	"config-cptitle": {
        		disabled: disabledOnRenderAncestor,
        		"name": "Editar título", "icon": "fa-pencil-square-o"
        		},
        	/*"config-cphtml": {
        		disabled: disabledOnRenderAncestor,
        		"name": "Editar contenido", "icon": "fa-pencil-square-o"
        		},*/
        		
        	"config-usrctnt1": {
        		disabled: disabledOnRenderAncestor,
        		"name": "Agregar/editar comentarios entre título y contenido", "icon": "fa-commenting-o"
        		},
        	"config-usrctnt2": {
        		disabled: disabledOnRenderAncestor,
        		"name": "Agregar/editar comentarios debajo del contenido", "icon": "fa-commenting-o"
        		},

        	"resize": {
        		disabled: disabledOnRenderAncestor,
                "name": "Tamaño del item", 
                "icon": "fa-text-width",
                "items": {
                    "resize-3": {"name": "1/4 de página (Mínimo)" },
                    "resize-4": {"name": "1/3 de página (Pequeño)" },
                    "resize-6": {"name": "1/2 página (Mediano)" },
                    "resize-12": {"name": "Página completa (Máximo)" },
                }
            }, //end resize submenu
            
            "sep4": "---------",
            
            "update": {
            	disabled: disabledOnNoPossibleUpdate,
            	"icon": "fa-refresh",
            	"name": "Actualizar ahora"
            	},
           
            
            "config-autoupdate-toggle": {
            	"name": "Actualizar automáticamente",
				"icon": function(opt, $itemElement, itemKey, item){

					if(opt && opt.context){
					var contextWidget = getContextWidget( opt.context )[0];
					
					if(	$(contextWidget)[0].cpData &&
						$(contextWidget)[0].cpData.autoUpdate ){
						return (" context-menu-icon context-menu-icon--fa fa fa-check ");
						}else{
						return "";
						}//end if cpData.autoUpdate
					
					}//end if opt.$trigger

				}
        		
        	},// end config-autoupdate-toggle
            
            "sep5": "---------",
            
            "delete": {"name": "Eliminar", "icon": "fa-trash-o", disabled: disabledOnRenderAncestor}

		} //end cpObjectWidgetContexMenuItems        
        

		/*
			"name": "Copiar a Hoja de Trabajo", 
			"icon": "fa-files-o",
			"items": //htItems
				{
				"copyToHT-ht-1_ObjectId":{"name":"Hoja de trabajo 1","icon":"fa-folder-o"},
				"copyToHT-ht-2_ObjectId":{"name":"Hoja de Trabajo Numero Dos","icon":"fa-folder-o"},
				"copyToHT-cpRootWitgets0_ObjectId":{"name":"Esta HT no tiene downloadHref, no se puede exportar","icon":"fa-folder-o"},
				"copyToHT-id1": {"name": "Mis Indicadores", "icon": "fa-folder-o"},
				"copyToHT-new": {"name": "Crear nueva Hoja de Trabajo…", "icon": "fa-plus-square"}
				} 

		   */

		//only .cpObject items are 'live'
         $.contextMenu({
            selector: ".cpObject.contentWidget>.x_panel", 
            callback: processWidgetContextMenu,
            items: cpObjectWidgetContexMenuItems
        });
         $.contextMenu({
            selector: ".cpObject.contentWidget>.x_panel A[data-onclick='contextmenu']", 
            trigger: 'left',
            callback: processWidgetContextMenu,
            items: cpObjectWidgetContexMenuItems
        });

}

