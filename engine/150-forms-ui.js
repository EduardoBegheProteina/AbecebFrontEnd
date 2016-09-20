//Create widget builder form
function widgetBuilderForm( target, data ){

console.log ( 'widgetBuilderForm', target, JSON.stringify( data ) );

// set form defaults	
// if( data.widgetType && data.widgetType == "monitor-variaciones" && !data.columnas ){
if( !data.columnas){
	data.columnas = [
		{
			"userLabel": "", // opción del usuario: con qué nombre presentar esta columna del Monitor.
			"presentarDatoFormula": "" // opción del usuario: con qué dato calcular el dato de esta columna del Monitor.
		}
		];
}

	if( !data.display ){ data.display = "builderPage"; };
	

// 	if( !data.columnas){ data.columnas = [
// 		{
// 			"userLabel": "", // opción del usuario: con qué nombre presentar esta columna del Monitor.
// 			"presentarDatoFormula": "" // opción del usuario: con qué dato calcular el dato de esta columna del Monitor.
// 		}
// 		] };
	
	if( !data.widgetRangoFechas1 ){ data.widgetRangoFechas1 = "1" }
	if( !data.widgetRangoFechas2 ){ data.widgetRangoFechas2 = "1" }	

	//populate series userLabels
	$.each( data.series, function(index, item) {
		if(!this.userLabel || this.userLabel==""){
			this.userLabel = this.dbName;
			}
		});


	$.when( lazyGetTemplate("widgetBuilderForm") ).done(function() {
    	//procesamos template
		var html = $.templates["widgetBuilderForm"].render( data );
		$( target ).html(html);
		
		widgetBuilderFormInit( target );
		
//		$('.widgetBuilderPreviewAndSavetoHT').pin()
		
		//procesamos cpObjects que acabamos de renderear
		$( target ).find(".cpObjectToInit").cpObject().removeClass('cpObjectToInit');
		
		if( data.display == "builderPage" ){
		
			Chart.defaults.global.animation.duration = 0;
			
			widgetBuilderTypeSelectInit();
			
			widgetSaveToHTinit();

			$("#widgetBuilderOptionsFormContainer").off('input propertychange paste change click' ).
				on('input propertychange paste change click', widgetBuilderPreviewUpdate );
			
			widgetBuilderPreviewUpdate();
			
			widgetSaveToHTidUpdate();
		}

		
	}); //end when.done
	
	return ( target );
}



function widgetSaveToHTidUpdate(){

	var htList = $("#sortableHtPages").cpGetData();

	//menu "guardar en …" de widget builder form
	if($("#widgetSaveToHTid").length!=0){

		$("#widgetSaveToHTid option").remove();

		$.each( htList.children, function(index, item) {
			if(item.fromRole==undefined) {
				$("#widgetSaveToHTid").append(new Option(item["cpTitle"], item["abecebObjectId"]));
			}
		});
		
		if($defaultWorkspace!=undefined && $defaultWorkspace != "") {
			console.log("Seleccionando Default Workspace: " + $defaultWorkspace);
			$("#widgetSaveToHTid").val($defaultWorkspace);
		}
	}
	
	initContextMenu('widgetSaveToHTidUpdate'); //rebuild context menu

}







