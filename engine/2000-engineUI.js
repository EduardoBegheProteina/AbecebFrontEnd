function preprocessCpData( data ){ //recursively preprocess JSON cpObjects data

	if( data.children ){
		data.children = 
			$.each( data.children, function(key, val) {
				preprocessCpData(val)
				});
		}

	if( data.dataShown ){
		data.dataShown = preprocessCpDataShown( data.dataShown, data );
	}

	if( data.dataUpdated ){
		data.dataUpdated = preprocessCpDataShown( data.dataUpdated, data );
		
		//set data.titlebarBadge 
		data.titlebarBadge = true;
		if(!data.titlebarBadgeStatus){
			if( data.dataUpdated.updateStatus ){
				data.titlebarBadgeStatus = data.dataUpdated.updateStatus;
			}else{
				data.titlebarBadgeStatus = "new";
			}
		}
	}else{ // no data.dataUpdated
		//set no data.titlebarBadge 
		if(!data.titlebarBadge){
		data.titlebarBadge = false;
		}
	}
		
	return data;
}//end preprocessCpData



//sub-funcion para preprocesar data.dataShown y data.dataUpdated
//necesitamos nodo dataShown y su parent data
function preprocessCpDataShown( dataShown, data ){ 

	//curzar tabledata with series
	if ( dataShown.tabledata && data.series ){
		for( var row=0; row<Math.min( data.series.length, dataShown.tabledata.length -1) ; row++ ){
			if( data.series[row]["userLabel"] ){
				dataShown.tabledata[row+1][0] = data.series[row]["userLabel"];
				}
		}
	} //curzar tabledata with series
	
	return dataShown;

} //end preprocessCpDataShown


function renderCpWidget( target, data, initCpObject ){
	$.when(
		lazyGetTemplate("cpContainer")
		)
    .done(function() {
    	//procesamos template
		var html = $.templates.cpWidget.render( data );
		$( target ).html(html);

		//procesamos cpObjects que acabamos de renderear
		if(initCpObject){
			$( target ).cpObject( data );
			initGraficos( $( target ) );
			}

	}); //end when.done

	return ( target );
}







/****** graficos ****/
$(function() { // Handler for .ready() called.

	Chart.defaults.global.defaultFontFamily = "'Roboto', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif";
	Chart.defaults.global.defaultFontColor = "#000000";

});






