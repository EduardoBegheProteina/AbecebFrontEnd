
function getActualInstance(){
	var hostname = window.location.hostname;
	var site = hostname.split(".")[0];
	switch(site) {
		case "bde":
		case "staff":
			return instances.staff;
			break;
		case "compass":
			return instances.compass;
			break;
	}
	return site;
}

function editCompassWorkspace(workspaceID) {
	window.location = redirectUrls.editWorkspaceURL + workspaceID;
}