cpDataFormats = {
	default: function(dato,vars,loc){
		return "$ " + dato;
	},
	number:  function(dato,vars,loc){
		return round(dato, 2) // round a 2 decimales
	},
	number_en: function(dato,vars){
		//ejemplo para localizacion
		return "ENG " + round(dato, 3); // 
	},
	currency: function(dato,vars,loc){
		return "$ " + dato;
	}
}

function round(value, decimals){
	//http://stackoverflow.com/questions/6134039/format-number-to-always-show-2-decimal-places
		//decimales> .toFixed(2)
		//avoid JS rounding errors> use exponential notation
    return Number(Math.round(value +'e'+ decimals) +'e-'+ decimals).toFixed(decimals);
}

function cpDataFormat(dato,format,vars,loc){
//dato> required
//format> default null
	format = format || false;
//vars> default {}
	vars = vars || {};
//loc> default ""
	loc = loc || "";
	
	if( cpDataFormats[format +"_"+loc] ){
		return cpDataFormats[format +"_"+loc](dato,vars);
	}else if( cpDataFormats[format] ){
		return cpDataFormats[format](dato,vars,loc);
	}else{
		return cpDataFormats["default"];
	}
}


// console.log( cpDataFormat(
// 	Math.PI,
// 	"number"
// 	)  )
// 
// console.log( 'number_en', cpDataFormat(
// 	Math.PI,
// 	"number",
// 	{},
// 	"en"
// 	)  )