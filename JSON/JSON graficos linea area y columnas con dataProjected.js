{
	"abecebObjectId": "ht-1_ObjectId",
	"abecebPersistenceId": "cpRootPersistenceId",
	"type": "cpContainer",
	"gridWidth": "12",
	"mode": "edit",

	"type2": "cpRoot",
	"title": "Hoja de trabajo 1",
	
	"downloadHref": "test.xls?id=cpRoot_ObjectId",
	
	"children": [
		{
			"abecebObjectId": "widgetsContainer1_ObjectId",
			"type": "cpContainer",
			"type1": "widgetsContainer",
			"mode": "edit",
			"gridWidth": "12",
			"children": [
			
			{
"abecebObjectId": "Grafico200ObjectId",
"abecebObjectInstanceId": "Grafico200ObjectInstanceId",

"type": "cpWidget",	
	"type1": "grafico",
	"type2": "unused",
	"calculationType": "//server-side defined",

"gridWidth": "6",

"territorios":["AR","BR","CL","UY"],

"cpTitle": "Grafico 1",

"dataShown":{
	"date":"1456801200000",
	"author": "Equipo ABECEB",
	
	"cpTitle": "Area o Linea con proyecciones. tableData es ejemplo de como declarar celdas con proyecciones, o string vacio si no hay valor para una serie en esa fecha",
	"usrctnt1": "",
	"usrctnt2": "", 

	"graphdata":{
			"labels": ["1/1/2016", "2/1/2016", "3/1/2016", "4/1/2016", "5", "6", "7" ],
			"datasets": [
				{
				"type": "area",
				"label": "Nacionales",
				"data": [ 1, 2, 3, 4 ],
				"dataProjected": [ 5, 6, 7 ]
				},
				
				{
				"type": "line",
				"label": "Importados",
				"data": [ 10, 11,12, 13 ],
				"dataProjected": [ 15, 16, null ]
				}
			]
		},

	"tags": ["Macroeconomia","Argentina"],

	"tabledata":[
		["Fecha","1/1/2016", "2/1/2016", "3/1/2016", "4/1/2016", "5", "6", "7"],
		["Nacionales","1","2","3","4","5|proj=1","6|proj=1","7|proj=1"],
		["Importados",10, 11,12, 13, "15|proj=1", "16|proj=1", "" ]
		],	
	
	"metadata":{
		"nombre": "Ingresos Corrientes -IC- (millones de AR$)",
		"metodoDeAgregacion": "",
		"keywords": "",
		"frecuencia": "Mensual",
		"fuente": "Ministerio de Hacienda y Finanzas Públicas de la República Argentina",
		"lastUpdate": "May 16, 2016 9:53:37 PM",
		"nextUpdate": "Jun 16, 2016 9:53:37 PM",
		"descripcion": "Hace referencia a los ingresos registrados en la Cuenta Corriente. Son los que proienen de los ingresos tributarios incluidos los correspondientes a los regiemntes de coparticipacion municipal."
		}
	} 

}


,

{
"abecebObjectId": "Grafico201ObjectId",
"abecebObjectInstanceId": "Grafico201ObjectInstanceId",

"type": "cpWidget",	
	"type1": "grafico",
	"type2": "horizontalBar",
	"calculationType": "//server-side defined",

"gridWidth": "6",

"territorios":["AR","BR","CL","UY"],

"cpTitle": "Barras horizontales",

"dataShown":{
	"date":"1456801200000",
	"author": "Equipo ABECEB",
	
	"cpTitle": "Columnas con dataProjected. tableData es ejemplo de PROBLEMAS cuando no se declaran celdas vacias",
	"usrctnt1": "",
	"usrctnt2": "", 

	"graphdata":{
			"labels": ["1/1/2016", "2/1/2016", "3/1/2016", "4/1/2016", "5", "6", "7", "8" ],
			"datasets": [
				{
				"type": "bar",
				"label": "Nacionales",
				"data": [ 1, 2, 3, 4 ],
				"dataProjected": [ 5, 6, 7 ]
				},
				{
				"type": "bar",
				"label": "Nacionales",
				"data": [ 10, 11, 12, 13 ]
				}
			]
		},

	"tags": ["Macroeconomia","Argentina"],

	"tabledata":[
		["Fecha","1/1/2016", "2/1/2016", "3/1/2016", "4/1/2016", "5", "6", "7", "8"],
		["Nacionales","1","2","3","4","5|proj=1","6|proj=1","7|proj=1"],
		["Importados",10, 11,12, 13 ]
		],	
	
	"metadata":{
		"nombre": "Ingresos Corrientes -IC- (millones de AR$)",
		"metodoDeAgregacion": "",
		"keywords": "",
		"frecuencia": "Mensual",
		"fuente": "Ministerio de Hacienda y Finanzas Públicas de la República Argentina",
		"lastUpdate": "May 16, 2016 9:53:37 PM",
		"nextUpdate": "Jun 16, 2016 9:53:37 PM",
		"descripcion": "Hace referencia a los ingresos registrados en la Cuenta Corriente. Son los que proienen de los ingresos tributarios incluidos los correspondientes a los regiemntes de coparticipacion municipal."
		}
	} 

}


			]
		}

	]

}


