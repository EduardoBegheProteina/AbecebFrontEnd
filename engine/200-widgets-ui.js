///////////// compassGlobalUI /////////////

compassGlobalUI = {
	selectedWidget:null,
	clipboardContent:null,
	undoQueue:[],
	pageWidgetsCount:0,
	htMenuTempOpened: false,
	untitledCount: 0,
	b: {b1:11, b2: 99}
	};
	
	
compassGlobalUI.setContentHeight = function () {
	// reset height
	$RIGHT_COL.css('min-height', $(window).height());

	var bodyHeight = $BODY.height(),
		leftColHeight = $LEFT_COL.eq(1).height() + $SIDEBAR_FOOTER.height(),
		contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;

	// normalize content
	contentHeight -= $NAV_MENU.height() + $FOOTER.height();

	$RIGHT_COL.css('min-height', contentHeight);

	$(".pinned").pin();
};



compassGlobalUI.update = function (){
	/*
	$('#topToolbar .toolbarIcon').addClass('disabled');
	$('#topToolbar .toolbarIcon-crearTexto').removeClass('disabled');
	compassGlobalUI.pageWidgetsCount = $("#htContent .contentWidget").length;
	if (compassGlobalUI.pageWidgetsCount > 0 ){
		$('#topToolbar .toolbarIcon-compartir').removeClass('disabled');
		$('#topToolbar .toolbarIcon-exportar').removeClass('disabled');
		}
	if( compassGlobalUI.selectedWidget ){
		$('#topToolbar .toolbarIcon-copiar').removeClass('disabled');
		$('#topToolbar .toolbarIcon-cortar').removeClass('disabled');
		}
	if( compassGlobalUI.clipboardContent ){
		$('#topToolbar .toolbarIcon-pegar').removeClass('disabled');
		}
	*/
} //end compassGlobalUI.update()


compassGlobalUI.newHTmenuItem = function ( nombre, htmlToAppend ){

	if(!nombre){
		compassGlobalUI.untitledCount++;
//		nombre = 'Sin t&iacute;tulo ' + compassGlobalUI.untitledCount;
		nombre = 'Sin título ' + '(' + moment().format('D MMM YYYY, H:mm:ss') + ')' ; 
	}
	$('#sortableHtPages').attr("newTitleHolder",nombre);
	
	var abecebObjectId = 'htli-'+getUagTimestampID();
	
	var newItem = $('<li id="'+ abecebObjectId +'">'+
		'<span class="dropdown pull-right"> <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i class="fa fa-caret-down"></i></a><ul class="dropdown-menu" role="menu"><li><a href="#" class="sidebar-menu-item" data-action="rename"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Cambiar nombre…</a></li><li role="separator" class="divider"></li><li class="disabled"><a href="#" class="sidebar-menu-item" data-action="export"><i class="fa fa-download" aria-hidden="true"></i> Exportar</a></li><li role="separator" class="divider"></li><li><a href="#" class="sidebar-menu-item" data-action="delete"><i class="fa fa-trash-o" aria-hidden="true"></i> Eliminar…</a></li></ul></span>'+
		'<a href="?ht='+abecebObjectId+'"><i class="fa fa-folder-o" aria-hidden="true"></i> <span class="var-title">'+nombre+'</span></a></li>' );
	$( "#sortableHtPages" ).prepend( newItem );
	
	$( newItem ).cpObject(
		{ "abecebObjectId": abecebObjectId,
		"type": "ht",
		"title": nombre,
		"mode": "edit",
		"children": []
		 }
		);


	initHTdroppables();
		
	if( htmlToAppend ){
		$( newItem ).append( htmlToAppend );
		}


	
	return newItem;
	
	}//end compassGlobalUI.newHTmenuItem




