//1100-json.js
//funciones que comunican front y back

/*

Estos son los eventos que se informan como argumento del cpPersist():

Desde Hoja de Trabajo (menu contextual widget):
	¥	sort de hoja de trabajo (cpContainerSort)
	¥	resize de un widgetÊ(cpContainerWidgetResize)
	¥	delete widgetÊ(cpContainerWidgetDelete)
	¥	delete hoja de trabajoÊ(cpContainerDelete)
	¥	exportar hoja de trabajoÊ(cpContainerExport)
	¥	exportar widgetÊ(cpContainerWidgetExport)
	¥	edicion de un widgetÊ(cpContainerWidgetEdit)
	¥	copiar widget a hoja de trabajo (probablemente a traves de persistir htList)Ê(cpContainertHTAddWidgetÊ/ÊhtListHTAddWidgetÊÊÊÊ)
	¥	compartir hoja de trabajoÊ(cpContainerShare)
	¥	actualizar un widget (cpContainerWidgetUpdate)
	¥	actualizar HT (cpContainerHTUpdate)
	¥	crear widget (cpContainerWidgetNew)

Side Bar Menu:
	¥	SortÊHTs (htListSort)
	¥	NuevoÊHTÊ(htListNewHTÊÊ)
	¥	Agregar widget a HTÊ(htListHTAddWidgetÊ)
	¥	Renombrar HTÊ(htListHTRenameÊ)
	¥	Exportar HTÊ(htListHTExportÊÊ)
	¥	delete HTÊ(htListHTDelete)

*/

(function ( $ ) {

	//cpObjects> persist (send json)

	$.fn.cpPersist = function( evento ){
		var dataRoot = $(this).cpGetDataRoot();	
		var cpdata = $( dataRoot ).cpGetData();
		var ajaxData = JSON.stringify(cpdata);
		console.log('evento',evento);
		NProgress.start();
		
		switch (evento){

			case events.sidebarRename:
				var workspaceID =  $('#sortableHtPages').attr('workspaceIDHolder');
				var newTitle =  $('#sortableHtPages').attr('workspaceNameHolder');
				renameWorkspace(workspaceID, newTitle);
				break;

			case events.sidebarElementDelete:
				var workspaceID =  $('#sortableHtPages').attr('workspaceIDHolder');
				console.log("Borrar workspace: " + workspaceID);
				//persistSidebar(ajaxData);
				removeWorkspace(workspaceID);
				break;
				
			case events.widgetUpdate:
			case events.widgetResize:
			case events.widgetEdit:
			case events.widgetDelete: // Atencion, no llevan break porque tienen que persistir todos
				//console.log(ajaxData)
				persistWorkspace(ajaxData, false, evento);
				break;
				
			case events.sidebarAddWidget:
				var newChildren;
				var workspaceId;
				console.log(cpdata);
				$.each(cpdata.children, function( index, value ) {
					if(value.newChildren){
						newChildren = value.newChildren[0];
						console.log(newChildren);
						workspaceId = value.abecebPersistenceId;
						console.log(workspaceId);
						value.newChildren = [];
					}
				});
				addChildrenToWorkspace( workspaceId, newChildren, evento);
				break;
			
			case events.widgetSort:
				persistWorkspace(ajaxData, false, evento);
				break;
				
			case events.sidebarSort:
				break;
				
			case events.sidebarNewWS:
				var title = $('#sortableHtPages').attr('newTitleHolder');
				var newCpContainer = {
					"type": "cpContainer",
					"gridWidth": "12",
					"children": [],
					"cpTitle":title,
					"ownerID":$personID,
					"mode":"render"
				}
				persistWorkspace(JSON.stringify(newCpContainer), true, evento);
				break;
			
			default:
	//		$.ajax({
	//			type: 'POST',
	//			data: ajaxData,
	//			dataType : 'json',
	//		    contentType: 'application/json',
	//			headers: { "Operation": $operation , "Authorization" : $userPassword },
	//			url: $restURL,
	//			contentType: "application/json",
	//			success: function(data) {
	//				console.log("alegriaaaa");
	//			},
	//			error: function(jqXHR, textStatus, errorThrown) {
	//				console.log("textStatus: " + textStatus);
	//				console.log("error: " + errorThrown);
	//			}
	//		});

		}
		
		NProgress.done();
	};


}( jQuery ));



