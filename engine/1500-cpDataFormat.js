numeral.language('es');
//numeral.js toma argumentos en formato US ( punto decimal )
//y el locale lo traduce a (coma decimal)

cpDataFormats = {


	defaultValue: function(dato,vars,loc){
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


}




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
		return cpDataFormats["defaultValue"](dato,vars);
	}

}