compassGlobalUI.htMenuItemAcceptWidget = function( what, event, ui ){
// event
// ui
// 	draggable
// 	helper
// 	position
// 	offset
	
	var whatID = $( what ).attr('id');

	//no aceptamos drop sobre area en blanco de sidebar:
	if( whatID == 'htMenuItemLI'){
		return false;
		}

	//si hasta ahora no hicimos return false,
	//empezamos a identificar los objetos con los que estamos trabajando

	//identificamos el widget que se droppeo
	var contextWidget = getContextWidget( ui.draggable )
	//obtenemos cpData del widget
	var contextWidgetCpData = ( $(contextWidget).cpGetData() );


	//identificamos target del droppable
	if( whatID == 'htMenuLIcreateNewHT' ){	
		//droppable: boton Nueva HT.
		//widgetTarget: HT que contiene el dropped widget.	
		var widgetTarget = compassGlobalUI.newHTmenuItem ( false );
	}else{
	//cualquier otro LI es una HT
	//caso: agregar a HT
		//widgetTarget: HT seleccionada, que contendra el dropped widget.
		var widgetTarget = what;
	}


	//inicializamos niveles (what).cpData.children, (what).cpData.newChildren en caso necesario
	if( ! $( widgetTarget )[0].cpData ){ $( widgetTarget )[0].cpData = {}; }
	if( ! $( widgetTarget )[0].cpData.children ){ $( widgetTarget )[0].cpData.children = []; }
	if( ! $( widgetTarget )[0].cpData.newChildren ){ $( widgetTarget )[0].cpData.newChildren = []; }


	//nos fijamos si el widget ya fue aceptado por el objeto previamente:
	//si su abecebObjectInstanceId ya está en un objeto de children o newChildren, la HT ya lo contiene.
	var contextWidgetAlreadyInTarget = false;
	var contextWidgetInstanceId = contextWidgetCpData.abecebObjectInstanceId;
	for (var child in $( widgetTarget )[0].cpData.children ){
		if( $( widgetTarget )[0].cpData.children[child]["abecebObjectInstanceId"] &&
			$( widgetTarget )[0].cpData.children[child]["abecebObjectInstanceId"] == contextWidgetInstanceId ){
				contextWidgetAlreadyInTarget = true;
				}
		}
	for (var child in $( widgetTarget )[0].cpData.newChildren ){
		if( $( widgetTarget )[0].cpData.newChildren[child]["abecebObjectInstanceId"] &&
		$( widgetTarget )[0].cpData.newChildren[child]["abecebObjectInstanceId"] == contextWidgetInstanceId ){ 
			contextWidgetAlreadyInTarget = true;
			}
		}
	//Verifico que no sea un workspace de rol
	if($(widgetTarget)[0].cpData.fromRole){
		contextWidgetAlreadyInTarget = true;
	}
	//si el widget había sido aceptado previamente, lo rechazamos.
	//animacion de rechazo:
	if( contextWidgetAlreadyInTarget ){
		$(widgetTarget).addClass( "droppableAlreadyReceivedHighlight").delay(2001).queue(function(){
			$(this).removeClass("droppableAlreadyReceivedHighlight").dequeue();
		});
		//…y abortamos la funcion:
		return false;
	}


	//si hasta ahora no hicimos return false,
	//tenemos luz verde para procesar el droppable

	//animamos mostrando que se creo una nueva HT con el widget
	$(widgetTarget).addClass( "droppableReceivedHighlight").delay(2001).queue(function(){
		$(this).removeClass("droppableReceivedHighlight").dequeue();
	});
	
	//actualizamos $(widgetTarget)[cpData].newChildren
	$(widgetTarget)[0].cpData.newChildren.push ( contextWidgetCpData );


	//persistimos sortableHtPages
	$('#sortableHtPages').cpPersist(events.sidebarAddWidget);


	//actualizamos menu "guardar widget en HT"
	widgetSaveToHTidUpdate();

	}//end compassGlobalUI.htMenuItemAcceptWidget


//compassGlobalUI.
getContextWidget = function ( fromChildItem ){
	return $( fromChildItem ).closest('.contentWidget');
	}
	
	
	
///////////// end compassGlobalUI /////////////

//utility

function collision($div1, $div2) {
  var x1 = $div1.offset().left;
  var y1 = $div1.offset().top;
  var h1 = $div1.outerHeight(true);
  var w1 = $div1.outerWidth(true);
  var b1 = y1 + h1;
  var r1 = x1 + w1;
  var x2 = $div2.offset().left;
  var y2 = $div2.offset().top;
  var h2 = $div2.outerHeight(true);
  var w2 = $div2.outerWidth(true);
  var b2 = y2 + h2;
  var r2 = x2 + w2;

  if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
  return true;
}


