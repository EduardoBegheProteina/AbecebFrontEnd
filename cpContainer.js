$.templates("cpContainer",
'{{if children tmpl="cpContainerNode"}}{{else tmpl="cpObjectNode"}}{{\/if}}'
); //cpContainer


$.templates("cpContainerNode",
	'<div id="{{:abecebObjectId}}" data-cpdata=\'{{JSONstringifyNoChildren #data/}}\' '+
		'class="cpObjectToInit cpContainerNode jstree-default '+
			'{{if type1=="widgetsContainer"}} widgetsContainer {{/if}}'+
			'{{if type2=="cpRoot"}} cpRoot {{/if}}'+
			'{{if mode=="edit"}} widgetsContainer-sortable {{/if}}'+
			'{{if mode=="render"}} widgetsContainer-draggable {{/if}}'+
			'{{if autoUpdate}} htHasautoUpdate {{/if}}'+
			
			'{{if gridWidth}} col-md-{{:gridWidth}} col-md-{{:gridWidth}} col-xs-12 {{/if}}'+
			
			'{{if cpCollapsable}} cpCollapsable '+
				'{{if opened}} cpCollapsableOpened {{else}} cpCollapsableClosedAfterRender {{/if}}'+
			'{{/if}}'+
			
		'">'+
		
		'{{if type2=="cpRoot"}}'+
			'{{if mode=="edit"}}{{include tmpl="cpRoot-topToolbar"/}}'+
			'{{else title && title!=""}}{{include tmpl="cpRoot-topHTtitle"/}}{{/if}}'+
		'{{/if}}'+

'{{if cpHtmlTitle || cpCollapsable}}'+
	'<div class="cpContainerTitle cpContainerTitleCollapsable {{if opened}} jstree-open {{else}} jstree-closed {{/if}} ">'+
		'{{if cpCollapsable}}<i class="jstree-icon jstree-ocl v-align"></i>{{/if}}'+
		'{{if territorios}}'+
		'<div class="territorio v-align"><span class="T0 xh-flag xh-{{toClassName:territorios[0]}}"></span></div>'+
		'{{/if}}'+//territorios
		'{{if cpHtmlTitle}}'+
		'<div class="titulo v-align">{{:cpHtmlTitle}}</div>'+
		'{{/if}}'+ //cpHtmlTitle
	'</div>'+
// 	'<div class="cpContainerTitle {{if cpCollapsable}}cpContainerTitleCollapsable{{/if}} ">'+
// 		'{{if cpHtmlTitle}}{{:cpHtmlTitle}}{{/if}}'+
// 		'{{if cpCollapsable}}cpCollapsable{{/if}}'+
// 		'{{if opened}}opened{{/if}}'+
// 	'</div>'+ //.cpContainerTitle
'{{/if}}'+//cpHtmlTitle || cpCollapsable


		'{{for children tmpl="cpContainer"/}}'+
		
		'<\/div><div class="clearfix"></div>'
); //cpContainerNode


$.templates("cpObjectNode",
	'<div id="{{:abecebObjectId}}" data-cpdata=\'{{JSONstringifyNoChildren #data/}}\' '+
		' class="cpObjectToInit'+
			'{{if gridWidth}} col-md-{{:gridWidth}} col-md-{{:gridWidth}} col-xs-12 {{/if}}'+
			'{{if type=="cpWidget"}} contentWidget{{/if}}'+
		'">'+
		'{{if type=="cpWidget"}}{{include tmpl="cpWidget"/}}{{/if}}'+
		'{{if type=="cpHtml"}}{{include tmpl="cpHtml"/}}{{/if}}'+
		'{{if type=="cpDBList"}}{{include tmpl="cpDBList"/}}{{/if}}'+
		'{{if type=="cpPagination"}}{{include tmpl="cpPagination"/}}{{/if}}'+
	'<\/div>'
); //cpObjectNode


$.templates("cpHtml",
'<div class="cpHtml" {{if style}}style="{{:style}}{{/if}}">'+
	'{{:content}}'+
'</div><div class="clearfix"></div>'
); //cpHtml


