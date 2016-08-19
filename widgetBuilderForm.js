$.templates("widgetBuilderForm",
		
	'{{if !display || display=="builderPage"}}'+
		'{{include tmpl="widgetBuilderPage"/}}'+
	'{{else display=="formOptions"}}'+
		'{{include tmpl="widgetBuilderFormOptions"/}}'+
	'{{/if}}'
		
); //widgetBuilderForm



$.templates("widgetBuilderPage",

'<div class="container1 cmp-cont widgetBuilderFormGroup">'+
	'{{include tmpl="widgetBuilderForm-cmpHeader"/}}' +	
	'{{include tmpl="widgetBuilderForm-typeSelect"/}}' +

	'<div class="row widgetBuilderOptionsFormContainerRow">'+
		'<div class="col-lg-7 col-xs-12" id="widgetBuilderOptionsFormContainer" class="widgetBuilderOptionsFormContainer">'+
			'{{include tmpl="widgetBuilderFormOptions"/}}' +
		'</div>'+		
		'<div class="col-lg-4 col-xs-12 widgetBuilderPreviewAndSavetoHT">'+
			'{{include tmpl="widgetBuilderPreviewAndSavetoHT"/}}' +
		'</div>'+
	'</div>'+
'</div>'

); //widgetBuilderPage



$.templates("widgetBuilderForm-cmpHeader",

'<div class="cmp-header">'+
	'<div class="row">'+
		'<div class="col-xs-12">'+
			'<a href="{{:dbTreeHREF}}" class="volver-btn"><i class="fa fa-chevron-left"></i> Volver al listado</a>'+
			'<h2>Crear Monitor, gráfico o indicador</h2>'+
		'</div>'+
	'</div>'+
'</div>'
	
); //widgetBuilderForm-cmpHeader






/*
widgetType = full
	monitor-cronologico
	monitor-variaciones
	indicador
	grafico-cronologico
	grafico-partentotales
	grafico-partcronologico
*/


$.templates("widgetBuilderForm-typeSelect",

'<div class="widgetBuilderTypeSelect">'+
	'<ul>'+
		'<li class="list-nav">'+
			'<h5>Monitor</h5>'+
			'<ul>'+
				'<li id="chh" class="widgetTypeOption {{if widgetType == "monitor-cronologico" || widgetType == "" || !widgetType }} selected {{/if}}" data-widgettype="monitor-cronologico" >'+
					'<a href="#" class="btn-nav">'+
						'<i class="fa fa-table"></i>'+
						'<span>Cronológico</span>'+
					'</a>'+
				'</li>'+
				'<li class="widgetTypeOption {{if widgetType == "monitor-variaciones" }} selected {{/if}}" data-widgettype="monitor-variaciones" >'+
					'<a href="#" class="btn-nav">'+
						'<i class="fa fa-table"></i>'+
						'<span>De variaciones</span>'+
					'</a>'+
				'</li>'+
			'</ul>'+
		'</li>'+
		'<li class="list-nav">'+
			'<h5>Indicador</h5>'+
			'<ul>'+
				'<li class="widgetTypeOption {{if widgetType == "indicador" }} selected {{/if}}" data-widgettype="indicador" >'+
					'<a href="#" class="btn-nav">'+
						'<i class="fa fa-arrow-up"></i>'+
						'<span>Indicador</span>'+
					'</a>'+
				'</li>'+
				
			'</ul>'+
		'</li>'+
		'<li class="list-nav">'+
			'<h5>Gráfico</h5>'+
			'<ul>'+
				'<li class="widgetTypeOption {{if widgetType == "grafico-cronologico" }} selected {{/if}}" data-widgettype="grafico-cronologico" >'+
					'<a href="#" class="btn-nav">'+
						'<i class="fa fa-line-chart"></i>'+
						'<span>Cronoloógico</span>'+
					'</a>'+
				'</li>'+
				'<li class="widgetTypeOption {{if widgetType == "grafico-partentotales" }} selected {{/if}}" data-widgettype="grafico-partentotales" >'+
					'<a href="#" class="btn-nav">'+
						'<i class="fa fa-pie-chart"></i>'+
						'<span>Part. en<br>totales</span>'+
					'</a>'+
				'</li>'+
				// '<li class="widgetTypeOption {{if widgetType == "grafico-partcronologico" }} selected {{/if}}" data-widgettype="grafico-partcronologico" >'+
				// 	'<a href="#" class="btn-nav">'+
				// 		'<i class="fa fa-list-ol"></i>'+
				// 		'<span>Part. en totales,<br>cronológico</span>'+
				// 	'</a>'+
				// '</li>'+
			'</ul>'+
		'</li>'+
	'</ul>'+
'</div>'

); //widgetBuilderForm-typeSelect



