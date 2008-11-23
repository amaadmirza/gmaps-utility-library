/**
 * @name SnapToRoute
 * @version 1.0
 * @copyright (c) 2008 SWIS BV - www.geostart.nl
 * @author Bjorn Brala (www.geostart.nl), Marcelo (maps.forum.nu), Bill Chadwick
 * @fileoverview This class is used to snap a marker to closest point on a line,
 *   based on the current position of the cursor.
 *   <!--  
 *   This is based on Marcelo's <a href="http://maps.forum.nu/gm_mouse_dist_to_line.html">
 *   "Distance to line" example</a>
 *   Work was done by Björn Brala to wrap the algorithm in a class operating on Maps API objects,
 *   and by Bill Chadwick to factor the basic algorithm out of the class and add distance along line
 *   to nearest point calculation.
 *   -->
 */


/**
 * @constructor
 * @desc Creates a new SnapToRoute that will snap the marker to the route.
 * @param {GMap2} map Map to assign listeners to.
 * @param {GMarker} marker Marker to move along the route.
 * @param {GPolyline} polyline The line the marker should snap to.
 */
function SnapToRoute(map, marker, polyline) {
  this.routePixels_ = [];
  this.normalProj_ = G_NORMAL_MAP.getProjection();    
  this.map_ = map;
  this.marker_ = marker;
  this.polyline_ = polyline;

  this.init_();
}


/**
 * Initialize the objects.
 * @private
 */ 
SnapToRoute.prototype.init_ = function () {
  this.loadLineData_();
  this.loadMapListener_();    
};


/**
 * Change the marker and/or polyline used by the class.
 * @param {GMarker} marker Optional marker to move along the route, 
 *   or null if you do not want to change that target.
 * @param {GPolyline} polyline Optional line to snap to, 
 *   or null if you do not want to change that target.
 */
SnapToRoute.prototype.updateTargets = function (marker, polyline) {
  this.marker_ = marker || this.marker_;
  this.polyline_ = polyline || this.polyline_;
  this.loadLineData_();
};


/**
 * Set up map listeners to calculate and update the marker position.
 * @private
 */
SnapToRoute.prototype.loadMapListener_ = function () {
  var me = this;
  GEvent.addListener(me.map_, 'mousemove', 
    GEvent.callback(me, me.updateMarkerLocation_));
  GEvent.addListener(me.map_, 'zoomend', 
    GEvent.callback(me, me.loadLineData_));
};


/**
 * Load route pixels into array for calculations. 
 * This needs to be calculated whenever zoom changes 
 * @private
 */
SnapToRoute.prototype.loadLineData_ = function () {
  var zoom = this.map_.getZoom();
  this.routePixels_ = [];
  for (var i = 0; i < this.polyline_.getVertexCount(); i++) {
    var Px = this.normalProj_.fromLatLngToPixel(this.polyline_.getVertex(i), zoom);
    this.routePixels_.push(Px);
  }
};


/**
 * Handle the move listener output and move the given marker.
 * @param {GLatLng} mouseLatLng
 * @private
 */
SnapToRoute.prototype.updateMarkerLocation_ = function (mouseLatLng) {
  var markerLatLng = this.getClosestLatLng(mouseLatLng);
  this.marker_.setLatLng(markerLatLng);
};


/**
 * Calculate closest lat/lng on the polyline to a test lat/lng.
 * @param {GLatLng} latlng The coordinate to test.
 * @return {GLatLng} The closest coordinate.
 */
SnapToRoute.prototype.getClosestLatLng = function (latlng) {
  var r = this.distanceToLines_(latlng);
  return this.normalProj_.fromPixelToLatLng(new GPoint(r.x, r.y), this.map_.getZoom());
};


/**
 * Get the distance (in meters) along the polyline 
 * of the closest point on route to test lat/lng.
 * @param {GLatLng} [latlng] Optional test lat/lng - 
 *   If not provided, the marker's lat/lng is used instead.
 * @return {Number} Distance in meters;
 */