$.templates("cpDBList",
'<div id="" class="cpDBList jstree jstree-1 jstree-default">'+

	'{{for items}}'+ //	'<!-- PAIS -->'+
	'<ul class="jstree-container-ul jstree-children">'+
		'<li class="jstree-node no-check jstree-last {{if opened && (opened=="true"||opened==true) }}jstree-open{{else}}jstree-closed{{/if}}">'+
			'<i class="jstree-icon jstree-ocl v-align"></i>'+
			'{{if territorios}}'+
			'<div class="territorio v-align"><span class="T0 xh-flag xh-{{toClassName:territorios[0]}}"></span></div>'+
			'{{/if}}'+//territorios
			'<h4 class="v-align">{{:cpTitle}} {{if cpTitleSmall}}<small>{{:cpTitleSmall}}</small>{{/if}}</h4>'+
			'<ul class="jstree-children" >'+
			'{{for items}}'+
				'<li class="jstree-node jstree-leaf">'+
					'<i class="jstree-icon jstree-ocl"></i>'+
					'<a href="{{:cpHref}}">{{if !cpIcon || cpIcon=="typeDataSet" || cpIcon==""}}<span class="li-icon typeDataSubSet"></span>{{else}}<i class="fa {{:cpIcon}}" aria-hidden="true"></i>{{/if}}{{:cpTitle}} {{if cpTitleSmall}}<small>{{:cpTitleSmall}}</small>{{/if}}</a>'+
				'</li>'+
			'{{/for}}'+//items
			'</ul>'+
		'</li>'+
	'</ul>'+
 	'{{/for}}'+//items PAIS
'</div>'+
'<div class="clearfix"></div>'
); //cpDBList



$.templates("cpPagination",
'<hr>'+
'<div class="cpPagination" {{if style}}style="{{:style}}{{/if}}">'+
	'<nav> <ul class="pagination pagination-lg">'+	
		'<li class="page-item {{if pagerCurrent==1}}disabled inactive{{/if}}"><a href="{{:pagerURLpattern1}}{{:pagerCurrent-1}}{{:pagerURLpattern2}}" aria-label="Previous"><span aria-hidden="true">«</span></a></li>'+


'{{for ~getPaginationArray(pagerCurrent, pagerTotal, 3) ~pagerCurrent=pagerCurrent ~pagerTotal=pagerTotal ~pagerURLpattern1=pagerURLpattern1 ~pagerURLpattern2=pagerURLpattern2 }}'+

	'{{if #data == "..." }}'+
		'<li class="page-item disabled"><span>&hellip;</span></li>'+	
	'{{else}}'+
		'<li class="page-item {{if #data == ~pagerCurrent }}active{{/if}}">'+
		'<a class="page-link" href="{{:~pagerURLpattern1}}{{:#data}}{{:~pagerURLpattern2}}">{{:#data}}</a>'+
		'</li>'+
	'{{/if}}'+

'{{/for}}'+


		
		'<li class="page-item {{if pagerCurrent==pagerTotal}}disabled{{/if}}"><a href="{{:pagerURLpattern1}}{{:pagerCurrent+1}}{{:pagerURLpattern2}}" aria-label="Next"><span aria-hidden="true">»</span></a></li>'+

	'</ul></nav>'+
'</div><div class="clearfix"></div>'
); //cpPagination



