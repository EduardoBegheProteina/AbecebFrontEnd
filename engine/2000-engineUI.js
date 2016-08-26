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
//console.log ('preprocessCpDataShown', data)

	//curzar tabledata with series
	if ( dataShown.tabledata && data.series ){
		for( var row=0; row<Math.min( data.series.length, dataShown.tabledata.length -1) ; row++ ){
			//console.log ('row', row, dataShown.tabledata[row+1][0] )
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

//console.log ( 'initGraficos 412' );

var container = container || $('BODY');

//console.log ( 'initGraficos' );

var graphBackgroundColors = [
	"rgba(122, 204, 122, 0.6)", //"#7acc7a", 
	"rgba(128, 213, 255, 0.6)", //"#80d5ff", 
	"rgba(41, 123, 204, 0.6)", //"#297bcc", 
	"rgba(183, 92, 230, 0.6)", //"#b75ce6", 
	"rgba(204, 82, 82, 0.6)", //"#cc5252", 
	"rgba(230, 161, 92, 0.6)", //"#e6a15c", 
	"rgba(230, 230, 0, 0.6)" //"#e6e600"
	]
var graphBorderColors = [
	"#7acc7a", 
	"#80d5ff", 
	"#297bcc", "#b75ce6", "#cc5252", "#e6a15c", "#e6e600"
	]

gData = {};

$(container).find('.cpWidget-x-grafico').each( function( index, el ) {

	graphBackgroundColorIx = 0;

	//console.log ('initgraficos each on ', $(el) )

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


var bestType = gData.datasets[0].type; //"";



//Procesamos Datasets
for( var i=0; i<gData.datasets.length; i++){

	if( gData.datasets[i]["chartType"] ){
		gData.datasets[i]["type"] = gData.datasets[i]["chartType"]
		}

	if( gData.datasets[i]["userLabel"] ){
		gData.datasets[i]["label"] = gData.datasets[i]["userLabel"]
		}


	if( !gData.datasets[i]["backgroundColor"] ){
	gData.datasets[i]["backgroundColor"] = graphBackgroundColors [graphBackgroundColorIx]
	}
	if( !gData.datasets[i]["borderColor"] ){
	gData.datasets[i]["borderColor"] = graphBorderColors [graphBackgroundColorIx];
	}
	gData.datasets[i]["pointBackgroundColor"] = graphBackgroundColors [graphBackgroundColorIx];
	gData.datasets[i]["pointBorderColor"] = graphBorderColors [graphBackgroundColorIx];
	
	gData.datasets[i].fill = false;
	gData.datasets[i]["pointRadius"] = 4;
	gData.datasets[i]["lineTension"] = 0;
			

	graphBackgroundColorIx++
	if( graphBackgroundColorIx > graphBackgroundColors.length ){ graphBackgroundColorIx = 0 };
	

	bestType = getBestType( bestType, gData.datasets[i].type );
	
	switch ( gData.datasets[i].type ){
		case 'line':
			gData.datasets[i].fill = false;			
			break;
		case 'area':
			gData.datasets[i].type = 'line';
			gData.datasets[i].fill = true;
//			bestType = "line";
			break;
		case 'bar':
			gData.datasets[i].type = 'bar';
			gData.datasets[i].fill = true;
//			bestType = "bar";
			break;
		case 'columnas-stacked': case 'bar-stacked':
			gData.datasets[i].type = 'bar';
//			bestType = "bar";
			// scales.yAxes.["stacked"]: true
			// scales.xAxes.["stacked"]: true
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
//			bestType = "horizontalBar";
			break;
		
		case 'horizontalBar-stacked':
			gData.datasets[i].type = 'horizontalBar';
//			bestType = "horizontalBar";

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
//			bestType = "pie";
			/*
			if( bestType == "" || bestType == "pie" ){
				bestType = "pie";
				}else{
				//no podemos combinar torta con otro tipo. Usamos el mejor definido:
				gData.datasets[i].type = bestType
				}
				*/
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
		
		// console.log ('2000 graph type: ', bestType, gData.datasets)

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
		// console.log('2000 widgetSaveToHTidUpdate')
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
function tdFromTableData(value) {
	var value = value.split("|");
	
	if(value.length==2){
		var vObj = parseQueryString( value[1] );
		}else{
		var vObj = {};
		}
	
	var r = "<td>";
	if( vObj.um1 ){ r+=vObj.um1 };
	r+= value[0] ;
	if( vObj.um2 ){ r+=vObj.um2 };
	r+= "</td>";

	return r;
		//'<td>'+value[0]+'</td>';
}
$.views.tags("tdFromTableData", tdFromTableData);




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

