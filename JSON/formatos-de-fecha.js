{
	"abecebObjectId": "cpRootWitgets0_ObjectId",
	"abecebPersistenceId": "cpRootWitgets0_ObjectId",
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
			"abecebObjectId": "horizontalBar2seriesObjectInstanceId",
			"abecebObjectInstanceId": "horizontalBar2seriesObjectInstanceId",
			"type": "cpWidget",
			"type1": "grafico",
			"type2": "//unused by front",
			"cpTitle": "//no usado al mostrar item en la pagina, se usa el de dataShown",
			"calculationType": "//unused by front",
			"gridWidth": "6",
			"territorios": ["AR", "BR", "CL", "UY"],
			"widgetType": "grafico-cronologico",
			"dataShown": {
				"graphdata": {
					"labels": ["1/1/2016|f=trimestral", "2/1/2016|f=mensual", "3/1/2016|f=semanal", "4/1/2016|f=quincenal","5/1/2016|f=semestral", "6/1/2016","7/1/2016","8/1/2016"],
					
					"labelsDataFormat" : "trimestral",
					
					"datasets": [{
						"type": "bar",
						"label": "area",
						"data": [1095, 1126, 1871, 1843, 2111, 1871, 1843, 2111]
					}, {
						"type": "bar",
						"label": "area",
						"data": [1578, 1593, 1456, 1123, 1578, 1456, 1123, 1578]
					}]
				},
				"cpTitle": "Test formatos de fecha: Graficos + Tabla",
				"date": "1.470473194E+12",
				"author": "Equipo ABECEB",
				"usrctnt1": "",
				"usrctnt2": "",
				"tags": ["Macroeconomia", "Argentina"],
				"tabledata": [
					["Fecha", "1/1/2016|f=trimestral", "2/1/2016|f=mensual", "3/1/2016|f=semanal", "4/1/2016|f=quincenal","5/1/2016|f=semestral"],
					["Serie 1", 1077, 1558, 1302, 1986, 2111],
					["Serie 2", 1012, 1936, 1796, 1019, 1578]
				]
			}
		}
		
,

{
"abecebObjectId": "Tabla40ObjectId",
"abecebObjectInstanceId": "Tabla40ObjectInstanceId",

"type": "cpWidget",	
	"type1": "tabla",
	"type2": "//unused",
	"calculationType": "//server-side defined",

"gridWidth": "6",

"territorios":["AR","BR","CL","UY"],

"cpTitle": "//no usado al mostrar item en la pagina, se usa el de dataShown",

"dataShown":{
	"date":"1456801200000",
	"author": "Equipo ABECEB",
	
	"cpTitle": "Test formatos de fecha: Tabla",
	"usrctnt1": "",
	"usrctnt2": "", 

	"tags": ["Macroeconomia","Argentina"],

"tabledata": [
					["Fecha", "1/1/2016|f=trimestral", "2/1/2016|f=mensual", "3/1/2016|f=semanal", "4/1/2016|f=quincenal","5/1/2016|f=semestral"],
					["Serie 1", 1077, 1558, 1302, 1986, 2111],
					["Serie 2", 1012, 1936, 1796, 1019, 1578]
				],
				
	
	"metadata":{
		"nombre": "Ingresos Corrientes -IC- (millones de AR$)",
		"metodoDeAgregacion": "",
		"keywords": "",
		"frecuencia": "Mensual",
		"fuente": "Ministerio de Hacienda y Finanzas Pœblicas de la Repœblica Argentina",
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