function getWidgetDraggableHelper( ui ){
		var contextWidget = getContextWidget( ui.context );
		
		var cpTitle = $(contextWidget).cpGetData('cpTitle');
		if(!cpTitle || cpTitle=="" ){
			cpTitle = $( contextWidget )[0].cpData['dataShown']['cpTitle'];
			}
			
		return $( "<div class='contentWidget-helper'>"+ cpTitle +"</div>" );
	}


function initDraggableWidgets( container ){
	
	$( container ).find( ".widgetsContainer-sortable" ).sortable({
		items: ".contentWidget",
		placeholder: "contentWidgetDropPlaceholder",
		forcePlaceholderSize: true ,
		opacity: .9,
		helper: function( event, ui ) {
			return getWidgetDraggableHelper( ui );
		  },
		cursor: "default",
		cursorAt: { left: 5, top: 38 },
		distance: 10,
		containment: 'DIV.container.body',
		
		
		start: function( event, ui ) {
			ui.placeholder.height( ui.item.innerHeight()-24 );
			ui.placeholder.width( ui.item.innerWidth()-21 );
			},
		over: function( event, ui ) {
			$( this ).addClass('droppingInside')
				.removeClass('droppingOutside');
			},
		out: function( event, ui ) {
			$( this ).removeClass('droppingInside')
				.addClass('droppingOutside');
			},
		beforeStop: function( event, ui ) {
			// track if element was dragged inside container or not
			this.wasDroppedInsideContainer = ( collision( $(ui.helper), $( this ) ) );
			},
		stop: function( event, ui ) {
			$( this ).removeClass('droppingInside')
				.removeClass('droppingOutside');

			//feedback animation for dropped item
			$( ui.item ).addClass( "droppableDropped").delay(2001).queue(function(){
				$(this).removeClass("droppableDropped").dequeue();
				});	


			//if the helper was moved outside container, reset
			if ( !(this.wasDroppedInsideContainer)){ //this.wasDraggedToHTsidebar ){
				$( this ).sortable( "cancel" ); //reset positions
				//feedback animation:
				$( ui.item ).addClass( "droppableReturned").delay(2001).queue(function(){
					$(this).removeClass("droppableReturned").dequeue();
					});			
				}//end helper was moved outside container

			//if dragged element is off-screen, focus
			if ( !($( ui.item ).isOnScreen()) ){
				//scroll to reveal item //177: top nav + top toolbar height
				$('html, body').animate({ scrollTop: Math.max( 0, $( ui.item ).offset().top -177 ) }, 500); //focus rejected element
				
				}

			
			},
		update: function( event, ui ) {
			if ( this.wasDroppedInsideContainer ){
				//persistimos contenedor si el widget fue droppeado adentro y cambio su DOM (i.e., el orden de los elementos)
				$( this ).cpPersist( events.widgetSort );
				}
			}
	}) .disableSelection();


	$( container ).find( ".widgetsContainer-draggable>.contentWidget" ).draggable({
		opacity: .9,
		helper: function( event ) {
			return getWidgetDraggableHelper( $(this) );
		  },
		cursor: "default",
		cursorAt: { left: 5, top: 30 },
		distance: 10,
		containment: 'DIV.container.body',
		revert: "invalid",
		revertDuration: 250,

		start: function( event ) {
			var ui = $(this);
			},
		stop: function( event ) {
			var ui = $(this);
			}


	})
	
	
	
		
}







function initHTdroppables( target ){
$( "#htMenuItemLI,#htMenuItemLI>UL>LI,#sortableHtPages>LI" ).droppable({
	accept: ".contentWidget",
	activeClass: "droppableActiveClass",
	hoverClass: "droppableHoverClass",
	greedy: true,
	tolerance: "pointer",
	drop: function( event, ui ) {
		compassGlobalUI.htMenuItemAcceptWidget(this, event, ui);
		
	}
});
}






function addNewTextWidget(){
	
	var container = $('#topToolbar');
	var beforeOrAfter = 'after';
	
	var data = {
		"abecebObjectId": "newTextWidget" + getUagTimestampID() + "-ObjectId",
		"abecebObjectInstanceId": "newTextWidget" + getUagTimestampID() + "-ObjectInstanceId",
		
		"type": "cpWidget",	
			"type1": "cphtml",
			"type2": "unused",
			"mode": "edit",
			
			
		"gridWidth": "12",
		
		"territorios":[],
		"cpTitle": "",
		
		"dataShown":{
			"date":"",
			"author": "",
			
			"cpTitle": "",
			"usrctnt1": "",
			"usrctnt2": "", 
			
			"cpHtml": ""
			
			}
		}
		

var $newCpObject = renderNewCpWidget( $( container ), data, beforeOrAfter );
$($newCpObject).cpObject( data );
initContextMenu( 'addNewTextWidget' );

showEditContentDialog( $newCpObject );

}




