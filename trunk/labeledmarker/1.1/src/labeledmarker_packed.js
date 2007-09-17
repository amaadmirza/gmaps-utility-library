function LabeledMarker(a,b){this.latlng_=a;this.opts_=b;this.labelText_=b.labelText||"";this.labelClass_=b.labelClass||"LabeledMarker_markerLabel";this.labelOffset_=b.labelOffset||new GSize(0,0);this.clickable_=b.clickable||true;this.title_=b.title||"";this.labelVisibility_=true;if(b.draggable){b.draggable=false}GMarker.apply(this,arguments)}
LabeledMarker.prototype=new GMarker(new GLatLng(0,0));
LabeledMarker.prototype.initialize=function(c){GMarker.prototype.initialize.apply(this,arguments);this.map_=c;this.div_=document.createElement("div");this.div_.className=this.labelClass_;this.div_.innerHTML=this.labelText_;this.div_.style.position="absolute";this.div_.style.cursor="pointer";this.div_.title=this.title_;c.getPane(G_MAP_MARKER_PANE).appendChild(this.div_);if(this.clickable_){function newEventPassthru(a,b){return function(){GEvent.trigger(a,b)}}var d=['click','dblclick','mousedown','mouseup','mouseover','mouseout'];for(var i=0;i<d.length;i++){var e=d[i];GEvent.addDomListener(this.div_,e,newEventPassthru(this,e))}}}
LabeledMarker.prototype.redraw=function(a){GMarker.prototype.redraw.apply(this,arguments);var p=this.map_.fromLatLngToDivPixel(this.latlng_);var z=GOverlay.getZIndex(this.latlng_.lat());this.div_.style.left=(p.x+this.labelOffset_.width)+"px";this.div_.style.top=(p.y+this.labelOffset_.height)+"px";this.div_.style.zIndex=z}
LabeledMarker.prototype.remove=function(){GEvent.clearInstanceListeners(this.div_);if(this.div_.outerHTML){this.div_.outerHTML=""}this.div_.parentNode.removeChild(this.div_);this.div_=null;GMarker.prototype.remove.apply(this,arguments)}
LabeledMarker.prototype.copy=function(){return new LabeledMarker(this.latlng_,this.opt_opts_)}
LabeledMarker.prototype.show=function(){GMarker.prototype.show.apply(this,arguments);if(this.labelVisibility_){this.showLabel()}else{this.hideLabel()}}
LabeledMarker.prototype.hide=function(){GMarker.prototype.hide.apply(this,arguments);this.hideLabel()}
LabeledMarker.prototype.setLabelVisibility=function(a){this.labelVisibility_=a;if(!this.isHidden()){if(this.labelVisibility_){this.showLabel()}else{this.hideLabel()}}}
LabeledMarker.prototype.getLabelVisibility=function(){return this.labelVisibility_}
LabeledMarker.prototype.hideLabel=function(){this.div_.style.visibility='hidden'}
LabeledMarker.prototype.showLabel=function(){this.div_.style.visibility='visible'}