function widgetBuilderFormSerialize( form ){ 

//var form = form.currentTarget || form || this;
var form = $("#widgetBuilderOptionsForm");

var widgetBuilderCpData = $(form).cpGetData()
var widgetBuilderFormData = $(form).serializeObject();


//push unchecked checkboxes into form data
$("#widgetBuilderOptionsForm input:checkbox:not(:checked)").each(function() {
        widgetBuilderFormData[this.name] = "false";
    });



if( widgetBuilderFormData["formUI_sortableFormField-serie-sortedKeys"] ){

	var theFormFields = [
//		"id", "dbName", "dbDatoAlegend", "userLabel", "PresentarDatoFormula", //required
		"chartType", "ejeCero", //optional
		//calculos:
		"calculoVariacion-nroDePeriodos",
		"calculoVariacion-valordeN",
		"calculoVariacion-tipoDeCalculo",
		"calculoVariacion-selectTipoCalculoDosPromedios",
		"calculoVariacion-periodicidad",
		"calculoVariacion-fechaHasta",
		"calculoVariacion-fechaDesdeSegundoCalculo",
		"calculoVariacion-fechaHastaSegundoCalculo"
	]
	
	widgetBuilderFormData["series"] = [];
	var sortedKeys = widgetBuilderFormData["formUI_sortableFormField-serie-sortedKeys"]

	//normalize keys - if only 1 object, we will receive string instead of array
	if( typeof( sortedKeys ) == "string" ){
		sortedKeys = [ sortedKeys ];
	}

	
	$.each( sortedKeys , function( index, value ) {
	
		widgetBuilderFormData["series"][index] = {
			id : widgetBuilderFormData["formUI_sortableFormField-serieKey"+value+"-ID"],
			dbName : widgetBuilderFormData["formUI_sortableFormField-serieKey"+value+"-dbName"],
			dbDatoAlegend : widgetBuilderFormData["formUI_sortableFormField-serieKey"+value+"-dbDatoAlegend"],
			
			userLabel : widgetBuilderFormData["formUI_sortableFormField-serieKey"+value+"-userLabel"],
			presentarDatoFormula : widgetBuilderFormData["formUI_sortableFormField-serieKey"+value+"-PresentarDatoFormula"]
			}

		// widgetBuilderFormData["series"][index] = {};
		
		for( var theFieldIx in theFormFields){
			var theFieldName = theFormFields[theFieldIx];
			if( widgetBuilderFormData["formUI_sortableFormField-serieKey"+value+"-" + theFieldName] ){
			widgetBuilderFormData["series"][index][theFieldName] =
				widgetBuilderFormData["formUI_sortableFormField-serieKey"+value+"-" + theFieldName];
				}
		}

		
	}); //end each sortedKeys

}//end if serie-sortedKeys




if( widgetBuilderFormData["formUI_sortableFormField-columna-sortedKeys"] ){

	var theFormFields = [
//		"userLabel", "PresentarDatoFormula", //required
		//calculos:
		"calculoVariacion-nroDePeriodos",
		"calculoVariacion-valordeN",
		"calculoVariacion-tipoDeCalculo",
		"calculoVariacion-selectTipoCalculoDosPromedios",
		"calculoVariacion-periodicidad",
		"calculoVariacion-fechaHasta",
		"calculoVariacion-fechaDesdeSegundoCalculo",
		"calculoVariacion-fechaHastaSegundoCalculo"
	]
	

	widgetBuilderFormData["columnas"] = [];
	
	var sortedKeys = widgetBuilderFormData["formUI_sortableFormField-columna-sortedKeys"]
	//normalize keys - if only 1 object, we will receive string instead of array
	if( typeof( sortedKeys ) == "string" ){
		sortedKeys = [ sortedKeys ];
	}

	$.each( sortedKeys , function( index, value ) {

		//widgetBuilderFormData["columnas"][index] = {};

		var columnaOptions = {
			userLabel : widgetBuilderFormData["formUI_sortableFormField-columnaKey"+value+"-userLabel"],
			presentarDatoFormula : widgetBuilderFormData["formUI_sortableFormField-columnaKey"+value+"-PresentarDatoFormula"]
			}

		widgetBuilderFormData["columnas"][index] = columnaOptions;
		
		for( var theFieldIx in theFormFields){
			var theFieldName = theFormFields[theFieldIx];
			if( widgetBuilderFormData["formUI_sortableFormField-columnaKey"+value+"-" + theFieldName] ){
			widgetBuilderFormData["columnas"][index][theFieldName] =
				widgetBuilderFormData["formUI_sortableFormField-columnaKey"+value+"-" + theFieldName];
				}
		}
		
		
	}); //end each sortedKeys


}//end if columnas-sortedKeys


//limpiamos los campos que no van al JSON
$.each( widgetBuilderFormData , function( index, value ) {

	if(index.indexOf('formUI_')==0){
		delete widgetBuilderFormData[index];
	}

	}); //end each


var newData = {}
$.extend( true, newData, widgetBuilderCpData, widgetBuilderFormData )

//ensure COLUMNAS will come from form data, if appropriate
if( widgetBuilderFormData.columnas ){
	//delete newData.columnas;
	newData.columnas = widgetBuilderFormData.columnas
	}

//ensure COLUMNAS is defined
if( !newData.columnas || newData.columnas.length == 0 ){ newData.columnas = [{ "userLabel":"", "presentarDatoFormula":"" }]; };

//store newData in cpData
$(form)[0]['cpData'] = newData;

return ( newData );

}





