function ExtMapTypeControl(opt_opts){this.options=opt_opts||{}};ExtMapTypeControl.prototype=new GControl();ExtMapTypeControl.prototype.initialize=function(map){var container=document.createElement("div");var me=this;var mapTypes=map.getMapTypes();var mapTypeDivs=me.addMapTypeButtons_(map);GEvent.addListener(map,"addmaptype",function(){var newMapTypes=map.getMapTypes();var newMapType=newMapTypes.pop();var newMapTypeDiv=me.createButton_(newMapType.getName());newMapTypeDiv.setAttribute('title',newMapType.getAlt());mapTypes.push(newMapType);mapTypeDivs.push(newMapTypeDiv);me.resetButtonEvents_(map,mapTypeDivs);container.appendChild(newMapTypeDiv)});GEvent.addListener(map,"removemaptype",function(){for(var i=0;i<mapTypeDivs.length;i++){GEvent.clearListeners(mapTypeDivs[i],"click");container.removeChild(mapTypeDivs[i])}mapTypeDivs=me.addMapTypeButtons_(map);me.resetButtonEvents_(map,mapTypeDivs);for(var i=0;i<mapTypeDivs.length;i++){container.appendChild(mapTypeDivs[i])}});if(me.options.showTraffic){var trafficDiv=me.createButton_("Traffic");trafficDiv.setAttribute('title','Show Traffic');trafficDiv.style.marginRight="8px";trafficDiv.style.visibility='hidden';trafficDiv.firstChild.style.cssFloat="left";trafficDiv.firstChild.style.styleFloat="left";me.trafficInfo=new GTrafficOverlay({hide:true});me.trafficInfo.hidden=true;GEvent.addListener(me.trafficInfo,"changed",function(hasTrafficInView){if(hasTrafficInView){trafficDiv.style.visibility='visible'}else{trafficDiv.style.visibility='hidden'}});map.addOverlay(me.trafficInfo);GEvent.addDomListener(trafficDiv.firstChild,"click",function(){if(me.trafficInfo.hidden){me.trafficInfo.hidden=false;me.trafficInfo.show()}else{me.trafficInfo.hidden=true;me.trafficInfo.hide()}me.toggleButton_(trafficDiv.firstChild,!me.trafficInfo.hidden)});if(me.options.showTrafficKey){keyDiv=document.createElement("div");keyDiv.style.cssFloat="left";keyDiv.style.styleFloat="left";keyDiv.innerHTML="&nbsp;?&nbsp;";var keyExpandedDiv=document.createElement("div");keyExpandedDiv.style.clear="both";keyExpandedDiv.style.padding="2px";var keyInfo=[{"color":"#30ac3e","text":"&gt; 50 MPH"},{"color":"#ffcf00","text":"25-50 MPH"},{"color":"#ff0000","text":"&lt; 25 MPH"},{"color":"#c0c0c0","text":"No data"}];for(var i=0;i<keyInfo.length;i++){keyExpandedDiv.innerHTML+="<div style='text-align: left'><span style='background-color: "+keyInfo[i].color+"'>&nbsp;&nbsp</span>"+"<span style='color: "+keyInfo[i].color+"'> "+keyInfo[i].text+" </span>"+"</div>"}keyExpandedDiv.style.display="none";GEvent.addDomListener(keyDiv,"click",function(){if(me.keyExpanded){me.keyExpanded=false;keyExpandedDiv.style.display="none"}else{me.keyExpanded=true;keyExpandedDiv.style.display="block"}me.toggleButton_(keyDiv,me.keyExpanded)});me.toggleButton_(keyDiv,me.keyExpanded)}var separatorDiv=document.createElement("div");separatorDiv.style.clear="both";if(me.options.showTrafficKey)trafficDiv.appendChild(keyDiv);trafficDiv.appendChild(separatorDiv);if(me.options.showTrafficKey)trafficDiv.appendChild(keyExpandedDiv);me.toggleButton_(trafficDiv.firstChild,false);container.appendChild(trafficDiv)}for(var i=0;i<mapTypeDivs.length;i++){container.appendChild(mapTypeDivs[i])}map.getContainer().appendChild(container);return container};ExtMapTypeControl.prototype.addMapTypeButtons_=function(map){var me=this;var mapTypes=map.getMapTypes();var mapTypeDivs=new Array();for(var i=0;i<mapTypes.length;i++){mapTypeDivs[i]=me.createButton_(mapTypes[i].getName());mapTypeDivs[i].setAttribute('title',mapTypes[i].getAlt())}me.resetButtonEvents_(map,mapTypeDivs);return mapTypeDivs};ExtMapTypeControl.prototype.resetButtonEvents_=function(map,mapTypeDivs){var me=this;var mapTypes=map.getMapTypes();for(var i=0;i<mapTypeDivs.length;i++){var otherDivs=new Array;for(var j=0;j<mapTypes.length;j++){if(j!=i){otherDivs.push(mapTypeDivs[j])}}me.assignButtonEvent_(mapTypeDivs[i],map,mapTypes[i],otherDivs)}GEvent.addListener(map,"maptypechanged",function(){var divIndex=0;var mapType=map.getCurrentMapType();for(var i=0;i<mapTypes.length;i++){if(mapTypes[i]==mapType){divIndex=i}}GEvent.trigger(mapTypeDivs[divIndex],"click")})};ExtMapTypeControl.prototype.createButton_=function(text){var buttonDiv=document.createElement("div");this.setButtonStyle_(buttonDiv);buttonDiv.style.cssFloat="left";buttonDiv.style.styleFloat="left";var textDiv=document.createElement("div");textDiv.appendChild(document.createTextNode(text));textDiv.style.width="6em";buttonDiv.appendChild(textDiv);return buttonDiv};ExtMapTypeControl.prototype.assignButtonEvent_=function(div,map,mapType,otherDivs){var me=this;GEvent.addDomListener(div,"click",function(){for(var i=0;i<otherDivs.length;i++){me.toggleButton_(otherDivs[i].firstChild,false)}me.toggleButton_(div.firstChild,true);map.setMapType(mapType)})};ExtMapTypeControl.prototype.toggleButton_=function(div,boolCheck){div.style.fontWeight=boolCheck?"bold":"";div.style.border="1px solid white";var shadows=boolCheck?["Top","Left"]:["Bottom","Right"];for(var j=0;j<shadows.length;j++){div.style["border"+shadows[j]]="1px solid #b0b0b0"}};ExtMapTypeControl.prototype.getDefaultPosition=function(){return new GControlPosition(G_ANCHOR_TOP_RIGHT,new GSize(7,7))};ExtMapTypeControl.prototype.setButtonStyle_=function(button){button.style.color="#000000";button.style.backgroundColor="white";button.style.font="small Arial";button.style.border="1px solid black";button.style.padding="0px";button.style.margin="0px";button.style.textAlign="center";button.style.fontSize="12px";button.style.cursor="pointer"};
