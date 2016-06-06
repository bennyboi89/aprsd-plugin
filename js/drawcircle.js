//Using a icon for setting the IPP of the rescue mission
var defaultStyle = new OpenLayers.Style({
    externalGraphic:'${icon}',
    graphicHeight: 25,
    graphicWidth:  21,
    graphicXOffset:-12,
    graphicYOffset:-25
});
var styleMap = new OpenLayers.StyleMap({'default': defaultStyle });
var vectorLayer = new OpenLayers.Layer.Vector("Overlay",{styleMap: styleMap });

var aPoint  = new OpenLayers.Geometry.Point( lonLat.lon, lonLat.lat );

//Need to get missing value
//Sort out proper values for the radius
if (missing=="Dement"){
var aCircle = OpenLayers.Geometry.Polygon.createRegularPolygon( aPoint, 25000, 40, 0 );
} else if(missing=="Ungdom"){
var aCircle = OpenLayers.Geometry.Polygon.createRegularPolygon( aPoint, 50000, 40, 0 );
}else if(missing=="Gammel"){
var aCircle = OpenLayers.Geometry.Polygon.createRegularPolygon( aPoint, 30000, 40, 0 );
}else if(missing=="Middel"){
var aCircle = OpenLayers.Geometry.Polygon.createRegularPolygon( aPoint, 40000, 40, 0 );
}

var aCirclePoint = new OpenLayers.Geometry.Collection( [ aCircle, aPoint ] );
var aCirclePoint_feature = new OpenLayers.Feature.Vector( aCirclePoint );
aCirclePoint_feature.attributes = { icon:'/img/marker.png' }

vectorLayer.addFeatures( [ aCirclePoint_feature ] );