$.templates("widgetBuilderPreviewAndSavetoHT",

'<div class="form-header">'+
	'<h3>Vista Previa <small>Datos simulados</small></h3>'+
'</div>'+

'<div class="widgetBuilderPreview"></div>'+ // contenido vista previa

'<form action="" class="widgetBuilderSavetoHT">'+
	'<div class="form-group">'+
		'<label class="h4">Guardar en hoja de trabajo</label>'+
		'<select'+
			' id="widgetSaveToHTid" '+
			' name="widgetSaveToHTid" '+
			' class="widgetSaveToHTselectID form-control" required="">'+
			// '<option value="hoja1">Hoja de Trabajo 1</option>'+
			// '<option value="hoja2">Hoja de Trabajo 2</option>'+
			// '<option value="hoja3">Hoja de Trabajo 3</option>'+
		'</select>'+
		'<button'+
			' id="widgetBuilderSavetoHTsubmit" '+
			' class="btn-main" type="submit">Guardar</button>'+
	'</div>'+
'</form>'
	
); //widgetBuilderPreviewAndSavetoHT




/*
widgetType = full
	monitor-cronologico
	monitor-variaciones
	indicador
	grafico-cronologico
	grafico-partentotales
	grafico-partcronologico
*/


$.templates("widgetBuilderFormOptions",

'<form id="widgetBuilderOptionsForm" class="widgetBuilderOptionsForm cpObjectToInit" data-cpdata=\'{{JSONstringifyNoChildren #data/}}\'  >'+
'<div class="form-header">'+
	'<h3>Opciones</h3>'+
'</div>'+

//	'<input type="hidden" '+
//	'name="widgetBuilderOptions-widgetType1" value="" />'+
//	'<input type="hidden" '+
//	'name="widgetBuilderOptions-widgetType2" value="" />'+


	'{{include tmpl="widgetBuilderFormOptions-fieldset-titulo"/}}'+


	'{{if widgetType=="monitor-cronologico" || widgetType=="" || !widgetType }}'+		
		'{{include tmpl="widgetBuilderFormOptions-fieldset-rangofechas"/}}'+
		'{{include tmpl="widgetBuilderFormOptions-fieldset-series"/}}'+	

	'{{else widgetType=="monitor-variaciones"}}'+
		'{{include tmpl="widgetBuilderFormOptions-fieldset-columnas"/}}'+
		'{{include tmpl="widgetBuilderFormOptions-fieldset-series"/}}'+

	'{{else widgetType=="indicador"}}'+
		'{{include tmpl="widgetBuilderFormOptions-fieldset-datoFormulaVariacion"/}}'+
		'{{include tmpl="widgetBuilderFormOptions-fieldset-series"/}}'+

	'{{else widgetType=="grafico-cronologico"}}'+
		'{{include tmpl="widgetBuilderFormOptions-fieldset-rangofechas"/}}'+
		'{{include tmpl="widgetBuilderFormOptions-fieldset-series"/}}'+
		//FALTA SELECCIONAR TIPO DE GRAFICO EN SERIE
		
	'{{else widgetType=="grafico-partentotales"}}'+
		'{{include tmpl="widgetBuilderFormOptions-fieldset-datoFormula"/}}'+
		'{{include tmpl="widgetBuilderFormOptions-fieldset-series"/}}'+

	'{{else widgetType=="grafico-partcronologico"}}'+
		'{{include tmpl="widgetBuilderFormOptions-fieldset-rangofechas"/}}'+
		'{{include tmpl="widgetBuilderFormOptions-fieldset-datoFormula"/}}'+
		'{{include tmpl="widgetBuilderFormOptions-fieldset-series"/}}'+
	
	'{{else}}'+ // full form
		'{{include tmpl="widgetBuilderFormOptions-fieldset-rangofechas"/}}'+
		'{{include tmpl="widgetBuilderFormOptions-fieldset-datoFormula"/}}'+
		'{{include tmpl="widgetBuilderFormOptions-fieldset-datoFormulaVariacion"/}}'+
		'{{include tmpl="widgetBuilderFormOptions-fieldset-columnas"/}}'+
		'{{include tmpl="widgetBuilderFormOptions-fieldset-series"/}}'+
	'{{/if}}'+



//'{{else type1=="grafico"}}{{include tmpl="cpWidget-x-grafico"/}}'+


	
'</form>'

); //widgetBuilderForm




