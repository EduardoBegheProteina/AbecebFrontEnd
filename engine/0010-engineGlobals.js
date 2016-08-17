//Cualquier variable definida aqui se puede usar en los scopes contenidos.
//Estas variables se pueden popular desde el lado servidor.

var base = window.location.origin;

$baseURL = base + "/";
$basePath = "/compass100/sub-prodigent/";
$componentsPath = "engine/Components";
$baseComponentsPath = $basePath + $componentsPath;

$jsonPath = "abeceb-compass-theme/js/";
function getJsonCallURL( what ){
	return ($jsonPath + what );
}

$jtemplatesPath = "jtemplates/";

$user = "Juan_Dominguez";
$userId = "12345"