SnapToRoute.prototype.getDistAlongRoute = function (latlng) {
  if (typeof(opt_latlng) === 'undefined') {
    latlng = this.marker_.getLatLng();
  }

  var r = this.distanceToLines_(latlng);
  return this.getDistToLine_(r.i, r.to);
};


/**
 * Gets test pixel and then calls fundamental algorithm.
 * @param {GLatLng} mouseLatLng
 * @private
 */
SnapToRoute.prototype.distanceToLines_ = function (mouseLatLng) {
  var zoom = this.map_.getZoom();
  var mousePx = this.normalProj_.fromLatLngToPixel(mouseLatLng, zoom);
  var routePixels_ = this.routePixels_;
  return this.getClosestPointOnLines_(mousePx, routePixels_);
};


/**
 * Finds distance along route to point of nearest test point.
 * @param {GPolyline} line
 * @param {Number} to
 * @private
 */
SnapToRoute.prototype.getDistToLine_ = function (line, to) {
  var routeOverlay = this.polyline_;
  var d = 0;
  for (var n = 1; n < line; n++) {
    d += routeOverlay.getVertex(n - 1).distanceFrom(routeOverlay.getVertex(n));
  }
  d += routeOverlay.getVertex(line - 1).distanceFrom(routeOverlay.getVertex(line)) * to;
  
  return d;
};

/**
 * Static function. Find point on lines nearest test point
 * test point pXy with properties .x and .y
 * lines defined by array aXys with nodes having properties .x and .y 
 * return is object with .x and .y properties and property i indicating nearest segment in aXys 
 * and property from the fractional distance of the returned point from aXy[i-1]
 * and property to the fractional distance of the returned point from aXy[i]    
 * @param {Object} pXy
 * @param {Array<Point>} aXys
 * @private
 */
SnapToRoute.prototype.getClosestPointOnLines_ = function (pXy, aXys) {
  var minDist; 
  var to;
  var from;
  var x;
  var y;
  var i;
  var dist;

  if (aXys.length > 1) {
    for (var n = 1; n < aXys.length ; n++) {
      if (aXys[n].x !== aXys[n - 1].x) {
        var a = (aXys[n].y - aXys[n - 1].y) / (aXys[n].x - aXys[n - 1].x);
        var b = aXys[n].y - a * aXys[n].x;
        dist = Math.abs(a * pXy.x + b - pXy.y) / Math.sqrt(a * a + 1);
      } else {
        dist = Math.abs(pXy.x - aXys[n].x);
      }

      // length^2 of line segment 
      var rl2 = Math.pow(aXys[n].y - aXys[n - 1].y, 2) + Math.pow(aXys[n].x - aXys[n - 1].x, 2);

      // distance^2 of pt to end line segment
      var ln2 = Math.pow(aXys[n].y - pXy.y, 2) + Math.pow(aXys[n].x - pXy.x, 2);

      // distance^2 of pt to begin line segment
      var lnm12 = Math.pow(aXys[n - 1].y - pXy.y, 2) + Math.pow(aXys[n - 1].x - pXy.x, 2);   

      // minimum distance^2 of pt to infinite line
      var dist2 = Math.pow(dist, 2);

      // calculated length^2 of line segment
      var calcrl2 = ln2 - dist2 + lnm12 - dist2;

      // redefine minimum distance to line segment (not infinite line) if necessary
      if (calcrl2 > rl2) {
        dist = Math.sqrt(Math.min(ln2, lnm12));
      }

      if ((minDist == null) || (minDist > dist)) {
        to  = Math.sqrt(lnm12 - dist2) / Math.sqrt(rl2);
        from = Math.sqrt(ln2 - dist2) / Math.sqrt(rl2);
        minDist = dist;
        i = n;
      }
    } 

    if (to > 1) {
      to = 1;
    }

    if (from > 1) {
      to = 0;
      from = 1;
    }

    var dx = aXys[i - 1].x - aXys[i].x;
    var dy = aXys[i - 1].y - aXys[i].y;

    x = aXys[i - 1].x - (dx * to);
    y = aXys[i - 1].y - (dy * to);

  }

  return {'x': x, 'y': y, 'i': i, 'to': to, 'from': from};
}