function rnd100( howMany ){
	if(!howMany) { 	return ( Math.floor(Math.random() * 100) + 0 ); }
	
	var result = [];
	for(var i = 0;i<howMany; i++){
		result.push ( Math.floor(Math.random() * 100) + 0 )
	}
	return result;
}



//construimos preview
function widgetBuilderPreviewUpdate(){

//obtenemos formData: datos del formulario
var formData = widgetBuilderFormSerialize();

if( formData.dataShown ){ delete formData.dataShown; }

///////////////////
//preprocesamos formData para construir preview
//y dataShown a persistir
//y dataShown a persistir
	
var cpTitle = formData.widgetName || "Sin Título";

var previewData = {
	"cpTitle": cpTitle,
	"usrctnt1": "",
	"usrctnt2": "",
	"type" : "cpWidget",
	"type1" : "unused",
	"type2": "unused",
	"widgetType":"unused",
	"dataShown": {
		"cpTitle": cpTitle,
		"selectedSeries": formData["series"]
		},
	"gridWidth":"6"
	};

if( formData.iconSet ){
	previewData["iconSet"] = formData.iconSet
	}


//ejemplo de como tomar un dato de la raiz de formData
//y moverlo a previewData.dataShown
if( formData.widgetType == "monitor-variaciones" ){
	previewData.dataShown.columnas = formData.columnas;
}

//preprocesamos Series: formData.presentarDatoFormula => calculationType
if(formData.series){
for( ix in formData.series ){
	if( formData.series[ix].presentarDatoFormula ){
		formData.series[ix].calculationType = formData.series[ix].presentarDatoFormula
		}//end if presentarDatoFormula
	}//end for
}//end if formData.series

//preprocesamos Columnas: formData.presentarDatoFormula => calculationType
if(formData.columnas){
for( ix in formData.columnas ){
	if( formData.columnas[ix].presentarDatoFormula ){
		formData.columnas[ix].calculationType = formData.columnas[ix].presentarDatoFormula
		}//end if presentarDatoFormula
	}//end for
}//end if formData.columnas



//armamos tabledata si corresponde.
// los indicadores son el único tipo de widget sin tabledata
if( formData.widgetType != "indicador"){

		//build tableData
		//build table THEAD
		var tableData = [ ["Serie"] ]; // [ ["Serie","Col 1","Col 2","Col 3"] ];	
		if( formData.widgetType=="monitor-variaciones" ){
			var colIx = 1;
			for( col in formData.columnas ){
				if(formData.columnas[col]['userLabel']){
				tableData[0].push (formData.columnas[col]['userLabel'] );
				}else{
				tableData[0].push ("Columna "+colIx)
				}
			}
		}else{
			for(var i = 1; i<=3; i++){
				tableData[0].push ("Col " + i);
			}
		}
	
		//build table TBODY
		for (var serie in formData.series) {
			if( formData.widgetType=="monitor-variaciones" ){
				var rowdata = [ formData.series[serie].userLabel ];
				for( col in formData.columnas ){
					rowdata.push ( rnd100() );
				}
				tableData.push ( rowdata ); 
			}else{
				tableData.push ( [
					formData.series[serie].userLabel, rnd100(), rnd100(), rnd100()
					] ); 
				}
			}
	
		previewData["dataShown"]["tabledata"] = tableData;

	}


if( formData.widgetType == "monitor-cronologico" || formData.widgetType == "grafico-cronologico" ){
		previewData.dataShown.widgetRangoIncluirProyecciones = formData.widgetRangoIncluirProyecciones;
		previewData.dataShown.widgetRangoFechas1 = formData.widgetRangoFechas1;
		if( formData.widgetRangoIncluirProyecciones && formData.widgetRangoIncluirProyecciones!="false"){
			previewData.dataShown.widgetRangoFechas2 = formData.widgetRangoFechas2;
		}
}

if( formData.widgetType == "grafico-partentotales" || formData.widgetType == "grafico-partcronologico" ){
	previewData.dataShown.calculationType = formData.widgetPresentarDatoFormula;
}


previewData.type2 = formData.widgetType;
previewData.widgetType = formData.widgetType;

//armamos preview
//y data especifica por cada tipo

 
switch ( formData.widgetType ){

	case "monitor-cronologico":
		previewData.type1 = "tabla";
		// previewData.type2 = "monitor-cronologico";
		
		
		break;
		
	case "monitor-variaciones":
		previewData.type1 = "tabla";
		// previewData.type2 = "monitor-variaciones";
		
		break;


	case "indicador":
		previewData.type1 = "indicador";
		previewData.type2 = "unused";
		previewData["dataShown"]["cpH4"]= formData.series[0].userLabel;
		previewData["dataShown"]["valor"] = rnd100();
		previewData["dataShown"]["valorUM"]= "";
		previewData.gridWidth = "4";
		
		if(
		
		//caso: no se indico calcular ni ultimo dato, ni variacion:
		
			( !formData.widgetPresentarVariacion || formData.widgetPresentarVariacion == "false" )
			&&
			( !formData.widgetPresentarUltimoDato || formData.widgetPresentarUltimoDato == "false" )
		){
			previewData["dataShown"]["valor"] = "<small class=\"error\"><i class=\"fa fa-exclamation-triangle\"></i> Seleccione una opción para Datos del Indicador.</small>";
			
		}else if(
		
		//caso: solo calcular ultimo dato
		
			( !formData.widgetPresentarVariacion || formData.widgetPresentarVariacion == "false" )
			&&
			( formData.widgetPresentarUltimoDato || formData.widgetPresentarUltimoDato != "false" )
		){
			//TBD especificar calcular ultimo dato
			previewData["dataShown"]["ownerText1"]= "Detalle de dato";
			previewData["dataShown"]["valorUM"]= "Unidad de medida";
			
		} else if(
		
		//caso: solo calcular variacion	
			( formData.widgetPresentarVariacion || formData.widgetPresentarVariacion != "false" )
			&&
			( !formData.widgetPresentarUltimoDato || formData.widgetPresentarUltimoDato == "false" )
			
		){
			previewData.dataShown.calculationType = formData.widgetPresentarVariacionFormula;
			previewData["dataShown"]["valorUM"]= "%";
//			previewData["dataShown"]["trendUM"] = "%";
			previewData["dataShown"]["trend"] = Math.floor(Math.random() * 3) -1;
//			previewData["dataShown"]["trendValue"] = rnd100();
//			previewData["dataShown"]["trendDescription"]= "respecto a periodo anterior";				
			previewData["dataShown"]["ownerText1"]= "Detalle de variación";				

		} else if(
		
		//caso:  calcular ultimo dato Y variacion	
			( formData.widgetPresentarVariacion || formData.widgetPresentarVariacion != "false" )
			&&
			( formData.widgetPresentarUltimoDato || formData.widgetPresentarUltimoDato != "false" )
			
		){

			//TBD especificar calcular ultimo dato Y variacion
			previewData.dataShown.calculationType = formData.widgetPresentarVariacionFormula;
			previewData["dataShown"]["valorUM"]= "Unidad de medida";
			previewData["dataShown"]["trendUM"] = "%";
			previewData["dataShown"]["trend"] = Math.floor(Math.random() * 3) -1;
			previewData["dataShown"]["trendValue"] = rnd100();
			previewData["dataShown"]["trendDescription"]= "respecto a periodo anterior";				
			previewData["dataShown"]["ownerText1"]= "Detalle de variación";				
		}
		

		
		break;
		
	case "grafico-cronologico":
	case "grafico-partcronologico": 
		previewData.type1 = "grafico";
//		previewData.type2 = formData.widgetType;

		if( previewData.dataShown.widgetRangoFechas1 ){
			var theLabels = [];
			var fechaIx = 1;
			for(var i=-1; i<previewData.dataShown.widgetRangoFechas1; i++ ){
				theLabels.push( "Fecha " + ( fechaIx++ ) );
			}
			if( previewData.dataShown.widgetRangoFechas2 ){
				for(var i=0; i<previewData.dataShown.widgetRangoFechas2; i++ ){
					theLabels.push( "Fecha " + ( fechaIx++ ) );
				}
			}
		}else{
			var theLabels = ["Fecha 1","Fecha 2","Fecha 3","Fecha 4"]
		}

		previewData["dataShown"]["graphdata"] = {
			"labels": theLabels,
			"datasets": []
			};
			
		for (var serie in formData.series) {
		
		var datos = [];
		var datosProjected = [];
			
		if( previewData.dataShown.widgetRangoFechas1 ){
			for(var i=-1; i<previewData.dataShown.widgetRangoFechas1; i++ ){
				datos.push( rnd100() + 100 )
			}
			if( previewData.dataShown.widgetRangoFechas2 ){
				for(var i=0; i<previewData.dataShown.widgetRangoFechas2; i++ ){
					datosProjected.push( rnd100() + 100 )
				}
			}
		}else{
			datos = [ rnd100() + 100, rnd100() + 100, rnd100() + 100, rnd100() + 100 ]
		}

			
			
			var pd = previewData["dataShown"]["graphdata"]["datasets"];
			
			var dataObj = {
					"chartType": formData.widgetType ==
						"grafico-partcronologico" ?
							"horizontalBar-stacked":
							formData.series[serie].chartType,
					"userLabel": formData.series[serie].userLabel,
					"ejeCero": formData.series[serie].ejeCero,
					"data": datos
					}
			if( datosProjected.length>0 ){
				dataObj["dataProjected"] = datosProjected;
				}
		
			pd.push ( dataObj );
		}//end for (var serie in formData.series
		
		//para grafico part. cronologico,
		//simulamos valores aforados, extendiendo el ultimo valor
		if( formData.widgetType == "grafico-partcronologico"){	
			for( var i = 0 ; i <= 3; i ++ ){
				var sum = 0;
				for ( var i2 = 0; i2 < formData.series.length-1; i2 ++){
					sum+= pd[i2]["data"][i]
				}
				pd[formData.series.length-1]["data"][i] = (formData.series.length*200) - sum
			}
		
		}
		
		
		
		
		break;

	case "grafico-partentotales":
		previewData.type1 = "grafico";
//		previewData.type2 = "pie";// formData.widgetType; //"pie";
		previewData["dataShown"]["graphdata"] = {
			"labels": [],
			"datasets": [
				{
				"type": "pie",
				"data": rnd100( formData.series.length ) //devuelve array, no hace falta encerrarlo aqui
				}
			]
			};
		for (var serie in formData.series) {
			previewData["dataShown"]["graphdata"]["labels"].push ( formData.series[serie].userLabel );
		}//end for (var serie in formData.series
		break;

	
	default:
		//default code block
		break;
	}


	//solo necesitamos columnas para el monitor de variaciones.
	if( previewData.widgetType != "monitor-variaciones" && previewData.columnas ){
		delete previewData.columnas;
	}
	
	$('.widgetBuilderPreview').empty();
	$('.widgetBuilderPreview')[0].cpData={}
	$('.widgetBuilderPreview').cpObject( previewData );
	renderCpWidget( $('.widgetBuilderPreview'), previewData, true );
	console.log ( JSON.stringify( previewData ) )
	
	
	//store previewData in form cpObject
	delete $('.widgetBuilderOptionsForm')[0].cpData['dataShown']
	$.extend( true, $('.widgetBuilderOptionsForm')[0].cpData, previewData )	


} // end widgetBuilderPreviewUpdate