$.templates("cpWidget",
	'<div class="x_panel cpWidget-x-{{:type1}}" >'+
	'<div class="x_title">'+
		'<div class="territorio">'+

			'{{for territorios}}'+
				'<span class="T0 xh-flag xh-{{toClassName:#data.split("|")[0]}}"><var>{{:#data.split("|")[0]}}</var></span>'+

				'{{if #data.split("|").length>1  }}'+
				'<span class="T1">{{:#data.split("|")[1]}}</span>'+
				'{{/if}}'+

			'{{/for}}'+
		'</div>' +
		'<ul class="nav navbar-right panel_toolbox">'+
			'{{if titlebarBadge}}'+
				'<span class="updatedBadge" updatedBadgeStatus-{{:titlebarBadgeStatus}}"'+
					' data-toggle="tooltip" title="Actualización de datos disponible." '+
//				'<span class="updatedBadge updatedBadgeStatus-{{:titlebarBadgeStatus}}"'+
//				'{{if titlebarBadgeStatus!="applied" && titlebarBadgeStatus!="old"}} data-toggle="tooltip" title="Actualización de datos disponible."{{/if}}'+
				'><i class="fa fa-refresh" aria-hidden="true"></i></span>'+
			'{{/if}}'+
			'<span class="autoUpdateBadge autoUpdateStatus-{{if autoUpdate}}true{{else}}false{{/if}}" '+
				'><i class="fa fa-refresh" aria-hidden="true"></i></span>'+			
			
			'{{if !hideToolbar}}'+
			'<li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false" data-onclick="contextmenu"><i class="fa fa-caret-down"></i></a></li>'+
			'{{/if}}'+
		'</ul>'+
		'<div class="clearfix"></div>'+
	'</div>'+
	
	'<div class="x_content">'+
		'<h2 class="cpTitle">'+
			'{{if type1=="ht"}}<a href="{{:href}}">{{/if}}'+
			'{{:dataShown.cpTitle}}'+
			'{{if type1=="ht"}}</a>{{/if}}'+
		'</h2>'+
		'<div class="usrctnt usrctnt-head">{{:dataShown.usrctnt1}}</div>'+

		'{{if type1=="indicador"}}{{include tmpl="cpWidget-x-indicador"/}}'+
		'{{else type1=="grafico"}}{{include tmpl="cpWidget-x-grafico"/}}'+
		'{{else type1=="tabla"}}{{include tmpl="cpWidget-x-tabla"/}}'+
		'{{else type1=="imagen"}}{{include tmpl="cpWidget-x-imagen"/}}'+
		'{{else type1=="ht"}}{{include tmpl="cpWidget-x-ht"/}}'+
		'{{else type1=="descarga"}}{{include tmpl="cpWidget-x-descarga"/}}'+
		'{{else type1=="embed"}}{{include tmpl="cpWidget-x-embed"/}}'+
		'{{else type1=="cphtml"}}{{include tmpl="cpWidget-x-cphtml"/}}'+
		'{{/if}}'+

		'<div class="usrctnt usrctnt-foot">{{:dataShown.usrctnt2}}</div>'+

'{{if dataShown.metadataShown && dataShown.metadataShown.length > 0 }}'+
	'<div class="dato1-ft">'+
		'{{for dataShown.metadataShown }}'+
		'<p>{{:#data}}</p>'+
		'{{/for}}'+
	'</div>'+
'{{/if}}'+
	

	'</div>'+
'</div>'
); //cpWidget


$.templates("cpWidget-x-indicador",
	'{{if dataShown.cpH4 }}'+
	'<div class="cpH4">{{:dataShown.cpH4}}</div>'+
	'{{/if}}'+

	'<div class="x_content_dato">'+
		'{{if dataShown.trend!=undefined && !dataShown.trendDescription }}'+
			'{{if dataShown.trend == 1 }}<big class="{{if iconSet}}iconset-{{:iconSet}}{{/if}} trend-up"></big>{{/if}}'+
			'{{if dataShown.trend == "0" || dataShown.trend == "eq" }}<big class="{{if iconSet}}iconset-{{:iconSet}}{{/if}} trend-eq"></big>{{/if}}'+
			'{{if dataShown.trend == -1 }}<big class="{{if iconSet}}iconset-{{:iconSet}}{{/if}} trend-down"></big>{{/if}}'+
		'{{/if}}'+
		'<span class="valor">{{:dataShown.valor}}</span>'+
		'<span class="valorUM{{if dataShown.valorUM.length < 3 }} big{{/if}}">{{:dataShown.valorUM}}</span>'+
	'</div>'+
	
	'{{if dataShown.trendDescription }}'+
		'<div class="trend-text1 {{if iconSet}}iconset-{{:iconSet}}{{/if}} '+
			'{{if dataShown.trend == 1 }} trend-up{{/if}}'+
			'{{if dataShown.trend == 0 || dataShown.trend == "eq" }} trend-eq{{/if}}'+
			'{{if dataShown.trend == -1 }} trend-down{{/if}}'+
		'">'+
            '<span class="trend-arrow"></span>'+
            '<span class="trend-value">{{:dataShown.trendValue}}</span>'+
            '<span class="trend-um">{{:dataShown.trendUM}}</span>'+
            ' <span class="trend-description">{{:dataShown.trendDescription}}</span>'+
		'</div>'+
	'{{/if}}'+	

	'{{if dataShown.ownerText1 }}'+
		'<div class="owner-text1">{{:dataShown.ownerText1}}</div>'+
	'{{/if}}'

); //cpWidget-x-indicador