$.templates("widgetBuilderFormOptions-fieldset-titulo",
'<fieldset>'+
	'<div class="form-group">'+
		'<label for="widgetName" class="h4">Título del Objeto</label>'+
		'<input type="text" id="widgetName" class="form-control" name="widgetName" value="{{:widgetName}}" required placeholder="Sin título">'+
	'</div>'+
'</fieldset>'
); //widgetBuilderFormOptions-fieldset-titulo


$.templates("widgetBuilderFormOptions-fieldset-rangofechas",
//	'<!-- RANGO DE FECHAS -->'+
'<fieldset>'+
	'<div class="h4">Rango de fechas del objeto</div>'+
	'<div class="form-group clearfix">'+
		'<div class="rango-checkbox">'+
			'<input type="checkbox" value="true" id="widgetRangoIncluirProyecciones" name="widgetRangoIncluirProyecciones" {{if widgetRangoIncluirProyecciones && widgetRangoIncluirProyecciones!="false"}}checked="checked"{{/if}} ><label for="widgetRangoIncluirProyecciones" class="checkbox-label"><strong>Incluir proyecciones</strong></label>'+
		'</div>'+
		'<div class="rango-cont">'+
			'<p>Mostrar desde&nbsp;</p>'+
			'<div>'+
				'<div class="input-group spinner">'+
					'<input type="text" class="form-control" value="{{:widgetRangoFechas1}}" name="widgetRangoFechas1">'+
					'<div class="input-group-btn-vertical">'+
						'<button class="btn btn-default" type="button"><i class="fa fa-caret-up"></i></button>'+
						'<button class="btn btn-default" type="button"><i class="fa fa-caret-down"></i></button>'+
					'</div>'+
				'</div>'+
			'</div>'+
//			'<!-- // SPINNER -->'+
			'<p>&nbsp;periodos en el pasado hasta&nbsp;</p>'+

//			'<!-- SPINNER //-->'+
			'<div data-showifchecked="widgetRangoIncluirProyecciones" >'+
				'<div class="input-group spinner">'+
					'<input type="text" class="form-control" value="{{:widgetRangoFechas2}}" name="widgetRangoFechas2">'+
					'<div class="input-group-btn-vertical">'+
						'<button class="btn btn-default" type="button"><i class="fa fa-caret-up"></i></button>'+
						'<button class="btn btn-default" type="button"><i class="fa fa-caret-down"></i></button>'+
					'</div>'+
				'</div>'+
			'</div>'+
//			'<!-- // SPINNER -->'+
			'<p data-showifchecked="widgetRangoIncluirProyecciones">&nbsp;periodos en el futuro.</p>'+
			'<p data-showifnotchecked="widgetRangoIncluirProyecciones" class="ifRangoIncluirProyecciones0">último dato disponible.</p>'+
		'</div>'+
	'</div>'+
'</fieldset>'
); //widgetBuilderFormOptions-fieldset-rangofechas
	


