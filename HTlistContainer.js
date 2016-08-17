var currentSite = getActualInstance();
var baseUrl = "/group/guest/home?ht"; 

if(currentSite == instances.staff) {
	baseUrl = "/group/catalogo-de-datos/impersonate?ht";
} 

$.templates("HTlistContainer",

'{{for children }}'+

	'<li id="htli-{{:abecebObjectId}}" data-cpdata=\'{{jsRenderJSONstringify #data/}}\' '+
		'workspaceID="{{:abecebObjectId}}" ' +
		'class="cpObjectToInit '+
		'">'+
		'<span class="dropdown pull-right"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i class="fa fa-caret-down"></i></a>'+

		'<ul class="dropdown-menu" role="menu">'+
		'<li><a href="#" class="sidebar-menu-item" data-action="rename"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Cambiar nombre…</a></li>'+
		'<li role="separator" class="divider"></li>'+

	
		'<li class="{{if !downloadHref || downloadHref==""}} disabled {{/if}}"><a href="#" class="sidebar-menu-item" data-action="export"><i class="fa fa-download" aria-hidden="true"></i> Exportar</a></li>'+
		'<li role="separator" class="divider"></li>'+
		'<li><a href="#" class="sidebar-menu-item" data-action="delete"><i class="fa fa-trash-o" aria-hidden="true"></i> Eliminar…</a></li>'+
		'</ul>'+
		'</span>'+
	
		'<a href="' + baseUrl + '={{:abecebObjectId}}">'+
			'<i class="fa fa-folder-o" aria-hidden="true"></i> '+
			'<span class="var-title">{{:cpTitle}}</span>'+
		'</a>'+
	'</li>' +

'{{/for}}'

); //HTlistContainer