function initGraficos( container ){

var container = container || $('BODY');

var graphBackgroundColors = [
	"rgba(122, 204, 122, 0.6)", //"#7acc7a", 
	"rgba(128, 213, 255, 0.6)", //"#80d5ff", 
	"rgba(41, 123, 204, 0.6)", //"#297bcc", 
	"rgba(183, 92, 230, 0.6)", //"#b75ce6", 
	"rgba(204, 82, 82, 0.6)", //"#cc5252", 
	"rgba(230, 161, 92, 0.6)", //"#e6a15c", 
	"rgba(230, 230, 0, 0.6)" //"#e6e600"
	]
var graphProjectedBackgroundColors = [
	"rgba(122, 204, 122, 0.2)", //"#7acc7a", 
	"rgba(128, 213, 255, 0.2)", //"#80d5ff", 
	"rgba(41, 123, 204, 0.2)", //"#297bcc", 
	"rgba(183, 92, 230, 0.2)", //"#b75ce6", 
	"rgba(204, 82, 82, 0.2)", //"#cc5252", 
	"rgba(230, 161, 92, 0.2)", //"#e6a15c", 
	"rgba(230, 230, 0, 0.2)" //"#e6e600"
	]
var graphBorderColors = [
	"#7acc7a", 
	"#80d5ff", 
	"#297bcc", "#b75ce6", "#cc5252", "#e6a15c", "#e6e600"
	]

gData = {};

$(container).find('.cpWidget-x-grafico').each( function( index, el ) {

	graphBackgroundColorIx = 0;

	graphColorIx = 0;
    var theCpData = ( $(el).parent().cpGetData() );
	var gData = jQuery.extend(true, {}, theCpData.dataShown.graphdata );
	var chartContainerObj = $(el).find('canvas')[0];


if(gData.options){
		graphOptions = gData.options;
	}else{
		graphOptions = {
		  scales: {
			yAxes: [{
			  ticks: { beginAtZero: false }
			}],
			xAxes: [{
			  ticks: { beginAtZero: false }
			}]
		  }
		};
	}


var bestType;

if( gData.datasets[0].type ){
	bestType = gData.datasets[0].type;
	}else if (gData.datasets[0].chartType) {
	bestType = gData.datasets[0].chartType
	}else{
	bestType = "line"
	}



//Preprocesamos Datasets para generar series adicionales para dataProjected
var gDataDatasets2 = [];
for( var i=0; i<gData.datasets.length; i++){

	if( gData.datasets[i]["chartType"] ){
		gData.datasets[i]["type"] = gData.datasets[i]["chartType"]
		}
		
	//agregamos al nuevo array el elemento que estamos procesando
	gDataDatasets2.push (gData.datasets[i]);
	//si tenemos dataProjected, necesitaremos agregar un segundo elemento con esa data
	if(gData.datasets[i]["dataProjected"]){	

		if( gData.datasets[i]["type"] == "line" || gData.datasets[i]["type"] == "area" ){

			var gDataIdataSet = jQuery.extend(true, {}, gData.datasets[i] );
			gDataIdataSet["isProjected"] = true;
			delete gDataIdataSet["dataProjected"];
		
		//para graficos de linea o area, desplazamos valores
			//creamos array de NULLs para desplazar dataUpdated
			//con un elementos MENOS que lenght de data
			//dado que necesitaremos agregar el ultimo punto de data para empalmar la linea
			var dataProjectedLeftNulls = []
			for(var nullIx = 0; nullIx < gDataIdataSet["data"].length -1; nullIx++){
				dataProjectedLeftNulls[nullIx] = null;
				}
			//desplazamos dataProjected, agregando como 1er elemento el ultimo de data
			//de manera de que haya continuidad en la linea entre ultimo punto de data y 1ero de dataupdated
			gDataIdataSet["data"] = dataProjectedLeftNulls.concat (
				[ gData.datasets[i]["data"][ (gData.datasets[i]["data"].length - 1) ] ] ,
				gData.datasets[i]["dataProjected"]
				);
			//asignamos data del nuevo elemento
			gDataIdataSet["borderDash"] = [10,5]
			gDataIdataSet["label"] += " (Proy.)";
		
			//copiamos elemento conteniendo dataProjected a gDataDatasets2
			gDataDatasets2.push ( gDataIdataSet );

		}else{


			gData.datasets[i]["hasProjectedFrom"] = gData.datasets[i]["data"].length;		
			gData.datasets[i]["data"] = gData.datasets[i]["data"].concat ( gData.datasets[i]["dataProjected"] );
			gData.datasets[i]["label"] += " (con proy.)";
			delete gData.datasets[i]["dataProjected"];

//opcion: como en line y area, dataupdated en serie aparte (genera columnas del 50% de ancho)

/*
			var gDataIdataSet = jQuery.extend(true, {}, gData.datasets[i] );
			gDataIdataSet["isProjected"] = true;
			delete gDataIdataSet["dataProjected"];

		//para graficos bar o horizontal bar, desplazamos valores con NULL
		//sin necesitar dato de empalme
			//creamos array de NULLs para desplazar dataUpdated
			//con mismo lenght que data
			var dataProjectedLeftNulls = []
			for(var nullIx = 0; nullIx < gDataIdataSet["data"].length; nullIx++){
				dataProjectedLeftNulls[nullIx] = null;
				}
			//desplazamos dataProjected
			gDataIdataSet["data"] = dataProjectedLeftNulls.concat (
				gData.datasets[i]["dataProjected"]
				);
			
		//para graficos bar, horizontal bar o pie, identificamos datos proyectados con atributos de area
			gDataIdataSet[ "borderWidth" ] = 2;
			gDataIdataSet["label"] += " (Proy.)";
		
		//copiamos elemento conteniendo dataProjected a gDataDatasets2
		gDataDatasets2.push ( gDataIdataSet );
*/

		}

		
	} // end if(gData.datasets[i]["dataProjected"])
}

gData.datasets = gDataDatasets2;

//Procesamos Datasets
for( var i=0; i<gData.datasets.length; i++){
	if( gData.datasets[i]["userLabel"] ){
		gData.datasets[i]["label"] = gData.datasets[i]["userLabel"]
		}

	//if backgroundColor was not defined by JSON, apply palette
	if( !gData.datasets[i]["backgroundColor"] ){
	
		//if is a Projected series, use projected colors
		if( gData.datasets[i]["isProjected"] ){
			gData.datasets[i]["backgroundColor"] = graphProjectedBackgroundColors [graphColorIx]

		}else{
		//It is not a Projected series. Does it have projected data in it?
			if( !gData.datasets[i]["hasProjectedFrom"] ){
			//Has no projected data, use normal color:
			gData.datasets[i]["backgroundColor"] = graphBackgroundColors[graphColorIx]

			}else{
			//Has projected data, define background color array

			var backgroundColorArray = [];
			
			var hasProjectedFrom = gData.datasets[i]["hasProjectedFrom"]
			var hasProjectedTo = gData.datasets[i]["data"].length

			//data bars will have filled color
			for(var bgcaIx=0; bgcaIx < hasProjectedFrom; bgcaIx++){
				backgroundColorArray.push( graphBackgroundColors[graphColorIx] );
				}
			//dataProjected bars will have projected color
			for(var bgcaIx=bgcaIx; bgcaIx< hasProjectedTo ; bgcaIx++ ){
				backgroundColorArray.push( graphProjectedBackgroundColors[graphColorIx] );
				}
			
			//apply background color array to serie
			gData.datasets[i]["backgroundColor"] = backgroundColorArray;
			
			}
			
		}
	}
	if( !gData.datasets[i]["borderColor"] ){
		gData.datasets[i]["borderColor"] = graphBorderColors [graphColorIx];
	}
	gData.datasets[i]["pointBackgroundColor"] = graphBackgroundColors [graphColorIx];
	gData.datasets[i]["pointBorderColor"] = graphBorderColors [graphColorIx];
	
	gData.datasets[i].fill = false;
	gData.datasets[i]["pointRadius"] = 4;
	gData.datasets[i]["lineTension"] = 0;
			
//Avanzamos el Ix de colores SOLO si no tenemos dataProjected
//Si tenemos dataProjected, se empleara el mismo color para el proximo elemento

if(!gData.datasets[i]["dataProjected"]){
		graphColorIx++
		if( graphColorIx > graphBackgroundColors.length ){ graphColorIx = 0 };
	}
	
	var gDataChartType;
	if( gData.datasets[i].type ){
		gDataChartType = gData.datasets[i].type
		}else if ( gData.datasets[i].chartType ){
		gDataChartType = gData.datasets[i].chartType
		}else{
		gDataChartType = "line"
		}

	bestType = getBestType( bestType, gDataChartType );
	
	switch ( gData.datasets[i].type ){
	
		case 'line':
			gData.datasets[i].fill = false;			
			break;
			
		case 'area':
			gData.datasets[i].type = 'line';
			gData.datasets[i].fill = true;
			break;
			
		case 'bar':
			gData.datasets[i].type = 'bar';
			gData.datasets[i].fill = true;
			gData.datasets[i][ "borderWidth" ] = 1;
			break;
			
		case 'columnas-stacked': case 'bar-stacked':
			gData.datasets[i].type = 'bar';
			gData.datasets[i][ "borderWidth" ] = 1;
			jQuery.extend(true, graphOptions, {
				"scales": {
					    "xAxes": [{
						  "stacked": true
					    }],
					    "yAxes": [{
						  "stacked": true
					    }]
					    }
					}
			);
			break;
		
		case 'horizontalBar':
			gData.datasets[i][ "borderWidth" ] = 1;
			break;
		
		case 'horizontalBar-stacked':
			gData.datasets[i].type = 'horizontalBar';
			gData.datasets[i][ "borderWidth" ] = 1;

			jQuery.extend(true, graphOptions, 
				{
				"scales": {
					"xAxes": [{ "stacked": "true" }],
					"yAxes": [{ "stacked": "true" }]
					}
				}
			);

			break;

		case 'pie':
			gData.datasets[i].backgroundColor = graphBorderColors;
			gData.datasets[i].borderColor = graphBorderColors;
			graphOptions.scales = {};
			break;
			
		default: //line
			gData.datasets[i].fill = false;
			break;
	}
	

	if( gData.datasets[i].ejeCero && gData.datasets[i].ejeCero != "false" ) {
			jQuery.extend(true, graphOptions, {
				"scales": {
					    "xAxes": [{ "ticks": { "beginAtZero": true } }],
					    "yAxes": [{ "ticks": { "beginAtZero": true } }]
					    }
					}
				); //end jQuery.extend
			}//end if
	
	}//end for

	
	//construimos el grafico
	var chartDataObj = {
		options: graphOptions,
		//type: gData.datasets[0].type,
		type: bestType, //gData.datasets[0].type,
		data: {
			labels: gData.labels,
			datasets: gData.datasets
			}
		}

	chartDataObj.options.animation = {
			duration: 50,
			onComplete: function() {
			evenWidgetHeights( this.chart.canvas );
			//procesar foldable widgetsContainers
			$('.cpCollapsableClosedAfterRender').removeClass('cpCollapsableClosedAfterRender').addClass('cpCollapsableClosed');
			
			}
		}



	new Chart(chartContainerObj, chartDataObj);	




    
});

}