$.templates("widgetBuilderFormOptions-datoFormulaOptions",
	'{{for ~root.dbDatoFormulaOptions }}'+// ~presentarDatoFormula=~presentarDatoFormula }}'+
		'<option value="{{:value}}" {{if ~presentarDatoFormula == value}}selected{{/if}} >{{:text}}</option>'+
	'{{/for}}'
); //widgetBuilderFormOptions-datoFormulaOptions



$.templates("widgetBuilderFormOptions-variacionFormulaOptions",
'{{for ~root.dbVariacionFormulaOptions ~widgetPresentarVariacionFormula=widgetPresentarVariacionFormula}}'+ 
	'<option value="{{:value}}" {{if ~widgetPresentarVariacionFormula==value}}selected{{/if}} >{{:text}}</option>'+
'{{/for}}'
); //widgetBuilderFormOptions-variacionFormulaOptions




$.templates("widgetBuilderFormOptions-fieldset-datoFormula",
//	'<!-- DATO A USAR -->'+
'<fieldset>'+
	'<div class="h4">Dato a presentar</div>'+
	'<div class="row">'+
	'<div class="col-lg-6">'+
		'<div class="form-group">'+
			'<select name="widgetPresentarDatoFormula" class="form-control" NOTrequired >'+
				'{{include tmpl="widgetBuilderFormOptions-datoFormulaOptions" ~presentarDatoFormula=widgetPresentarDatoFormula /}}'+
			'</select>'+
		'</div>'+
	'</div>'+
	'</div>'+
'</fieldset>'
); //widgetBuilderFormOptions-fieldset-datoFormula
	

$.templates("widgetBuilderFormOptions-fieldset-datoFormulaVariacion",
//'<!-- CREAR INDICADOR -->'+// mostrar ULTIMO DATO o VARIACION
'<fieldset>'+
	'<div class="h4">Datos del indicador '+
			'<span data-showifnotchecked="widgetPresentarUltimoDato">&nbsp;'+
			'<small data-showifnotchecked="widgetPresentarVariacion" class="label label-warning">Seleccione al menos una opción.</small>'+
		'</span>'+
	'</div>'+
	'<div class="form-inline">'+
		'<div class="form-group">'+
			'<input type="checkbox" id="widgetPresentarUltimoDato" name="widgetPresentarUltimoDato" {{if widgetPresentarUltimoDato && widgetPresentarUltimoDato!="false"}}checked="checked"{{/if}} value="true"><label for="widgetPresentarUltimoDato" class="checkbox-label">Último dato</label>'+
		'</div>'+ //group
		'&nbsp; &nbsp; '+
		'<div class="form-group">'+
		
			'<input type="checkbox" value="true" id="widgetPresentarVariacion" name="widgetPresentarVariacion" {{if widgetPresentarVariacion && widgetPresentarVariacion!="false"}}checked="checked"{{/if}}>'+
			'<label for="widgetPresentarVariacion" class="checkbox-label">Variación</label> '+
			
			'<span data-showifchecked="widgetPresentarVariacion" >'+
			'<select id="widgetPresentarVariacionFormula" name="widgetPresentarVariacionFormula" class="form-control" NOTrequired >'+
				'{{include tmpl="widgetBuilderFormOptions-variacionFormulaOptions"/}}'+
			'</select>'+
			'</span>'+
		'</div>'+//group
	'</div>'+ //inline
'</fieldset>'
); //widgetBuilderFormOptions-fieldset-datoFormulaVariacion






$.templates("widgetBuilderFormOptions-fieldset-columnas",
//'<!-- COLUMNAS -->'+
'<fieldset>'+
	'<div class="h4">Columnas del objeto</div>'+
	'<div class="sortableFormFieldsGroup">'+

//	'{{:jsRenderJSONstringify columnas}}'+

//	'{{if columnas}}'+
		'{{for columnas}}'+
			'{{include tmpl="widgetBuilderFormOptions-fieldset-columna"/}}'+
		'{{/for}}'+
//	'{{/if}}'+

	'</div>'+ // <!-- /sortableFormFieldsGroup -->'+
'</fieldset>'
); //widgetBuilderFormOptions-fieldset-columnas



