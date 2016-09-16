// Archivo de constantes de la aplicación de Abeceb

var friendlyURLs = {
		staff : "/group/catalogo-de-datos/",
		compass : "/group/compass-platform/"
}

var events = {
	sidebarRename : "htListHTRename",
	sidebarElementDelete : "htListHTDelete",
	widgetResize : "cpContainerWidgetResize",
	widgetEdit : "cpContainerWidgetEdit",
	widgetDelete: "cpContainerWidgetDelete",
	widgetUpdate: "cpContainerWidgetUpdate",
	sidebarAddWidget:"htListHTAddWidget",
	widgetSort: "cpContainerSort",
	sidebarSort: "htListSort",
	sidebarNewWS : "htListNewHT",
	widgetBuilderCreated : "widgetBuilderCreated"
}

var instances = {
	staff : "staff",
	compass : "compass"
}

var conflictingCharacters = {
	percent : "%",
	percentReplacement : "_PERCENT_"
}

var redirectUrls = {
		// Valor tomado de CompassConstants.COMPASS_DATAOBJECT_REDIRECT_URL
		editCompassObjectRedirectURL : friendlyURLs.compass + "editar-objetos-compass?id=",
		editWorkspaceURL : friendlyURLs.compass + "home?ht="
}

var ids = {
	// Valor tomado de CompassConstants.CONSULTANT_WORKSPACE_UUID
	consultantWorkspaceId : "e7a11e4e-1fec-447e-a182-a57e82fdc82a"
}

$entorno = false;