$(function() { // Handler for .ready() called.






$( "#sortableHtPages" ).sortable({
	placeholder: "child_menuDropPlaceholder",
	update: function( event, ui ) {
		//persistimos contenedor si cambio su DOM (i.e., el orden de los elementos)
		$( this ).cpPersist(events.sidebarSort);
		}
}).disableSelection();







initHTdroppables();











$('#htMenuLIcreateNewHT>BUTTON').click(function(event) { 
compassGlobalUI.untitledCount++;

// nombre = 'Sin título ' + compassGlobalUI.untitledCount;
nombre = 'Sin título ' + '(' + moment().format('D MMMM YYYY, H:mm:ss') + ')' ; 
	bootbox.prompt({
	  title: "Nombre de la nueva Hoja de Trabajo:",
	  value: nombre,
	  callback: function(result) {
		if (result === null || result == "") {
			compassGlobalUI.untitledCount--;
		} else {
			//creamos la nueva HT
		  compassGlobalUI.newHTmenuItem( result );

			//actualizamos menu "guardar widget en HT", si existe
			widgetSaveToHTidUpdate();

		  	//persistimos sortableHtPages
			$('#sortableHtPages').cpPersist(events.sidebarNewWS);
			
		  
		}
	  }
	});



	}); //end htMenuLIcreateNewHT.click




//update badges


$(document).on('click', '.updatedBadge:not(.updatedBadgeStatus-applied,.updatedBadgeStatus-old)', function() {

	var clickedObj = this;
		//prepare #modal-widget-update

		//obtenemos widget data	
		var contextWidget = getContextWidget( clickedObj );

		var cpData = $( contextWidget )[0].cpData;
						
		//preprocesamos data
		var data1 = jQuery.extend(true, {}, cpData); //deep clone
		var data2 = jQuery.extend(true, {}, cpData); //deep clone

			data1.gridWidth = data2.gridWidth = 12; //los widgets se mostraran full size dentro de col-md-6 en el modal
			data1.hideToolbar = data2.hideToolbar = true;

			data1.abecebObjectInstanceId = "previewInstanceId-" + getUagTimestampID() + "-data1";
			data1.titlebarBadge = true;
			data1.titlebarBadgeStatus = "old";
			delete data1.dataUpdated;

			data2.abecebObjectInstanceId = "previewInstanceId-" + getUagTimestampID() + "-data2";
			data2.titlebarBadge = true;
			data2.titlebarBadgeStatus = "applied";
			data2.dataShown = data2.dataUpdated;
			delete data2.dataUpdated;

		//render de previews en el modal
		$('#widget-update-display1').empty();
			renderCpWidget( $('#widget-update-display1'), data1, true );
		
 		$('#widget-update-display2').empty();
 			renderCpWidget( $('#widget-update-display2'), data2, true );

		//mostramos fechas de cada version en el modal
		var date1 = data1.dataShown.date
		$('#widget-update-date1').text( tryToLocalizeTimestamp( data1.dataShown.date, 'D MMMM YYYY, h:mm:ss a') );
		$('#widget-update-date2').text( tryToLocalizeTimestamp( data2.dataShown.date, 'D MMMM YYYY, h:mm:ss a') );

		$('#modal-widget-update')[0].contextWidget = contextWidget;

		//stop widget animations
		/*
		$('.contentWidget').
			removeClass("droppableDropped").
			removeClass("droppableReturned").
			removeClass("droppableReceivedHighlight").
			removeClass("droppableAlreadyReceivedHighlight");
		*/

		//mostramos modal
		$('#modal-widget-update').modal('show');
		
	
	}); //end update badges


//init widget update modal buttons
$('#modal-widget-update .modal-body .btn-primary').click(function(event) {
	updateWidgetData( $('#modal-widget-update')[0].contextWidget );
	$('#modal-widget-update').modal('hide');
});
$('#modal-widget-update .modal-body .btn-default').click(function(event) {
	$('#modal-widget-update').modal('hide');
});


$(document).on('click', '.cpDBList>UL>li.jstree-open', function(event) {
	console.log ( this )
	$(this).removeClass('jstree-open').addClass('jstree-closed');
	event.preventDefault(); event.stopPropagation();
	}).on('click','a',function(e) {
        e.stopPropagation();
   });

$(document).on('click', '.cpDBList>UL>li.jstree-closed', function(event) {
	$(this).addClass('jstree-open').removeClass('jstree-closed');
	event.preventDefault(); event.stopPropagation();
	}).on('click','a',function(e) {
        e.stopPropagation();
   });
	

$(document).on('click', '.cpDBList>UL>li.jstree-open', function(event) {
	console.log ( this )
	$(this).removeClass('jstree-open').addClass('jstree-closed');
	event.preventDefault(); event.stopPropagation();
	}).on('click','a',function(e) {
        e.stopPropagation();
   });

$(document).on('click', '.cpDBList>UL>li.jstree-closed', function(event) {
	$(this).addClass('jstree-open').removeClass('jstree-closed');
	event.preventDefault(); event.stopPropagation();
	}).on('click','a',function(e) {
        e.stopPropagation();
   });
	

}); //end document.ready