function getBestType( oldType, newType ){
	switch (newType) {
	  case "pie": // pie beats all
		return "pie";
		break;
	  case "horizontalBar": case 'horizontalBar-stacked':
		return "horizontalBar";
		break;
	  case "bar": case 'columnas-stacked': case 'bar-stacked':
		return "bar";
		break;
	  default:
		return oldType;
	} //end switch

}


function renderNewCpWidget( container, data, beforeOrAfter ){

	if(!beforeOrAfter){ beforeOrAfter = false; }

	//pre procesamos DATA
	preprocessCpData( data );
	
	//preparamos DIV de Widget para recibir el template
	var $target = $(
		'<div id="widget-' + data.abecebObjectId + '" class="contentWidget col-md-'+ data.gridWidth +
		' col-sm-' + data.gridWidth +
		' col-xs-12"><\/div>')
		;

	//renderCpWidget sobre $target
	var $renderedTarget = renderCpWidget( $target, data );

	//append o prepend al container
	if( beforeOrAfter=='before' || beforeOrAfter=='prepend' ){
		$( container ).prepend( $renderedTarget );
	}else if( beforeOrAfter=='after' ){
		$( container ).after( $renderedTarget );
	}else if( beforeOrAfter=='append' ){
		$( container ).append( $renderedTarget );
	}else{
		$( container ).html( $renderedTarget );
	}	

	return ( $renderedTarget );

}//end renderNewCpWidget