$.templates("cpWidget-x-grafico",

'<div role="tabpanel">'+

//  '<!-- Nav tabs -->'+
  '<ul class="nav nav-tabs" role="tablist">'+
    '<li role="presentation" class="active"><a href="#{{:abecebObjectId}}-grafico" role="tab" data-toggle="tab">Gráfico</a></li>'+
    '<li role="presentation"><a href="#{{:abecebObjectId}}-datos" role="tab" data-toggle="tab">Datos</a></li>'+
  '</ul>'+

//  '<!-- Tab panes -->'+
  '<div class="tab-content">'+
    '<div role="tabpanel" class="tab-pane active" id="{{:abecebObjectId}}-grafico">'+
    	'<canvas id="widget-{{:abecebObjectId}}-canvas"></canvas>'+
    '</div>'+
    '<div role="tabpanel" class="tab-pane" id="{{:abecebObjectId}}-datos">'+
		'{{include tmpl="cpWidget-x-tabla"/}}'+
    '</div>'+
  '</div>'+

'</div>'


); //cpWidget-x-grafico



$.templates("cpWidget-x-imagen",

'<div role="tabpanel">'+

  '{{if dataShown.tabledata}}'+
  '<ul class="nav nav-tabs" role="tablist">'+
    '<li role="presentation" class="active"><a href="#{{:abecebObjectInstanceId}}-imagen" role="tab" data-toggle="tab">Imagen</a></li>'+
    '<li role="presentation"><a href="#{{:abecebObjectInstanceId}}-datos" role="tab" data-toggle="tab">Datos</a></li>'+
  '</ul>'+
  '{{/if}}'+

  '{{if dataShown.tabledata}}'+
  '<div class="tab-content">'+
    '<div role="tabpanel" class="tab-pane active" id="{{:abecebObjectInstanceId}}-imagen">'+
    '{{/if}}'+
    	'<img id="widget-{{:abecebObjectInstanceId}}-imagen-img" src="{{:dataShown.src}}" width="100%" />'+
  '{{if dataShown.tabledata}}'+
    '</div>'+
    '<div role="tabpanel" class="tab-pane" id="{{:abecebObjectInstanceId}}-datos">'+
		'{{include tmpl="cpWidget-x-tabla"/}}'+
    '</div>'+
  '</div>'+
  '{{/if}}'+

'</div>'


); //cpWidget-x-imagen


$.templates("cpWidget-x-tabla",
	'<table class="table table-hover table-var">'+
		'<thead>'+
			'{{range dataShown.tabledata start=0 end=1 }}'+
			'<tr>'+
			'{{for #data }}'+
				'{{tdFromTableData #data th /}}' +
				'{{/for}}'+
			'</tr>'+
			'{{/range}}'+
			'</thead>'+
		'<tbody>'+
			'{{range dataShown.tabledata start=1 }}'+
			'<tr>'+
				'{{range #data start=0 }}'+
					'{{tdFromTableData : /}}' +
				'{{/range}}'+
			'</tr>'+
				'{{/range}}'+
		'</tbody>'+
	'</table>'

); //cpWidget-x-tabla