function loadJSONcpObject(
	container, jsonRequest, 
	beforeOrAfter  /* v300 */
	){
	
	if(!beforeOrAfter){ beforeOrAfter = false; } /* v300 */
	
	NProgress.start();

	var url = getJsonCallURL( jsonRequest );
	var jqxhr = $.getJSON( $baseURL + url , function( data ) {
	console.log( "loadJSONcpObject: success" );

	var $newCpObject = renderCpObject ( $(container) , data, beforeOrAfter );
	NProgress.done();
		
	})
	.done(function() {
		console.log( "loadJSONcpObject: second success" );
		
	})
	.fail(function() {
		console.log( "loadJSONcpObject: error" );
	})
	.always(function() {
		console.log( "loadJSONcpObject: complete" );
	});

}

function saveWidgetToHT( data ){
	//widgetSaveToHTid es el select q indica HT donde guardar el widget

	NProgress.start();
		
	//DEBUG
	console.log(
		// 'esta es la cpdata para mandar por JSON',
		JSON.stringify ( data )
		)
	ws = addChildrenToWorkspace(data.saveToHTid, data, events.widgetBuilderCreated);	
		
	
	//json magic con 'data' que obtuvimos
	
	NProgress.done();
	
	return ws;
}


function loadSidebarHTs(){
	//Cargar JSON de Hojas de Trabajo
	//loadJSONcpObject( $('#sortableHtPages'), 'htList.js.php', 'replace' );
}

function persistSidebar(jsonData){
	console.log('Persistiendo Sidebar'); 
	data = addAttributeToJson( jsonData, 'personId', $personID );
	$.ajax({
		type: 'POST',
		data: data,
		dataType : 'json',
		contentType: 'application/json',
		headers: { "Operation": $persistSidebarOperation , "Authorization" : $sidebarUsernamePassword },
		url: $sidebarServiceURL,
		contentType: "application/json",
		success: function(data) {
			console.log("Sidebar Persistida");
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log("textStatus: " + textStatus);
			console.log("error: " + errorThrown);
		}
	});
}

