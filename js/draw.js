
var saveStrategy = new OpenLayers.Strategy.Save();

//empty map, bounds are test-layer bounds (EPSG:32633)
map = new OpenLayers.Map({
    div: "map",
    allOverlays: true,
    maxExtent: new OpenLayers.Bounds(
    653237.69439077,1519879.063165,655229.57939001,1520825.6733868
    )
    });

//WFS-Layer for editable data
var teig = new OpenLayers.Layer.Vector("Editable polygon", {
    strategies: [new OpenLayers.Strategy.Fixed(), saveStrategy],
    protocol: new OpenLayers.Protocol.WFS({
    url: "http://..../wfs", // wfs url on server
    featurePrefix: 'testkf',
    featureNS: "http://.../testkf", // Namespace URI for server
    featureType: "test",
    geometryName: "geom",
    })
});

map.addLayer(teig);

//Toolbar:
    var panel = new OpenLayers.Control.Panel(
    {'displayClass': 'customEditingToolbar'}
    );

    var navigate = new OpenLayers.Control.Navigation({
    title: "Pan Map"
    });

    var draw = new OpenLayers.Control.DrawFeature(
    test, OpenLayers.Handler.Polygon,
    {
    title: "Draw Feature",
    displayClass: "olControlDrawFeaturePolygon",
    multi: true
    }
    );

    var edit = new OpenLayers.Control.ModifyFeature(teig, {
    title: "Modify Feature",
    displayClass: "olControlModifyFeature"
    });

    var save = new OpenLayers.Control.Button({
    title: "Save Changes",
    trigger: function() {
    if(edit.feature) {
    edit.selectControl.unselectAll();
    }
    saveStrategy.save();
    },
    displayClass: "olControlSaveFeatures"
    });


panel.addControls([save, edit, draw, navigate]);
panel.defaultControl = navigate;
map.addControl(panel);
map.addControl(new OpenLayers.Control.LayerSwitcher());
map.zoomToMaxExtent();