$.templates("cpWidget-x-ht",


	'{{if dataShown.cpH4 }}'+
	'<div class="cpH4">{{:dataShown.cpH4}}</div>'+
	'{{/if}}'+
	
	'{{if dataShown.descripcion }}'+
		'<p class="text-gral">{{:dataShown.descripcion}}</p>'+
	'{{/if}}'+
	
	'<div class="dato1-ft">'+
		'{{if dataShown.author }}'+
			'<div class="dato1-ft-authordata">'+
				'{{if dataShown.authorPic }}'+
					'<div class="dato1-ft-authordata-pic"><img class="pic-author img-circle" src="{{:dataShown.authorPic}}" width="41" height="41" alt="" /></div>'+
				'{{/if}}'+
				'<div class="dato1-ft-authordata-data"><p class="dato1-ft-authordata-data-nombre">{{:dataShown.author}}</p><p class="dato1-ft-authordata-data-fecha">25 de mayo 2015</p></div>'+
			'</div>'+
		'{{/if}}'+
		'<div class="dato1-ft-contains">'+
			'{{if dataShown.contains.indicadores }}<dfn><i class="fa fa-percent" aria-hidden="true"></i><var>{{:dataShown.contains.indicadores}}</var></dfn>{{/if}}'+
			'{{if dataShown.contains.tablas }}<dfn><i class="fa fa-table" aria-hidden="true"></i><var>{{:dataShown.contains.tablas}}</var></dfn>{{/if}}'+
			'{{if dataShown.contains.graficos }}<dfn><i class="fa fa-play-circle" aria-hidden="true"></i><var>{{:dataShown.contains.graficos}}</var></dfn>{{/if}}'+
			'{{if dataShown.contains.embeds }}<dfn><i class="fa fa-bar-chart" aria-hidden="true"></i><var>{{:dataShown.contains.embeds}}</var></dfn>{{/if}}'+
			'{{if dataShown.contains.textos }}<dfn><i class="fa fa-text-height" aria-hidden="true"></i><var>{{:dataShown.contains.textos}}</var></dfn>{{/if}}'+
		'</div>'+
	'</div>'


); //cpWidget-x-ht


$.templates("cpWidget-x-descarga",
	'{{if dataShown.cpH4 }}'+
	'<div class="cpH4">{{:dataShown.cpH4}}</div>'+
	'{{/if}}'+

	'{{if dataShown.ownerText3 }}'+
		'<div class="owner-text3">{{:dataShown.ownerText3}}</div>'+
	'{{/if}}'+
	
	'<div class="x_content_descarga">'+
		'<div class="formato-icon">'+
			'{{if dataShown.formato.toLowerCase() == "pdf"}}<i class="fa fa-file-pdf-o" aria-hidden="true"></i>'+
			'{{else dataShown.formato.toLowerCase() == "xls"}}<i class="fa fa-file-excel-o" aria-hidden="true"></i>'+
			'{{else dataShown.formato.toLowerCase() == "doc"}}<i class="fa fa-file-word-o" aria-hidden="true"></i>'+
			'{{else dataShown.formato.toLowerCase() == "img"}}<i class="fa fa-file-image-o" aria-hidden="true"></i>'+
			'{{else dataShown.formato.toLowerCase() == "txt"}}<i class="fa fa-file-text-o" aria-hidden="true"></i>'+
			'{{else dataShown.formato.toLowerCase() == "ppt"}}<i class="fa fa-file-powerpoint-o" aria-hidden="true"></i>'+
			'{{else dataShown.formato.toLowerCase() == "vid"}}<i class="fa fa-file-video-o" aria-hidden="true"></i>'+
			'{{else dataShown.formato.toLowerCase() == "snd"}}<i class="fa fa-file-sound-o" aria-hidden="true"></i>'+
			'{{else dataShown.formato.toLowerCase() == "zip"}}<i class="fa fa-file-archive-o" aria-hidden="true"></i>'+
			'{{else}}<i class="fa fa-file-o" aria-hidden="true"></i>'+
			'{{/if}}'+
		'</div>'+
		'<div class="formato-data">Formato {{:dataShown.formato}}<br>{{:dataShown.filesize}} {{:dataShown.filesizeUM}}</div>'+
		'<a href="{{:dataShown.href}}" class="descarga">Descargar archivo</a>'+
	'</div>'+
	
	'{{if dataShown.ownerText1 }}'+
		'<div class="owner-text1">{{:dataShown.ownerText1}}</div>'+
	'{{/if}}'

); //cpWidget-x-descarga