function widgetBuilderTypeSelectInit(){
	$('.widgetBuilderTypeSelect .widgetTypeOption').click(function() {
		event.preventDefault();
	
		var form = $("#widgetBuilderOptionsForm");
		
		//get stored options
//		var data = widgetBuilderFormSerialize( $('.widgetBuilderOptionsForm') );
		var data = $(form).cpGetData()
	
		//update typeSelect
		$('.widgetBuilderTypeSelect .widgetTypeOption').removeClass('selected');
		$(this).addClass('selected');
		
		//get selected widget type
		var widgetType = $(this).data("widgettype");
		
		//set data properties for selected options
		data.display = "formOptions";
		data.widgetType = widgetType; // "grafico-cronologico";
			
		widgetBuilderForm( '#widgetBuilderOptionsFormContainer', data );
		widgetBuilderPreviewUpdate();
	
	});

}




function widgetBuilderFormInit( target ){


// FORM OPTIONS

$( ".sortableFormFieldsGroup" ).sortable({
  axis: "y",
  handle: ".sortableFormField-handler",
  update: function (event, ui){
  	widgetBuilderPreviewUpdate();
  }
});


$( "input:checkbox" ).checkGroupedOptions();
$( "select" ).selectGroupedOptions();


$('.widgetBuilderOptionsForm').submit(function( event ) {
	event.preventDefault();
	console.log( "Handler for builder FORM .submit() called." );
});


$( target ).on( "click", ".sortableFormFieldControl-delete", function() {
	event.preventDefault();
	var targetField = ( $(this).closest(".sortableFormField") );
	$(targetField).remove();
});


$( target ).off( "click", ".sortableFormFieldControl-add" ).on( "click", ".sortableFormFieldControl-add", sortableFormFieldControlAdd );


function sortableFormFieldControlAdd(){
	event.preventDefault();	
	event.stopImmediatePropagation();
	event.stopPropagation();
	
	//find parent targetField
	 targetField = ( $(this).closest(".sortableFormField") );
	 
	//clone targetField
	var newField = $(targetField).clone().appendTo( $(targetField).parent() );
	

	//replace IDs and NAMEs	/////
	
	// get old Key
	var sortedKeysInput = $(newField).find( "input[name*='sortedKeys']" )
	var oldKey = $(sortedKeysInput).val();

	// define new key
	var newKey = new Date().getTime(); //timestamp
	
	// apply to sortedKeys
	$(sortedKeysInput).val( newKey );
	
	// apply to fields
	var newFieldIDobjs = $(newField).find(  "[class=form-control]"  );
	var re = new RegExp ( "Key" + oldKey, "gi" ); // "Key(\d+)" 
	$( newFieldIDobjs ).each(function( index ) {
		$(this).attr('id', $(this).attr('id').replace( re, "Key"+newKey ) )
		$(this).attr('name', $(this).attr('name').replace( re, "Key"+newKey ) )
	});

}




} //widgetBuilderFormInit



