/*
//Object Copy utility function

//deprecated, use instead:
	// Shallow copy
	var newObject = jQuery.extend({}, oldObject);
	// Deep copy
	var newObject = jQuery.extend(true, {}, oldObject);

//deprecated function:
//function copyObjTo( obj1, obj2 ){
//	for (var key in obj1) { obj2[key] = obj1[key]; }
//	}
*/
	

(function ( $ ) {
 
 	//cpObject() : init DOM element as cpObject
	 	//usage: 
	 	// cpObject( ) 
	 	// cpObject( {key1:value1, key2:value2} ) // inject cpData
	 	
	$.fn.cpObject = function( opt ) {
		this.each(function(){
			$(this).addClass( 'cpObject' );
			
			var html5cpdata = $( this ).data( "cpdata" ) ;
			if( html5cpdata ){
				//copy html5 data-cpdata attribute to DOMobject.cpdata
				$(this)[0].cpData = html5cpdata;
				$( this ).removeAttr("data-" + "cpdata");

			}else{
				//si se pas� cpData como objeto, lo preservamos.
				if(!$(this)[0]["cpData"] ){
					$(this)[0].cpData = { };
				}
			}//end if html5cpdata
							
			if( opt && typeof(opt)=="object" ){
				// Deep copy
				// copyObjTo( opt, $(this)[0].cpData );
				//$(this)[0].cpData = jQuery.extend(true, {}, opt );
				jQuery.extend(true, $(this)[0].cpData, opt );
				}
			//mode
		});
		return this;
	};



	//cpGetData()
		//usage: 
		//  cpGetData() gets hierarchical data
		//  cpGetData( nodename ) gets that nodename
	
	$.fn.cpGetData = function( nodo ){
	
		if($(this)[0] && $(this)[0].cpData ){
			if( nodo ){
				if( $(this)[0].cpData[nodo] ){
					return $(this)[0].cpData[nodo]
					}else{
					// console.log ( '$.fn.cpGetData: no existe el atributo:', nodo );
					return false;
					}
			}else{ //no nodename requested
				//recursively build cpData
				var result = ( $(this)[0].cpData );
				
				var children = $(this).children('.cpObject');
				
				if( children.length ){
					result.children = [];
					
					$.each( children, function( index, value ) {
						result.children.push( $(value).cpGetData() );
					});
					
				}
			
				return result;
			}

		} else{ //no cpData
			console.log ( '$.fn.cpGetData: objeto no tiene cpData', this);
			return false;
		}//end if cpData
	};
	

	
	$.fn.cpSetData = function( data ){
		if (!$(this)[0].cpData){
			console.log ( '$.fn.cpSetData: objeto no tiene cpData. Se ha creado cpData nueva.', this);
			$(this)[0].cpData = {};
			};

		// Deep copy
		// copyObjTo( data, $(this)[0].cpData );
		jQuery.extend(true, $(this)[0].cpData, data);		
	}
	






	$.fn.cpGetAncestor = function( ){
		var result = $( this ).parents('.cpObject').last();
		return result;
	};

	$.fn.cpGetDataRoot = function( ){
		var result = $( this ).parents('.cpObject').last();
		if( result.length == 1){
			return result;
			}else{
			return this;
			}
	};	


	$.fn.cpGetPersistenceId = function(){
		var ancestor = $(this).cpGetAncestor();
		var result = $( ancestor ).cpGetData("abecebPersistenceId");
		if(result){ 
			return result; 
		}else{
			console.log ( '$.fn.cpGetPersistenceId: ancestor no tiene abecebPersistenceId' );
			return false;
		}
	};


	$.fn.cpGetComponentId = function(){
	
		var result = $(this).cpGetData("abecebComponentId");
		if(result){ 
			return result; 
		}else{
			console.log ( '$.fn.cpGetComponentId: no tengo componentId' );
			return false;
		}
	};


	$.fn.cpGetInstanceId = function(){
	
		var result = $(this).cpGetData("abecebInstanceId");
		if(result){ 
			return result; 
		}else{
			console.log ( '$.fn.cpGetComponentId: no tengo componentId' );
			return false;
		}
	};
	


//TBD: Callbacks
	

	
	$.fn.cpObject.test = function(){
		alert( 'test' );
	};
	
	
 
}( jQuery ));