$.templates("cpWidget-x-embed",
	'{{if dataShown.cpH4 }}'+
	'<div class="cpH4">{{:dataShown.cpH4}}</div>'+
	'{{/if}}'+

	'{{if dataShown.ownerText3 }}'+
		'<div class="owner-text3">{{:dataShown.ownerText3}}</div>'+
	'{{/if}}'+
	
	'<div class="embed-responsive embed-responsive-{{:dataShown.proporcion}}">'+
		'<iframe class="embed-responsive-item" frameborder="0" allowfullscreen '+
			'width="400" height="300" '+
			'src="{{:dataShown.src}}"></iframe>'+
		'</div>'+
	
	'{{if dataShown.ownerText1 }}'+
		'<div class="owner-text1">{{:dataShown.ownerText1}}</div>'+
	'{{/if}}'

); //cpWidget-x-embed



$.templates("cpWidget-x-cphtml",
	
	'<div class="cpHtmlwidgetContent">'+
		'{{:dataShown.cpHtml}}'+
		'</div>'

); //cpWidget-x-cphtml



$.templates("cpRoot-topToolbar",

'<div id="topToolbar" class="topHTtitle topToolbar pinnedNOT">'+
	'<div class="row">'+
		'<div class="col-md-8">'+
			'<h1 id="topHTtitleH1">{{:cpTitle}}</h1>'+
		'</div>'+

		'<div class="col-md-4">'+
		'<ul class="topToolbarTools">'+
			'<li class="iconTop iconBig toolbarIcon toolbarIcon-crearTexto">'+
				'<a href="#" class="btn btn-tool btn-draggable-COMMENTEDOUT btn-lg">'+
				'<i class="fa fa-text-width" aria-hidden="true"></i>'+
				'Crear texto'+
				'</a>'+
			'</li>'+
			'<li class="vr"></li>'+
			'<li class="iconTop iconBig toolbarIcon toolbarIcon-renombrar">'+
				'<a href="#" class="btn btn-tool btn-draggable-COMMENTEDOUT btn-lg">'+
				'<i class="fa fa-pencil-square-o" aria-hidden="true"></i>'+
				'Cambiar nombre…'+
				'</a>'+
			'</li>'+
			'<li class="vr"></li>'+
			'<li class="iconTop iconBig toolbarIcon toolbarIcon-share">'+
				'<a href="#" class="btn btn-tool btn-draggable-COMMENTEDOUT btn-lg">'+
				'<i class="fa fa-share-alt" aria-hidden="true"></i>'+
				'Compartir...'+
				'</a>'+
			'</li>'+
			'<li class="vr"></li>'+
			'<li class="{{if !downloadHref || downloadHref==\"\"}} disabled {{/if}} iconTop iconBig toolbarIcon toolbarIcon-exportar">'+
				'<a href="#" class="btn btn-tool btn-lg">'+
				'<i class="fa fa-download" aria-hidden="true"></i>'+
				'Exportar'+
				'</a>'+
			'</li>'+
			'<li class="vr"></li>'+
			'<li class="{{if autoUpdate=="true" || autoUpdate==true }} green {{/if}} iconTop iconBig toolbarIcon toolbarIcon-update">'+
				'<a href="#" class="btn btn-tool btn-lg">'+
				'<i class="fa fa-refresh" aria-hidden="true"></i>'+
				'Actualizar…'+
				'</a>'+
			'</li>'+
		'</ul>'+
	'</div>'+ //col
	'</div>'+ //row
'</div>' //toolbar

); //cpRoot-topToolbar



$.templates("cpRoot-topHTtitle",

'<div id="" class="topHTtitle">'+
	'<div class="row">'+
		'<div class="col-md-8">'+
			'<h1 id="topHTtitleH1">{{:title}}</h1>'+
		'</div>'+
	'</div>'+ //row
'</div>' //toolbar

); //cpRoot-topToolbar