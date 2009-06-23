var map, manager;
var centerLatitude = 40.736462, centerLongitude = -73.98777, startZoom = 12;


function createMarkerClickHandler(marker, text, link) {
  return function() {
    marker.openInfoWindowHtml(
      '<h3>' + text + '</h3>' +
      '<p><a href="' + link + '">Wikipedia &raquo;</a></p>'
    );
    return false;
  };
}


function createMarker(pointData) {
  var latlng = new GLatLng(pointData.latitude, pointData.longitude);

  var icon = new GIcon();
  icon.image = 'red_marker.png';
  icon.iconSize = new GSize(32, 32);
  icon.iconAnchor = new GPoint(16, 16);
  icon.infoWindowAnchor = new GPoint(25, 7);

  opts = {
    "icon": icon,
    "clickable": true,
    "labelText": pointData.abbr,
    "labelOffset": new GSize(-16, -16)
  };
 
  var marker = new LabeledMarker(latlng, opts);
  var handler = createMarkerClickHandler(marker, pointData.name, pointData.wp);
	
  GEvent.addListener(marker, "click", handler);

  var listItem = document.createElement('li');
  listItem.innerHTML = '<div class="label">'+pointData.abbr+'</div><a href="' + pointData.wp + '">' + pointData.name + '</a>';
  listItem.getElementsByTagName('a')[0].onclick = handler;

  document.getElementById('sidebar-list').appendChild(listItem);

  return marker;
}

function windowHeight() {
  // Standard browsers (Mozilla, Safari, etc.)
  if (self.innerHeight) {
    return self.innerHeight;
  }
  // IE 6
  if (document.documentElement && document.documentElement.clientHeight) {
   return document.documentElement.clientHeight;
  }
  // IE 5
  if (document.body) {
    return document.body.clientHeight;
  }
  // Just in case. 
  return 0;
}

function handleResize() {
  var height = windowHeight() - document.getElementById('toolbar').offsetHeight - 30;
  document.getElementById('map').style.height = height + 'px';
  document.getElementById('sidebar').style.height = height + 'px';
}

function init() {
  handleResize();
	
  map = new GMap(document.getElementById("map"));
  map.addControl(new GSmallMapControl());
  map.setCenter(new GLatLng(centerLatitude, centerLongitude), startZoom);
  map.addControl(new GMapTypeControl());

  manager = new MarkerManager(map);
	
  // This is a sorting trick, don't worry too much about it.
  markers.sort(function(a, b) { return (a.abbr > b.abbr) ? +1 : -1; }); 
	
  batch = [];
  for(id in markers) {
    batch.push(createMarker(markers[id]));
  }
  manager.addMarkers(batch, 11);
  manager.refresh();
}

window.onresize = handleResize;
window.onload = init;
window.onunload = GUnload;
