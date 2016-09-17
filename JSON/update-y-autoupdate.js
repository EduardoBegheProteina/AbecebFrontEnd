{
	"abecebObjectId": "cpRootWitgets0_ObjectId",
	"abecebPersistenceId": "cpRootWitgets0_ObjectId",
	"type": "cpContainer",
	"gridWidth": "12",
	"mode": "edit",

	"type2": "cpRoot",
	"cpTitle": "Hoja de trabajo con updates",
	

	
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
	"mode": "edit",
	"abecebObjectId": "001_ObjectId",
	"abecebObjectInstanceId": "001_ObjectInstanceId",
	"cpTitle": "HAS UPDATE",
	"type": "cpWidget",
	"type1": "grafico",
	"type2": "//unused by front",
	"calculationType": "//unused by front",
	"gridWidth": "4",
	"territorios": [ "BR", "CL" ],
	"widgetType": "grafico-partentotales",
	"downloadHref": "test.xls?id=partEnTotales1",
	
		"autoUpdate": true,
	
	"dataShown": {
		"usrctnt1": "Este comentario no cambia, no se hara merge.",
		"usrctnt2": "Hay un comentario nuevo en dataUpdated, se hara merge con este.",

		"graphdata": {
			"labels": ["Serie 1", "Serie 2", "Serie 3", "Serie 4", "Serie 5", "Serie 6"],
			"datasets": [{
				"type": "pie",
				"data": [1770, 1597, 1260, 1748, 1552, 1541]
			}]
		},
		"cpTitle": "Item con Autoupdate. Nunca puede tener dataUpdated.",
		"date": "1430000000000",
		"author": "Equipo ABECEB",
		"tags": [],
		"tabledata": [
			["Fecha", "1/1/2016", "2/1/2016", "3/1/2016", "4/1/2016"],
			["Serie 1", 1498, 1625, 1702, 1255],
			["Serie 2", 1259, 1434, 1202, 1657]
		],
		"metadata": {
			"nombre": "Nombre1"
		}
	}
	
}

, 
{
	"abecebObjectId": "002_ObjectId",
	"abecebObjectInstanceId": "002_ObjectInstanceId",
	"cpTitle": "other",
	"type": "cpWidget",
	"type1": "grafico",
	"type2": "",
	"mode": "edit",
	"calculationType": "",
	"gridWidth": "4",
	"territorios": ["AR"],
	"widgetType": "grafico-partentotales",
	"dataShown": {
		"graphdata": {
			"labels": ["1/1/2016", "2/1/2016"],
			"datasets": [{
				"type": "horizontalBar-stacked",
				"label": "Serie 1",
				"data": [1, 2]
			}, {
				"type": "horizontalBar-stacked",
				"label": "Serie 2",
				"data": [6, 5]
			}]
		},
		"cpTitle": "item SIN autoupdate, con data nueva.",
		"date": "1430000000000",
		"author": "Equipo ABECEB",
		"tags": [],
		"tabledata": [
			["Fecha", "1/1/2016", "2/1/2016", "3/1/2016", "4/1/2016"],
			["Serie 1", 1184, 1587, 1471, 1354],
			["Serie 2", 1853, 1715, 1654, 1061]
		],
		"metadata": {}
	},
	"dataUpdated": {
		"usrctnt1": "Hay un nuevo comentario en dataUpdated.",
		"graphdata": {
			"labels": ["1/1/2016", "2/1/2016"],
			"datasets": [{
				"type": "horizontalBar-stacked",
				"label": "Serie 1",
				"data": [11, 21]
			}, {
				"type": "horizontalBar-stacked",
				"label": "Serie 2",
				"data": [6, 5]
			}]
		},
		"cpTitle": "gr2 datashown",
		"date": "1440000000000",
		"author": "Equipo ABECEB",
		"tags": [],
		"tabledata": [
			["Fecha", "1/1/2016", "2/1/2016", "3/1/2016", "4/1/2016"],
			["Serie 1", 1184, 1587, 1471, 1354],
			["Serie 2", 1853, 1715, 1654, 1061]
		],
		"metadata": {}
	}
	
}

,
{
	"abecebObjectId": "003_ObjectId",
	"abecebObjectInstanceId": "003_ObjectInstanceId",
	"cpTitle": "other",
	"type": "cpWidget",
	"type1": "grafico",
	"type2": "",
	"mode": "edit",
	"calculationType": "",
	"gridWidth": "4",
	"territorios": ["AR"],
	"widgetType": "grafico-partentotales",
	"dataShown": {
		"usrctnt1": "Hay un nuevo comentario en dataUpdated.",
		"graphdata": {
			"labels": ["1/1/2016", "2/1/2016"],
			"datasets": [{
				"type": "horizontalBar-stacked",
				"label": "Serie 1",
				"data": [11, 21]
			}, {
				"type": "horizontalBar-stacked",
				"label": "Serie 2",
				"data": [6, 5]
			}]
		},
		"cpTitle": "item sin autoUpdate, ni data nueva",
		"date": "1440000000000",
		"author": "Equipo ABECEB",
		"tags": [],
		"tabledata": [
			["Fecha", "1/1/2016", "2/1/2016", "3/1/2016", "4/1/2016"],
			["Serie 1", 1184, 1587, 1471, 1354],
			["Serie 2", 1853, 1715, 1654, 1061]
		],
		"metadata": {}
	}
	
}


			]
		}

	]

}