function updateWidgetData( contextWidget ){

	var cpData = $( contextWidget )[0].cpData;	

	//procesamos comments
		//default comments
		if(!cpData.dataShown["usrctnt1"]){cpData.dataShown["usrctnt1"]="";}
		if(!cpData.dataShown["usrctnt2"]){cpData.dataShown["usrctnt2"]="";}
		if(!cpData.dataUpdated["usrctnt1"]){cpData.dataUpdated["usrctnt1"]="";}
		if(!cpData.dataUpdated["usrctnt2"]){cpData.dataUpdated["usrctnt2"]="";}
	
		//opcion merge comments
		if( cpData.dataShown["usrctnt1"] != cpData.dataUpdated["usrctnt1"] ){
			cpData.dataUpdated["usrctnt1"] +=
				( (cpData.dataShown["usrctnt1"] != "") && (cpData.dataUpdated["usrctnt1"] != "") ? "<br>………<br>" : "" ) +
				cpData.dataShown["usrctnt1"];
			}
		if( cpData.dataShown["usrctnt2"] != cpData.dataUpdated["usrctnt2"] ){
			cpData.dataUpdated["usrctnt2"] +=
				( (cpData.dataShown["usrctnt2"] != "") && (cpData.dataUpdated["usrctnt2"] != "") ? "<br>………<br>" : "" ) +
				cpData.dataShown["usrctnt2"];
			}
	
	//volcamos dataUpdated en dataShown
	cpData.dataShown = cpData.dataUpdated;
	//eliminamos dataUpdated
	delete cpData.dataUpdated;
	//actualizamos widget badge
	cpData.titlebarBadge = false;

	//render de nuevos datos sobre widget
	$( contextWidget ).empty();
	renderCpWidget( $( contextWidget ), cpData, true );
	
	//persistir espacio de trabajo
	$( contextWidget ).cpPersist(events.widgetUpdate);
	
}





function tryToLocalizeTimestamp( d, format ){
	//returns localized format OR original string if cannot parse

	if( !($.isNumeric( d )) ){ return d; }
	
	d = Number(d);
	if(d<631159200000){ return d; } //unix timestamp para "enero 1º 1990, 12:00:00 am"

	return moment (d).format(format);
	
}




function ajustarCSSvalorUM(){

$('.valorUM').parent().each(  function( key, value ) {

	$(this).children(".valorUM").removeClass('alone');
	var parentOffsetX = $(this).offset()['left'];
	var childOffsetX = $(this).children(".valorUM").offset()['left'];
	var bigSmallDiff = parentOffsetX - childOffsetX;
		
	if( bigSmallDiff >= -10 && bigSmallDiff <= 10 ){
		$(this).children(".valorUM").addClass('alone');
		}else{
		$(this).children(".valorUM").removeClass('alone');
		}

});

}



$(function() {
	ajustarCSSvalorUM();
	$(window).smartresize(function(){  
        ajustarCSSvalorUM();
    });
});

    


