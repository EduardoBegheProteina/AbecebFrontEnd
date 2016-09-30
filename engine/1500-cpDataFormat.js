moment.locale('es');
numeral.language('es');
//numeral.js toma argumentos en formato US ( punto decimal )
//y el locale lo traduce a (coma decimal)

cpDataFormats = {

	////// Numeros ////// 

	defaultFormat: function(dato,vars,loc){
		//formato no especificado o invalido. Default: separador de miles, dos decimales
		return numeral(dato).format('0,000.00');
	},

	indice: function(dato,vars,loc){
		return numeral(dato).format('0,000.00');
	},
	
	monedaUnDecimal: function(dato,vars,loc){
		return numeral(dato).format('0,000.0');
	},
	
	monedaDosDecimales: function(dato,vars,loc){
		return numeral(dato).format('0,000.0');
	},
	
	porcentaje: function(dato,vars,loc){
		return numeral(dato).format('0.0%');
	},

	percent: function(dato,vars,loc){
		return numeral(dato/100).format('0.0%');
	},

	
	unidades: function(dato,vars,loc){
		return numeral(dato).format('0,000');
	},
	
	unidadesUnDecimal: function(dato,vars,loc){
		return numeral(dato).format('0,000.0');
	},
	
	
	////// Fechas ////// 

	defaultMomentFormat: function (dato,vars,loc){
		return moment (dato);
	},
	
	trimestral:  function (dato,vars,loc){
		return moment(dato, "D/M/Y").format("Q[T]YYYY");
	},

	mensual:  function (dato,vars,loc){
		return moment(dato, "D/M/Y").format("MMM YY");
	},


	semanal:  function (dato,vars,loc){
//	function semanal(dato){
//		return moment(dato, "D/M/Y").format("w[S] MMM YY");

		var mesYearDelDato = moment(dato, "D/M/Y").format("MMM YYYY");
		var semanaDelDato = moment(dato, "D/M/Y").format("w");

		if(	moment(dato, "D/M/Y").format("M") == "1"
			&&
			semanaDelDato>=52
			){semanaDelDato=1;}

		var semana1delMes = moment( 
			("1/" + ( moment(dato, "D/M/Y").format("M/YY") ) ), "D/M/Y"
			).format("W");

		if(semana1delMes>=52){semana1delMes=1;}
		
		var semanaDelDatoMes = semanaDelDato-semana1delMes + 1
		
		return ( semanaDelDatoMes + "S " + mesYearDelDato );
	}
	,


	quincenal:  function (dato,vars,loc){
		var mesYearDelDato = moment(dato, "D/M/Y").format("MMM YYYY");
		var diaDelDato = Number ( moment(dato, "D/M/Y").format("D") );
		
		var quincenaDelDatoMes = diaDelDato < 16 ? 1 : 2 ;
		
		return ( quincenaDelDatoMes + "Q " + mesYearDelDato );
	}
	
	,
	
	
	quincenacronologica:  function (dato,vars,loc){

		var mesYearDelDato = moment(dato, "D/M/Y").format("MMM YYYY");
		var semanaDelDato = moment(dato, "D/M/Y").format("w");

		if(	moment(dato, "D/M/Y").format("M") == "1"
			&&
			semanaDelDato>=52
			){semanaDelDato=1;}

		var semana1delMes = moment( 
			("1/" + ( moment(dato, "D/M/Y").format("M/YY") ) ), "D/M/Y"
			).format("W");

		if(semana1delMes>=52){semana1delMes=1;}
		
		var semanaDelDatoMes = semanaDelDato-semana1delMes + 1
		
		var quincenaDelDatoMes = 
			Math.max( 1,
				Math.min ( 2,
					Math.ceil( semanaDelDatoMes/2 )
					)
				)
		
		return ( quincenaDelDatoMes + "Q " + mesYearDelDato );
	}
	,


	semestral:  function (dato,vars,loc){
// 	function semestral(dato){

		var momentDelDato = moment(dato, "D/M/Y");
		var yearDelDato = moment(dato, "D/M/Y").format("YYYY");
		var finSemestre1 = moment("30/6/"+ yearDelDato, "D/M/Y");
		
		var elSemestre = 1;
		if( moment( momentDelDato ).isAfter(  finSemestre1 ) ){
			elSemestre = 2;
			}
		
		return ( elSemestre + "S " + yearDelDato );

	}
	,
	

	diario:  function (dato,vars,loc){
		return moment(dato, "D/M/Y").format("D/M/YY");
	},	

	anual:  function (dato,vars,loc){
		return moment(dato, "D/M/Y").format("YYYY");
	},
	
	verbose: function (dato,vars,loc){
		return moment(dato, "D/M/Y").format("ddd D/MMM/YYYY");
	},
	
	
}








function parseString2vObj( value ){
/*
	in  => "1.234|a=1&b=2"
	out => vObj: {
		value: "1.234",
		dato: "1.234",
		a: 1,
		b: 2
		}
*/
	var value = String(value).split("|");
	if(value.length==2){
		var vObj = parseQueryString( value[1] );
		}else{
		var vObj = {};
		}
	vObj.dato = vObj.value = vObj.datoHtml = vObj.datoFormateado = value[0];
	
	
	var formato = false; //cpDataFormat aplicara formato por default
	//se especifico formato por variable?
	if( vObj.cpDataFormat ){
			formato = vObj.cpDataFormat;
		}else if( vObj.cpNumberFormat ){
			formato = vObj.cpDataFormat = vObj.cpNumberFormat;
		}else if( vObj.f ){ 
			formato = vObj.cpDataFormat = vObj.f;
		}

		
	if( formato //se especifico formato por variable
		|| $.isNumeric( vObj.dato ) //o aplicamos formato por default a numeros
		){
		vObj.datoFormateado = vObj.datoHtml = cpDataFormat( vObj.dato, formato );
	}
	
	if( vObj.um1 ){ vObj.datoHtml = vObj.um1 + vObj.datoHtml };
	if( vObj.um2 ){ vObj.datoHtml += vObj.um2 };
	
	return vObj;
	
} // end parseString2vObj






function cpDataFormat(dato,format,vars,loc){
//dato> required
//format> default null
	format = format || false;
	
//vars> default {}
	vars = vars || {};
	
//loc> default ""
	loc = loc || "";
	

//parsear segun format solicitado; si no existe, se aplica default
	if( cpDataFormats[format +"_"+loc] ){
		return cpDataFormats[format +"_"+loc](dato,vars);
	}else if( cpDataFormats[format] ){
		return cpDataFormats[format](dato,vars,loc);
	}else{
		return cpDataFormats["defaultFormat"](dato,vars);
	}

} //end cpDataFormat






function tryToLocalizeTimestamp( d, format ){
	//returns localized format OR original string if cannot parse

	//1. Try to parse date
	if( !($.isNumeric( d )) ){ //d is String and cannot be parsed to number
			
		return d; // last resort		

	}else{ //d is Numeric
		d = Number(d);
		if(d<631159200000){ return d; } //unix timestamp para "enero 1º 1990, 12:00:00 am"

	}//end Try to parse date
	
	
	//2. If date was parsed, apply format and return
	return moment (d).format(format);

}//end tryToLocalizeTimestamp

