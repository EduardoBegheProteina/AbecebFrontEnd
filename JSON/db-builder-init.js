$(function() { // Handler for .ready() called.

	loadJSONcpObject( $('#sortableHtPages'), 'htList.js.php', 'replace' );


	var data1 = {
	
//	"display": "builderPage", //default

	
	"widgetType" : //tipo de widget, el form se abre en esta "pestaña".
		//	"monitor-cronologico", //default
		//	"monitor-variaciones",
			"indicador",
		//	"grafico-cronologico",
		//	"grafico-partentotales",
		// 	"grafico-partcronologico",
	
	
	"dbTreeHREF": "?main=tree", //HREF del link 'volver al listado' (URL de pagina del arbol)
	
	"dbDatoFormulaOptions": //array de text/values para opciones de formulas aplicables a datos de Series
		[ 
{
"text": "Variación entre periodos",
"value": "LastPeriodVariation"
},{
"text": "Variación respecto del dato anterior",
"value": "PastValueVariation"
},{
"text": "Variación acumulada",
"value": "AccumulatedVariation"
},{
"text": "Variación respecto de un punto en el tiempo",
"value": "MomentInTimeVariation"
},{
"text": "Promedio entre fechas",
"value": "BetweenDatesAverage"
},{
"text": "Variación de dos promedios entre fechas",
"value": "BetweenDatesAveragesVariation"
},{
"text": "Promedio móvil de N datos",
"value": "RangedMovingAverage"
},{
"text": "Variacion de dos promedios móviles de n datos",
"value": "RangedMovingAveragesVariation"
},{
"text": "Suma entre fechas",
"value": "BetweenDatesSum"
},{
"text": "Último dato de la serie",
"value": "LastValue"
},{
"text": "Variación interanual",
"value": "InterannualVariation"
}
		],

	"dbVariacionFormulaOptions": //array de text/values para opciones de formula de variacion de indicadores
		[ 
{
"text": "Variación entre periodos",
"value": "LastPeriodVariation"
},{
"text": "Variación respecto del dato anterior",
"value": "PastValueVariation"
},{
"text": "Variación acumulada",
"value": "AccumulatedVariation"
},{
"text": "Variación respecto de un punto en el tiempo",
"value": "MomentInTimeVariation"
},{
"text": "Promedio entre fechas",
"value": "BetweenDatesAverage"
},{
"text": "Variación de dos promedios entre fechas",
"value": "BetweenDatesAveragesVariation"
},{
"text": "Promedio móvil de N datos",
"value": "RangedMovingAverage"
},{
"text": "Variacion de dos promedios móviles de n datos",
"value": "RangedMovingAveragesVariation"
},{
"text": "Suma entre fechas",
"value": "BetweenDatesSum"
},{
"text": "Último dato de la serie",
"value": "LastValue"
},{
"text": "Variación interanual",
"value": "InterannualVariation"
}
		],


	"variacionFormula": "LastValue", //formular a usar en indicador
	
	"widgetPresentarVariacion":"true", //indicador variaciones
	
	 //series es un array. La interfaz esperará el mismo array entregado por el servidor para construir las opciones.
	"series": [{ 
		"id": "serieID-0",  //ID de la serie, entregado en el JSON que recibió la interfaz
		"dbName": "Nombre de la serie 0", //Nombre en la serie de datos para la serie que se mostró en el árbol al seleccionarla, ej "Argentina: inflación 1992-2016"
		"dbDatoAlegend": "1 feb 2001 (N periodos en el pasado)",  //dato del JSON entegado a la interfaz
		"dbDatoZlegend": "1 feb 2099 (N periodos en el futuro)"  //dato del JSON entegado a la interfaz
		// "userLabel": "", // opción del usuario: con qué nombre presentar esta serie en el widget

		// "presentarDatoFormula": "dato", // opción del usuario: fórmula a aplicar, cuando corresponda a la serie y no al widget
		// "ejeCero": "true" //opcion del usuario: incluir cero en el grafico
	}, {
		"id": "serieID-1",
		"dbName": "Nombre de la serie 1",
		"dbDatoAlegend": "1 feb 2001 (N periodos en el pasado)"
		// "userLabel": "",
		// "presentarDatoFormula": "dato"
	}

	]




}



	widgetBuilderForm( $('#cpRoot'), data1 );
	

});