function renderNewHtList( container, data, beforeOrAfter ){

	//inicializamos container como cpObject
	$(container).cpObject( { "type": "htList" } );
	
	//preparamos DIV de Widget para recibir el template
	if( !beforeOrAfter || beforeOrAfter=='replace'){
		var $target = $(container);
		}else{
		var $target = $('<div></div>');
		}
	var $renderedTarget = renderHTlistContainer( $target, data );

	//append o prepend al container
	if( beforeOrAfter=='before' || beforeOrAfter=='prepend' ){
		$( container ).prepend( $renderedTarget );
	}else if( beforeOrAfter=='after' || beforeOrAfter=='append' ){
		$( container ).append( $renderedTarget );
	}else{
		//ya fue aplicado
		//$( container ).html( $renderedTarget );
	}
	
	
	return ( $renderedTarget );
} //end renderNewCpContainer


function renderHTlistContainer( target, data ){
	$.when(
		lazyGetTemplate("HTlistContainer")
		)
    .done(function() {
    	//procesamos template
		var html = $.templates.HTlistContainer.render( data );
		$( target ).html(html);
		
		//procesamos cpObjects que acabamos de renderear
		$( target ).find(".cpObjectToInit").cpObject().removeClass('cpObjectToInit');
		
		//actualizamos menu "guardar widget en HT", si existe
		widgetSaveToHTidUpdate();

		
		// initDraggableWidgets( target );
		initHTdroppables( target );

		
	}); //end when.done
	
	return ( target );
}