$.templates("widgetBuilderFormOptions-fieldset-columna",

'<div class="sortableFormField sortableDataColumna clearfix">'+
	'<input type="hidden" '+
		' name="formUI_sortableFormField-columna-sortedKeys" value="{{:#parent.index}}" />'+
		'<div class="col-lg-1 sortableFormField-handler">'+
		'<big class="btn-sort"><i class="fa fa-bars"></i></big>'+
	'</div>'+
	'<div class="col-lg-11">'+
		'<div class="form-group inline">'+
			'<label for="formUI_sortableFormField-columnaKey{{:#parent.index}}-userLabel">'+
//					'<!-- <strong>Columna <?= $i ?><br></strong> -->'+
				'Nombre para mostrar'+
			'</label>'+
			'<input type="text" '+
				' id="formUI_sortableFormField-columnaKey{{:#parent.index}}-userLabel" '+
				' name="formUI_sortableFormField-columnaKey{{:#parent.index}}-userLabel" '+
				' class="form-control" NOTrequired '+
				' value="{{:userLabel}}" '+
				'>'+
		'</div>'+
		'<div class="form-group inline">'+
			'<label for="formUI_sortableFormField-columnaKey{{:#parent.index}}-PresentarDatoFormula">Mostrar</label>'+
			'<select'+
				' id="formUI_sortableFormField-columnaKey{{:#parent.index}}-PresentarDatoFormula" '+
				' name="formUI_sortableFormField-columnaKey{{:#parent.index}}-PresentarDatoFormula" '+
				' class="form-control" NOTrequired >'+
					'{{include tmpl="widgetBuilderFormOptions-datoFormulaOptions" ~presentarDatoFormula=presentarDatoFormula /}}'+
			'</select>'+
		'</div> '+
		'<div class="form-group inline cta-btn">'+
			'<button class="btn btn-primary btn-sm sortableFormFieldControl-delete"><i class="fa fa-minus"></i></button> '+
			'<button class="btn btn-primary btn-sm sortableFormFieldControl-add"><i class="fa fa-plus"></i></button>'+
		'</div>'+
	'</div>'+
'</div>'
	
); //widgetBuilderFormOptions-fieldset-columna