function widgetSaveToHTinit(){
	$('.widgetBuilderSavetoHT').submit(function() {
		event.preventDefault();
		
		// messageModal("Creación de Widgets","El widget se ha creado y guardado en el espacio de trabajo exitosamente.");
	
		var data = widgetBuilderFormSerialize( $('.widgetBuilderOptionsForm') );
		
 		if( data.widgetType != "monitor-variaciones" && data.columnas ){
 			delete data.columnas;
 		}

//		if( data.columnas ){
//			delete previewData.columnas;
//		}
		
		data["saveToHTid"] = $(this).closest('FORM').find("SELECT").val();
		//widgetSaveToHTid es el select q indica HT donde guardar el widget
		
		receivedWorkspace = saveWidgetToHT( data );
		status = receivedWorkspace.status;
		
		if ( status == 200 ) {
			// Si es un widget agregado al workspace de convertir objetos compass, redirijo a editar el objeto
			if ( data.saveToHTid == ids.consultantWorkspaceId ) {
				// REDIR
				//modalContinue("Creación de Widgets","El widget se ha creado y guardado en el espacio de trabajo exitosamente.");
				window.location = redirectUrls.editCompassObjectRedirectURL + receivedWorkspace.createdDataObjectId;
			} else {
				//messageModal("Creación de Widgets","El widget se ha creado y guardado en el espacio de trabajo exitosamente.");
				modalWithOptions("Creación de Widgets", "El widget se ha creado y guardado en el espacio de trabajo exitosamente.", editCompassWorkspace, data.saveToHTid, "Ir a Hoja de Trabajo", "Continuar");
			}
		} else if ( status == 500 ) {
			messageModal("Creación de Widgets", "Ocurrio un error al crear el widget.");
		}
		
	});
}