function renderNewCpContainer( container, data, beforeOrAfter ){

	//pre procesamos DATA
	preprocessCpData( data );
	
	//preparamos DIV de Widget para recibir el template
	var $target = $(
		'<div class="cpContainerDIV"><\/div>')
		;

	//renderCpWidget sobre $target
	var $renderedTarget = renderCpContainer( $target, data );

	//append o prepend al container
	if( beforeOrAfter=='before' || beforeOrAfter=='prepend' ){
		$( container ).prepend( $renderedTarget );
	}else if( beforeOrAfter=='after' || beforeOrAfter=='append' ){
		$( container ).append( $renderedTarget );
	}else{
		$( container ).html( $renderedTarget );
	}

	return ( $renderedTarget );

} //end renderNewCpContainer


function initTopToolbarListeners(){
//process toolbar actions
$("div#topToolbar").on('click', '.toolbarIcon:not(.disabled)', function() {
	var clickedObj = this;
	
	if( $( clickedObj ).hasClass( "toolbarIcon-crearTexto" ) ){
	
		addNewTextWidget();


	}else if( $( clickedObj ).hasClass( "toolbarIcon-renombrar" ) ){
		
		var htId = $( clickedObj ).cpGetAncestor().cpGetData('abecebObjectId') ;
		if ( $('#htli-'+htId)[0] ){
			htRenameDialog( $('#htli-'+htId) );
		}

	}else if( $( clickedObj ).hasClass( "toolbarIcon-exportar" ) ){
		
			if( $( clickedObj ).cpGetAncestor().cpGetData().downloadHref ){
			document.location.href= ( $( clickedObj ).cpGetAncestor().cpGetData().downloadHref  );
			}
		
	}else if( $( clickedObj ).hasClass( "toolbarIcon-share" ) ){
		
		var htId = $( clickedObj ).cpGetAncestor().cpGetData('abecebObjectId') ;
		var url = "/group/compass-platform/share-workspace-role-selection?ht=" + htId;
		document.location.href=url;
	
	}else if( $( clickedObj ).hasClass( "toolbarIcon-update" ) ){
	
		var autoUpdateHTvar = $( clickedObj ).cpGetAncestor().cpGetData('autoUpdate') ;

		
		if ( !autoUpdateHTvar ){ //autoupdate activado
		bootbox.dialog({
		  title: "Actualizar datos…",
		  message: "¿Está seguro de que desea actualizar los datos de todos los objetos de esta Hoja de Trabajo?<br><br>Esta acción no puede ser revertida.",

		  buttons: {

			cancel: {
			  label: "Cancelar",
			  className: "btn-default",
			  callback: function() {
			  }
			}, 
			
			updatenow: {
			 label: "Actualizar todos los objetos",
			  className: "btn-primary",
			  callback: function() {
			  	//actualizar todos los widgets
			  	$("#cpRoot").find(".contentWidget").each(function() {
					updateWidgetData( $( this ) , false); //no persistir cada update individual, persistiremos la HT una sola vez
				});
			  	
			  	$( clickedObj ).cpGetAncestor().cpPersist( events.widgetUpdate );
			  }
			},
			
			autoupdate: {
			  label: "Activar actualización automática",
			  className: "btn-primary",
			  callback: function() {
			  	//actualizar todos los widgets
			  	$("#cpRoot").find(".contentWidget").each(function() {
					updateWidgetData( $( this ) , false); //no persistir cada update individual, persistiremos la HT una sola vez
				});
				
			  	$( clickedObj ).addClass("green")
			  	$( clickedObj ).cpGetAncestor().addClass("htHasautoUpdate");
			  	$( clickedObj ).cpGetAncestor().cpSetData( { 'autoUpdate': true } );
			  	$( clickedObj ).cpGetAncestor().cpPersist( events.widgetUpdate );

			  }
			}
			
		  }



		});
		}else{ //autoupdate desactivado
		bootbox.dialog({
		  title: "Actualización automática activada",
		  message: "Una vez desactivada la actualización automática para la Hoja de Trabajo, podrá actualizar manualmente la hoja completa o cada objeto.",

		  buttons: {

			cancel: {
			  label: "Cancelar",
			  className: "btn-default",
			  callback: function() {
			  }
			}, 
						
			autoupdateoff: {
			  label: "Desactivar actualización automática",
			  className: "btn-primary",
			  callback: function() {
			  	$( clickedObj ).removeClass("green")
		  		$( clickedObj ).cpGetAncestor().removeClass("htHasautoUpdate");
				$( clickedObj ).cpGetAncestor().cpSetData( { 'autoUpdate': false } );
			  	$( clickedObj ).cpGetAncestor().cpPersist( events.widgetUpdate );
			  }
			}
			
		  }




		});
		
		}

	
	}else if( $( clickedObj ).hasClass( "toolbarIcon-copiar" ) ){
		
	}else if( $( clickedObj ).hasClass( "toolbarIcon-cortar" ) ){
		
	}else if( $( clickedObj ).hasClass( "toolbarIcon-pegar" ) ){
		
	}else if( $( clickedObj ).hasClass( "toolbarIcon-deshacer" ) ){
		
	}else if( $( clickedObj ).hasClass( "toolbarIcon-compartir" ) ){
		
	}
	
	//updatecompassGlobalUI();
	compassGlobalUI.update()
	});
//end process toolbar actions
}