//isOnScreen
//http://stackoverflow.com/questions/8897289/how-to-check-if-an-element-is-off-screen
/*
Useage:

$(".some-element").filter(":onscreen").doSomething();
$(".some-element").filter(":entireonscreen").doSomething();
$(".some-element").isOnScreen(); // true / false
$(".some-element").isOnScreen(true); // true / false (partially on screen)
$(".some-element").is(":onscreen"); // true / false (partially on screen)
$(".some-element").is(":entireonscreen"); // true / false 
*/

$.fn.isOnScreen = function(partial){

    //let's be sure we're checking only one element (in case function is called on set)
    var t = $(this).first();

    //we're using getBoundingClientRect to get position of element relative to viewport
    //so we dont need to care about scroll position
    var box = t[0].getBoundingClientRect();

    //let's save window size
    var win = {
        h : $(window).height(),
        w : $(window).width()
    };

    //now we check against edges of element

    //firstly we check one axis
    //for example we check if left edge of element is between left and right edge of scree (still might be above/below)
    var topEdgeInRange = box.top >= 0 && box.top <= win.h;
    var bottomEdgeInRange = box.bottom >= 0 && box.bottom <= win.h;

    var leftEdgeInRange = box.left >= 0 && box.left <= win.w;
    var rightEdgeInRange = box.right >= 0 && box.right <= win.w;


    //here we check if element is bigger then window and 'covers' the screen in given axis
    var coverScreenHorizontally = box.left <= 0 && box.right >= win.w;
    var coverScreenVertically = box.top <= 0 && box.bottom >= win.h;

    //now we check 2nd axis
    var topEdgeInScreen = topEdgeInRange && ( leftEdgeInRange || rightEdgeInRange || coverScreenHorizontally );
    var bottomEdgeInScreen = bottomEdgeInRange && ( leftEdgeInRange || rightEdgeInRange || coverScreenHorizontally );

    var leftEdgeInScreen = leftEdgeInRange && ( topEdgeInRange || bottomEdgeInRange || coverScreenVertically );
    var rightEdgeInScreen = rightEdgeInRange && ( topEdgeInRange || bottomEdgeInRange || coverScreenVertically );

    //now knowing presence of each edge on screen, we check if element is partially or entirely present on screen
    var isPartiallyOnScreen = topEdgeInScreen || bottomEdgeInScreen || leftEdgeInScreen || rightEdgeInScreen;
    var isEntirelyOnScreen = topEdgeInScreen && bottomEdgeInScreen && leftEdgeInScreen && rightEdgeInScreen;

    return partial ? isPartiallyOnScreen : isEntirelyOnScreen;

};

$.expr.filters.onscreen = function(elem) {
  return $(elem).isOnScreen(true);
};

$.expr.filters.entireonscreen = function(elem) {
  return $(elem).isOnScreen(true);
};




// Canvas2Image
// covert canvas to image and save the image file
// forked from https://github.com/hongru/canvas2image