function getSidebar(){
	console.log('Obteniendo de mongo la sidebar para la persona con ID ' + $personID ); 
	$.ajax({
		type: 'GET',
		data: { compassSidebarID: $personID },
		dataType: 'json',
		headers: { "Operation": $getSidebarOperation , "Authorization" : $sidebarUsernamePassword },
		url: $sidebarServiceURL,
		contentType: "application/json",
		success: function(data) {
			console.log("SideBar obtenida exitosamente");
			renderCpObject ( $('#sortableHtPages') , data, 'replace' );
			console.log(data);
			if(data.compassConsultorId > 0){
				$('#compassConsultorDiv').show();
				$('#compassConsultorDiv a').attr("href",'mailto:' + data.compassConsultorEmail);
				$('#compassConsultorDiv h4').text(data.compassConsultorName);
				var url = httpGet(data.compassConsultorAvatarURL);
				$('#compassConsultorDiv img').attr("src", url);
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log("textStatus: " + textStatus);
			console.log("error: " + errorThrown);
		}
	});
}

function getWorkspace( compassWorkspaceID , callback){
	console.log('Obteniendo de mongo el espacio de trabajo ');
	var workspace;
	$.ajax({
		type: 'GET',
		data: { compassWorkspaceID: compassWorkspaceID },
		dataType: 'json',
		headers: { "Operation": $retriveWorkspaceOperationJson , "Authorization" : $workspaceUserNamePassword },
		url: $workspaceServiceURL,
		contentType: "application/json",
		success: function(data) {
			console.log("Espacio obtenido correctamente");
			callback(data);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log("textStatus: " + textStatus);
			console.log("error: " + errorThrown);
		}
	});
}

function getMyWorkspaces(callback){
	console.log('Obteniendo lista de mis espacios de trabajo ');
	var workspace;
	$.ajax({
		type: 'GET',
		data: { compassSidebarID: $personID },
		dataType: 'json',
		headers: { "Operation": $getMyWorkspaceOperationJSON , "Authorization" : $workspaceUserNamePassword },
		url: $workspaceServiceURL + "/getMyWorkspaces",
		contentType: "application/json",
		success: function(data) {
			console.log("Espacio obtenido correctamente");
			callback(data);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log("textStatus: " + textStatus);
			console.log("error: " + errorThrown);
		}
	});
}

function addChildrenToWorkspace(compassWorkspaceID, newChildren, evento){
	console.log("Agregando elemento al espacio de trabajo");
	var workspace;
	var url = $workspaceServiceURL + "/addChildrenToWorkspace?compassWorkspaceID=" + compassWorkspaceID;
	var result = null;
	$.ajax({
		type: 'POST',
		data: JSON.stringify(newChildren),
		dataType: 'json',
		headers: { "Operation": $addChildrenToWorkspaceOperationJson , "Authorization" : $workspaceUserNamePassword, "jsEvent": evento, "impersonatedPersonID": $impersonatedPersonID },
		url: url,
		async: false,
		contentType: "application/json",
		success: function(data) {
			console.log("Elemento agregado exitosamente");
			result = data;
			result.status = data.httpResponseCode;
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log("textStatus: " + textStatus);
			console.log("error: " + errorThrown);
			result = jqXHR;
		}
	});
	return result;
}

function persistWorkspace(data, isNewWorkspace, evento){
	console.log('Persistiendo Espacio'); 
	$.ajax({
		type: 'POST',
		data: data,
		dataType : 'json',
		contentType: 'application/json',
		headers: { "Operation": $persistCompassWorkspaceOperation , "Authorization" : $workspaceUserNamePassword, "jsEvent": evento, "impersonatedPersonID": $impersonatedPersonID },
		url: $workspaceServiceURL,
		contentType: "application/json",
		success: function(data) {
			console.log("Espacio Persistido Correctamente");
			if(isNewWorkspace){
				getSidebar();
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log("textStatus: " + textStatus);
			console.log("error: " + errorThrown);
		}
	});
}


function removeWorkspace(compassWorkspaceID) {
	console.log("Agregando elemento al espacio de trabajo");
	var workspace;
	var url = $workspaceServiceURL + "/deleteCompassWorkspace?compassWorkspaceID=" + compassWorkspaceID;
	$.ajax({
		type: 'GET',
		//data: JSON.stringify(newChildren),
		dataType: 'json',
		headers: { "Operation": $deleteCompassWorkspaceOperation , "Authorization" : $workspaceUserNamePassword },
		url: url,
		contentType: "application/json",
		success: function(data) {
			console.log("Elemento Elminado");
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log("textStatus: " + textStatus);
			console.log("error: " + errorThrown);
		}
	});
}

function renameWorkspace(compassWorkspaceID, newTitle) {
	console.log("Renombrando workspace: " + compassWorkspaceID + " a: " + newTitle);
	var workspace;
	var url = $workspaceServiceURL + "/renameCompassWorkspace?compassWorkspaceID=" + compassWorkspaceID + "&newTitle=" + newTitle;
	$.ajax({
		type: 'GET',
		//data: JSON.stringify(newChildren),
		dataType: 'json',
		headers: { "Operation": $renameCompassWorkspaceOperation , "Authorization" : $workspaceUserNamePassword },
		url: url,
		contentType: "application/json",
		success: function(data) {
			console.log("Elemento Renombrado");
			getSidebar();
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log("textStatus: " + textStatus);
			console.log("error: " + errorThrown);
		}
	});
}

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}