function renderCpContainer( target, data ){
	$.when(
		lazyGetTemplate("cpContainer")
		)
    .done(function() {
    	//procesamos template
		var html = $.templates.cpContainer.render( data );
		$( target ).html(html);
		
		//procesamos cpObjects que acabamos de renderear
		$( target ).find(".cpObjectToInit").cpObject().removeClass('cpObjectToInit');
		
		initDraggableWidgets( target );
		
		initGraficos();
		initTopToolbarListeners();
		
		//backup processing cpCollapsableClosedAfterRender, in case no graphics were inited
		setTimeout(function(){
			$('.cpCollapsableClosedAfterRender').removeClass('cpCollapsableClosedAfterRender').addClass('cpCollapsableClosed');
			}, 250);

		

		
	}); //end when.done

	
	return ( target );
}



function renderCpObject( container, data, beforeOrAfter ){
//renders a widget AND stores source data as cpObject

	if(!beforeOrAfter){ beforeOrAfter = false; }
		
	  //preprocesar JSON obtenido
	  switch(data['type']) {
		case 'cpWidget':
		var $newCpObject = renderNewCpWidget( $( container ), data, beforeOrAfter );
		// $( $newCpObject )[0].cpData = data;
		// jQuery.data( $newCpObject, "cpData", data );
			break;
		case 'cpContainer':
		var $newCpObject = renderNewCpContainer( $( container ), data, beforeOrAfter );
		// $( $newCpObject )[0].cpData = data;
			break;
		case 'cpHtml':
			// console.log ('renderCpObject: cpHtml type');
			break;

		case 'htList':
		var $newCpObject = renderNewHtList ( $( container ), data, beforeOrAfter );
		// $( $newCpObject )[0].cpData = data;
			break;


		default:
			console.log ('renderCpObject: default class');
			console.log(data);
			break;
		}//end switch


	return ( $newCpObject );

}//end renderCpObject




///////// jsRender supporting functions

function lazyGetTemplate(name) {
  // If the named remote template is not yet loaded and compiled
  // as a named template, fetch it. In either case, return a promise
  // (already resolved, if the template has already been loaded)
  var deferred = $.Deferred();
  if ($.templates[name]) {
    deferred.resolve();
  } else {
  
  var jsTemplateURI;
  //v407/v409 UNMATCHING
  if( $entorno && $entorno=="local" ){
  	jsTemplateURI = $jtemplatesPath + name + ".js";
  	}else{
  	jsTemplateURI = $baseURL + $jsonPath + name + ".js"
    };
  
  	$.getScript( jsTemplateURI ).then(function() {
        if ($.templates[name]) {
          deferred.resolve();
        } else {
          console.log ("Script: \"" + name + ".js\" failed to load");
          deferred.reject();
        }
      });
  }
  return deferred.promise();
}