var Canvas2Image = function () {

	// check if support sth.
	var $support = function () {
		var canvas = document.createElement('canvas'),
			ctx = canvas.getContext('2d');

		return {
			canvas: !!ctx,
			imageData: !!ctx.getImageData,
			dataURL: !!canvas.toDataURL,
			btoa: !!window.btoa
		};
	}();

	var downloadMime = 'image/octet-stream';

	function scaleCanvas (canvas, width, height) {
		var w = canvas.width,
			h = canvas.height;
		if (width == undefined) {
			width = w;
		}
		if (height == undefined) {
			height = h;
		}

		var retCanvas = document.createElement('canvas');
		var retCtx = retCanvas.getContext('2d');
		retCanvas.width = width;
		retCanvas.height = height;
		retCtx.drawImage(canvas, 0, 0, w, h, 0, 0, width, height);
		return retCanvas;
	}

	function getDataURL (canvas, type, width, height) {
		canvas = scaleCanvas(canvas, width, height);
		return canvas.toDataURL(type);
	}


	function genImage(strData) {
		var img = document.createElement('img');
		img.src = strData;
		return img;
	}
	function fixType (type) {
		type = type.toLowerCase().replace(/jpg/i, 'jpeg');
		var r = type.match(/png|jpeg|bmp|gif/)[0];
		return 'image/' + r;
	}
	function encodeData (data) {
		if (!window.btoa) { throw 'btoa undefined' }
		var str = '';
		if (typeof data == 'string') {
			str = data;
		} else {
			for (var i = 0; i < data.length; i ++) {
				str += String.fromCharCode(data[i]);
			}
		}

		return btoa(str);
	}
	function getImageData (canvas) {
		var w = canvas.width,
			h = canvas.height;
		return canvas.getContext('2d').getImageData(0, 0, w, h);
	}
	function makeURI (strData, type) {
		return 'data:' + type + ';base64,' + strData;
	}


	/**
	 * create bitmap image
	 * 按照规则生成图片响应头和响应体
	 */
	var genBitmapImage = function (oData) {

		//
		// BITMAPFILEHEADER: http://msdn.microsoft.com/en-us/library/windows/desktop/dd183374(v=vs.85).aspx
		// BITMAPINFOHEADER: http://msdn.microsoft.com/en-us/library/dd183376.aspx
		//

		var biWidth  = oData.width;
		var biHeight	= oData.height;
		var biSizeImage = biWidth * biHeight * 3;
		var bfSize  = biSizeImage + 54; // total header size = 54 bytes

		//
		//  typedef struct tagBITMAPFILEHEADER {
		//  	WORD bfType;
		//  	DWORD bfSize;
		//  	WORD bfReserved1;
		//  	WORD bfReserved2;
		//  	DWORD bfOffBits;
		//  } BITMAPFILEHEADER;
		//
		var BITMAPFILEHEADER = [
			// WORD bfType -- The file type signature; must be "BM"
			0x42, 0x4D,
			// DWORD bfSize -- The size, in bytes, of the bitmap file
			bfSize & 0xff, bfSize >> 8 & 0xff, bfSize >> 16 & 0xff, bfSize >> 24 & 0xff,
			// WORD bfReserved1 -- Reserved; must be zero
			0, 0,
			// WORD bfReserved2 -- Reserved; must be zero
			0, 0,
			// DWORD bfOffBits -- The offset, in bytes, from the beginning of the BITMAPFILEHEADER structure to the bitmap bits.
			54, 0, 0, 0
		];

		//
		//  typedef struct tagBITMAPINFOHEADER {
		//  	DWORD biSize;
		//  	LONG  biWidth;
		//  	LONG  biHeight;
		//  	WORD  biPlanes;
		//  	WORD  biBitCount;
		//  	DWORD biCompression;
		//  	DWORD biSizeImage;
		//  	LONG  biXPelsPerMeter;
		//  	LONG  biYPelsPerMeter;
		//  	DWORD biClrUsed;
		//  	DWORD biClrImportant;
		//  } BITMAPINFOHEADER, *PBITMAPINFOHEADER;
		//
		var BITMAPINFOHEADER = [
			// DWORD biSize -- The number of bytes required by the structure
			40, 0, 0, 0,
			// LONG biWidth -- The width of the bitmap, in pixels
			biWidth & 0xff, biWidth >> 8 & 0xff, biWidth >> 16 & 0xff, biWidth >> 24 & 0xff,
			// LONG biHeight -- The height of the bitmap, in pixels
			biHeight & 0xff, biHeight >> 8  & 0xff, biHeight >> 16 & 0xff, biHeight >> 24 & 0xff,
			// WORD biPlanes -- The number of planes for the target device. This value must be set to 1
			1, 0,
			// WORD biBitCount -- The number of bits-per-pixel, 24 bits-per-pixel -- the bitmap
			// has a maximum of 2^24 colors (16777216, Truecolor)
			24, 0,
			// DWORD biCompression -- The type of compression, BI_RGB (code 0) -- uncompressed
			0, 0, 0, 0,
			// DWORD biSizeImage -- The size, in bytes, of the image. This may be set to zero for BI_RGB bitmaps
			biSizeImage & 0xff, biSizeImage >> 8 & 0xff, biSizeImage >> 16 & 0xff, biSizeImage >> 24 & 0xff,
			// LONG biXPelsPerMeter, unused
			0,0,0,0,
			// LONG biYPelsPerMeter, unused
			0,0,0,0,
			// DWORD biClrUsed, the number of color indexes of palette, unused
			0,0,0,0,
			// DWORD biClrImportant, unused
			0,0,0,0
		];

		var iPadding = (4 - ((biWidth * 3) % 4)) % 4;

		var aImgData = oData.data;

		var strPixelData = '';
		var biWidth4 = biWidth<<2;
		var y = biHeight;
		var fromCharCode = String.fromCharCode;

		do {
			var iOffsetY = biWidth4*(y-1);
			var strPixelRow = '';
			for (var x = 0; x < biWidth; x++) {
				var iOffsetX = x<<2;
				strPixelRow += fromCharCode(aImgData[iOffsetY+iOffsetX+2]) +
							   fromCharCode(aImgData[iOffsetY+iOffsetX+1]) +
							   fromCharCode(aImgData[iOffsetY+iOffsetX]);
			}

			for (var c = 0; c < iPadding; c++) {
				strPixelRow += String.fromCharCode(0);
			}

			strPixelData += strPixelRow;
		} while (--y);

		var strEncoded = encodeData(BITMAPFILEHEADER.concat(BITMAPINFOHEADER)) + encodeData(strPixelData);

		return strEncoded;
	};

	/**
	 * saveAsImage
	 * @param canvasElement
	 * @param {String} image type
	 * @param {Number} [optional] png width
	 * @param {Number} [optional] png height
	 */
	var saveAsImage = function (canvas, width, height, type, filename) {
		if ($support.canvas && $support.dataURL) {
			if (typeof canvas == "string") { canvas = document.getElementById(canvas); }
			if (type == undefined) { type = 'png'; }
			type = fixType(type);
			if (/bmp/.test(type)) {
				var data = getImageData(scaleCanvas(canvas, width, height));
				var strData = genBitmapImage(data);
				saveFileWithName(makeURI(strData, downloadMime), filename);
				// saveFile(makeURI(strData, downloadMime));
			} else {
				var strData = getDataURL(canvas, type, width, height);
				// saveFile(strData.replace(type, downloadMime));
				saveFileWithName(strData.replace(type, downloadMime),filename);
			}
		}
	};
	

	function saveFile (strData) {
		document.location.href = strData;
	}







	var convertToImage = function (canvas, width, height, type) {
		if ($support.canvas && $support.dataURL) {
			if (typeof canvas == "string") { canvas = document.getElementById(canvas); }
			if (type == undefined) { type = 'png'; }
			type = fixType(type);

			if (/bmp/.test(type)) {
				var data = getImageData(scaleCanvas(canvas, width, height));
				var strData = genBitmapImage(data);
				return genImage(makeURI(strData, 'image/bmp'));
			} else {
				var strData = getDataURL(canvas, type, width, height);
				return genImage(strData);
			}
		}
	};



	return {
		saveAsImage: saveAsImage,
		saveAsPNG: function (canvas, width, height, filename) {
			return saveAsImage(canvas, width, height, 'png', filename);
		},
		saveAsJPEG: function (canvas, width, height) {
			return saveAsImage(canvas, width, height, 'jpeg');
		},
		saveAsGIF: function (canvas, width, height) {
			return saveAsImage(canvas, width, height, 'gif');
		},
		saveAsBMP: function (canvas, width, height) {
			return saveAsImage(canvas, width, height, 'bmp');
		},

		convertToImage: convertToImage,
		convertToPNG: function (canvas, width, height) {
			return convertToImage(canvas, width, height, 'png');
		},
		convertToJPEG: function (canvas, width, height) {
			return convertToImage(canvas, width, height, 'jpeg');
		},
		convertToGIF: function (canvas, width, height) {
			return convertToImage(canvas, width, height, 'gif');
		},
		convertToBMP: function (canvas, width, height) {
			return convertToImage(canvas, width, height, 'bmp');
		}
	};

}();



//saveFileWithName
// http://stackoverflow.com/questions/283956/is-there-any-way-to-specify-a-suggested-filename-when-using-data-uri
// Chrome and Firefox will use the specified filename.
// IE11, Edge, and Safari 9 (which don't support the download attribute) will download the file with their default name or they will simply display it in a new tab, if it's of a supported file type: images, videos, audio files, …
function saveFileWithName (uri, filename) {
  var link = document.createElement('a');
  if (typeof link.download === 'string') {
    link.href = uri;
    link.download = filename;

    //Firefox requires the link to be in the body
    document.body.appendChild(link);
    
    //simulate click
    link.click();

    //remove the link when done
    document.body.removeChild(link);
  } else {
    window.open(uri);
  }
}