$.templates("widgetBuilderFormOptions-fieldset-series",
//	'<!-- SERIES -->'+
'<fieldset>'+
	'<div class="h4">Series <small>'+
	
		'{{if widgetType=="indicador"}}Para el indicador se empleará sólo la primer serie de la lista{{/if}}'+

		'{{if widgetType=="grafico-cronologico"}}Las series con tipos de gráfico incompatibles no se presentarán en la vista previa{{/if}}'+

	'</small></div>'+
	'<div class="sortableFormFieldsGroup {{if widgetType=="indicador"}} sortable-panels-only-first {{/if}}">'+

/*
	'<input type="hidden" '+
		' name="formUI_sortableFormField-serie-sortedKeys" value="{{:#index}}" />'+
	'<input type="hidden" '+
		' name="formUI_sortableFormField-serieKey{{:#index}}-ID" value="{{:id}}" />'+
	'<input type="hidden" '+
 		' name="formUI_sortableFormField-serieKey{{:#index}}-dbName" value="{{:dbName}}" />'+
*/

	'{{for series}}'+
//	'<?php for ($i=0; $i<3; $i++){ ?>'+
//	'<!-- SORT PANEL -->'+
	'<div class="sortableFormField sortableDataSerie clearfix">'+


		'<input type="hidden" '+
			' name="formUI_sortableFormField-serie-sortedKeys" value="{{:#index}}" />'+
		'<input type="hidden" '+
			' name="formUI_sortableFormField-serieKey{{:#index}}-ID" value="{{:id}}" />'+
 		'<input type="hidden" '+
 			' name="formUI_sortableFormField-serieKey{{:#index}}-dbName" value="{{:dbName}}" />'+


		'<div class="col-lg-1 sortableFormField-handler">'+
			'<big class="btn-sort "><i class="fa fa-bars"></i></big>'+
		'</div>'+
		'<div class="col-lg-3 sortableFormField-handler">'+
			'<div class="form-group">'+
				'<div><strong>{{:dbName}}</strong></div>'+
				'<p>Primer dato disponible: {{:dbDatoAlegend}}'+
					'<input type="hidden" '+
					' name="formUI_sortableFormField-serieKey{{:#index}}-dbDatoAlegend" value="{{:dbDatoAlegend}}" />'+
					'<input type="hidden" '+
					' name="formUI_sortableFormField-serieKey{{:#index}}-dbDatoZlegend" value="{{:dbDatoZlegend}}" />'+
					'</p>'+
			'</div>'+
		'</div>'+
		'<div class="col-lg-8">'+
			'<div class="form-group inline">'+
				'<label for="formUI_sortableFormField-serieKey{{:#index}}-userLabel">Nombre para mostrar</label>'+
				'<input type="text" '+
					' id="formUI_sortableFormField-serieKey{{:#index}}-userLabel" '+
					' name="formUI_sortableFormField-serieKey{{:#index}}-userLabel" '+
					' value="{{:userLabel}}" '+
					' class="form-control" NOTrequired >'+
			'</div>'+
			
			'{{if ~root.widgetType == "grafico-cronologico" }}'+
			'<div class="form-group inline" >'+
				'<label for="formUI_sortableFormField-serieKey{{:#parent.index}}-chartType">Tipo</label>'+
				'<select class="form-control" required="" '+
					' name="formUI_sortableFormField-serieKey{{:#parent.index}}-chartType" '+
					' id="formUI_sortableFormField-serieKey{{:#parent.index}}-chartType" >'+
					'<option value="line" '+' {{if chartType=="line"}}selected{{/if}} '+' >Línea</option>'+
					'<option value="area" '+' {{if chartType=="area"}}selected{{/if}} '+'>Área</option>'+
					'<option value="bar"'+' {{if chartType=="bar"}}selected{{/if}} '+'>Columnas</option>'+
					'<option value="columnas-stacked"'+' {{if chartType=="columnas-stacked"}}selected{{/if}} '+'>Columnas apiladas</option>'+
					'<option value="horizontalBar"'+' {{if chartType=="horizontalBar"}}selected{{/if}} '+'>Barras horizontales</option>'+
					'<option value="horizontalBar-stacked"'+' {{if chartType=="horizontalBar-stacked"}}selected{{/if}} '+'>Barras horizontales apiladas</option>'+
				'</select>'+
				'<div class="form-group inline" >'+
					'<input type="checkbox" value="true" '+
					' {{if ejeCero && ejeCero!="false"}}checked="checked"{{/if}} '+
					' class="checkbox-label" id="formUI_sortableFormField-serieKey{{:#parent.index}}-ejeCero" name="formUI_sortableFormField-serieKey{{:#parent.index}}-ejeCero"> <label for="formUI_sortableFormField-serieKey{{:#parent.index}}-ejeCero" >Eje cero</label>'+				
				'</div>'+
			'</div>'+
			'{{/if}}'+
			
			'{{if ~root.widgetType == "monitor-cronologico" }}'+
			'<div class="form-group inline">'+
				'<label for="formUI_sortableFormField-serieKey{{:#parent.index}}-PresentarDatoFormula">Mostrar</label>'+
				'<select id="mostrar" class="form-control" NOTrequired '+
					' id="formUI_sortableFormField-serieKey{{:#parent.index}}-PresentarDatoFormula" '+
					' name="formUI_sortableFormField-serieKey{{:#parent.index}}-PresentarDatoFormula" '+
					'>'+
					'{{include tmpl="widgetBuilderFormOptions-datoFormulaOptions"/}}'+
				'</select>'+
			'</div>'+
			'{{/if}}'+
			
		'</div>'+
	'</div>'+
	'{{/for}}'+
//	'<?php }; //for ?>'+

	'</div>'+ // <!-- /sortableFormFieldsGroup -->'+
'</fieldset>'
); // widgetBuilderFormOptions-fieldset-series