//register tag: toClassName
function toClassName(value) {
	return value.replace(/\W/g, '').toLowerCase();
}
$.views.converters("toClassName", toClassName);

//register tag: jsRenderJSONstringify
function jsRenderJSONstringify(value) {
	var copiedObject = jQuery.extend(true, {}, value)
	//delete copiedObject.children;
   return JSON.stringify( copiedObject );
}
$.views.tags("jsRenderJSONstringify", jsRenderJSONstringify);

//register custom tag: jsRenderJSONstringifyNoChildren
function jsRenderJSONstringifyNoChildren(value) {
	var copiedObject = jQuery.extend(true, {}, value)
	delete copiedObject.children;
   return JSON.stringify( copiedObject );
}
$.views.tags("JSONstringifyNoChildren", jsRenderJSONstringifyNoChildren);


//register custom tag: tdFromTableData
function tdFromTableData(value, tag) {
	var value = String(value).split("|");
	var tag = this.tagCtx.params.args[1] || "td";
	var classes = "";
	if(value.length==2){
		var vObj = parseQueryString( value[1] );
		}else{
		var vObj = {};
		}
	
	if(vObj.proj){
		classes += "tdVarProjectedIs1 ";
	}
	var r = '<'+tag+' class="'+ classes +'">';
	
	var dato = value[0] ;
	var formato = "default";
	
	if( vObj.cpDataFormat ){ formato = vObj.cpDataFormat; }
	if( vObj.cpNumberFormat ){ formato = vObj.cpNumberFormat; }
	if( vObj.f ){ formato = vObj.f; }
	
	
	
	if( $.isNumeric( dato ) ){
		dato = cpDataFormat( dato, formato );
	}
	
	if( vObj.um1 ){ r+=vObj.um1 };
	r+= dato ;
	if( vObj.um2 ){ r+=vObj.um2 };
	r+= '</'+tag+'>';

	return r;
}
$.views.tags("tdFromTableData", tdFromTableData);



//https://gist.github.com/kottenator/9d936eb3e4e3c3e02598
function getPaginationArray(current, last, delta) {
    var delta = delta || 2,
    	left = current - delta,
        right = current + delta + 1,
        range = [],
        rangeWithDots = [],
        l;

    for (var i = 1; i <= last; i++) {
        if (i == 1 || i == last || i >= left && i < right) {
            range.push(i);
        }
    }

    for (var i of range) {
        if (l) {
            if (i - l === 2) {
                rangeWithDots.push(l + 1);
            } else if (i - l !== 1) {
                rangeWithDots.push('...');
            }
        }
        rangeWithDots.push(i);
        l = i;
    }

    return rangeWithDots;
}

$.views.helpers({
  getPaginationArray: getPaginationArray
  });
  






/** utility functions **/

String.prototype.hashCode = function() {
//http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
var hash = 0, i, chr, len;
  if (this.length === 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
	// hash |= 0; // Convert to 32bit integer
  }
  return hash;

};

function getUagTimestampID(){
//generate ID using User Agent & timestamp

	var uag36 = Math.abs( navigator.userAgent.hashCode() ).toString(36); //user agent, hashed, base 36
//	var uag36 = ""; for(x in window.navigator){ nav36+= (x + ":" + window.navigator[x]  + "::" +  JSON.stringify( window.navigator[x] ) ); };	nav36 = Math.abs( nav36.hashCode() ).toString(36);
	var now36 = new Date().getTime().toString(36); //timestamp, base 36

	return ( uag36 + "-" + now36 ) ;
}


//https://www.joezimjs.com/javascript/3-ways-to-parse-a-query-string-in-a-url/
var parseQueryString = function( queryString ) {
    var params = {}, queries, temp, i, l;
    // Split into key/value pairs
    queries = queryString.split("&");
    // Convert the array of strings into an object
    for ( i = 0, l = queries.length; i < l; i++ ) {
        temp = queries[i].split('=');
        params[temp[0]] = temp[1];
    }
    return params;
};