//////////////////// FORM FUNCTIONS

// FUNCION PARA SPINNER
(function ($) {
	$('BODY').on('click', '.spinner .btn:first-of-type', function() {
		var targetInput = $(this).closest('.spinner').find('input');
		$(targetInput).val( parseInt($(targetInput).val(), 10) + 1);
	});
	$('BODY').on('click', '.spinner .btn:last-of-type', function() {
		var targetInput = $(this).closest('.spinner').find('input');
		if( $(targetInput).val() > 1 ){
			$(targetInput).val( parseInt($(targetInput).val(), 10) - 1);
			}
	});
})(jQuery);

////// UTILTiTY 
// serialize FORM to JSON

$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};





(function( $ ) {

	// funcion para check groups
	
	$.fn.checkGroupedOptions = function() {

	return this.each(function() { 
 
 	var checkboxName = $(this).attr('name');
 	var checked = $(this).prop('checked');
 	 
 	if(checked){
 		$('[data-showifchecked="'+checkboxName+'"]').show(250);
 		$('[data-showifnotchecked="'+checkboxName+'"]').hide();
 	}else{
 		$('[data-showifchecked="'+checkboxName+'"]').hide();
 		$('[data-showifnotchecked="'+checkboxName+'"]').show(250);
 	}
 	
    //return this;
    } )
    }


	// funcion para select groups
	
	$.fn.selectGroupedOptions = function() {

	return this.each(function() { 
 
 	//var selectName = $(this).attr('name');
 	var groupName = $(this).data( "groupname" );
 	var selectVal = $(this).val();
 	//console.log('groupName', groupName, selectVal)
 	
 	//inferir el contenedor
 	var groupContainer = $(this).closest('.subfieldset') //sub grouped options
	if($(groupContainer).length==0){
 		groupContainer = $(this).closest('.sortableFormField') //sortable fields
 		}
 	if($(groupContainer).length==0){
 		groupContainer = $(this).closest('fieldset') //global fields
	 	}
 	
 	if( $(groupContainer).length>0) {

 	$(groupContainer).find('[data-showifgroupselect~="'+groupName+'"]').each(function( index ) {
		//console.log ('testing item: ', this )
		var showifgroupselectvalues = $(this).data('showifgroupselectvalues');
		showifgroupselectvalues = showifgroupselectvalues.split(",");
		//console.log ('groupName in', groupName, showifgroupselectvalues)
		if(showifgroupselectvalues.indexOf(selectVal)>-1 ){
			//console.log('show', this)
			$(this).show(250);
		}else{
			//console.log('hide', this)
			$(this).hide(250);
		}
		

		}); //end each
	
	}//end existe groupContainer

 	
 	 
//  	if(checked){
//  		$('[data-showifchecked="'+checkboxName+'"]').show(250);
//  		$('[data-showifnotchecked="'+checkboxName+'"]').hide();
//  	}else{
//  		$('[data-showifchecked="'+checkboxName+'"]').hide();
//  		$('[data-showifnotchecked="'+checkboxName+'"]').show(250);
//  	}
 	
    //return this;
    } )
    }

  }( jQuery ));


$( "BODY" ).on( "click", "input:checkbox", function() {
	$(this).checkGroupedOptions();
});

$( "BODY" ).on( "click, change", "select", function() {
	$(this).selectGroupedOptions();
});

