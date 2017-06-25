//     var ge;
var currentKmlObjects = {
    'ecomuseo': null,
    'tin': null,
    'sic_riserve_plis': null,
    'parco_regionale_zps_': null,
    'designatori': null

};

// 	//var ge_strade = false;
//   //var ge_abitati = true;

//     google.load("earth", "1");

app = {}
function init() {
    app.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: {
            lat: 46.0267305,
            lng: 9.7666886,
        }
    });
}

function initCallback(pluginInstance) {
    ge = pluginInstance;
    ge.getWindow().setVisibility(true);

    //CONTROLLI CON FADE AUTOMATICO
    ge.getNavigationControl().setVisibility(ge.VISIBILITY_AUTO);

    //DISABILITO CONFINI E NOMI STRADE

    ge.getLayerRoot().enableLayerById(ge.LAYER_BORDERS, false);
    ge.getLayerRoot().enableLayerById(ge.LAYER_ROADS, false);

    //VOLA A BERGAMO
    var la = ge.createLookAt('');
    la.set(45.90320555826568, 9.856441382762,
        9, // altitude
        ge.ALTITUDE_RELATIVE_TO_GROUND,
        0, // heading
        0, // straight-down tilt
        50000 // range (inverse of zoom)
    );
    ge.getView().setAbstractView(la);




    // SE CHECKBOX = CHECKED DI DEFAULT, ABILITA SUBITO IL LAYER CORRISPONDENTE
    if (document.getElementById('kml-ecomuseo-check').checked)
        loadKml('ecomuseo');

    if (document.getElementById('kml-tin-check').checked)
        loadKml('tin');



    if (document.getElementById('kml-sic_riserve_plis-check').checked)
        loadKml('sic_riserve_plis');



    if (document.getElementById('kml-parco_regionale_zps_-check').checked)
        loadKml('parco_regionale_zps_');

    if (document.getElementById('kml-designatori-check').checked)
        loadKml('designatori');




    function eventHandler(event) {
        var text = event.getLatitude() + "," + event.getLongitude();

        // Prevent default balloon from popping up for marker placemarks
        event.preventDefault();

        // wrap alerts in API callbacks and event handlers
        // in a setTimeout to prevent deadlock in some browsers
        setTimeout(function() {
            // alert(text);
            var divcoordinate = document.getElementById("coordinate");
            divcoordinate.innerHTML = text;
        }, 0);
    }
    // listen to the click event on the globe and window
    google.earth.addEventListener(ge.getWindow(), 'mousemove', eventHandler);

}

function failureCallback(errorCode) {}

function toggleKml(file) {
    // remove the old KML object if it exists
    if (currentKmlObjects[file]) {
    	currentKmlObjects[file].setMap(null);
    	currentKmlObject = null;
    }
    // if the checkbox is checked, fetch the KML and show it on Earth
    var kmlCheckbox = document.getElementById('kml-' + file + '-check');
    if (kmlCheckbox.checked)
        loadKml(file);
    // document.getElementById('my_iframe').src = 'http://www.orobiemap.it/kmz/' + file + '.kml';
}

function loadKml(file) {

    var kmlObject = new google.maps.KmlLayer({
        url: 'https://unibg-gislab.github.io/orobiemap/kmz/' + file + '.kml',
        preserveViewport: false,
        map: app.map
    });
    // google.earth.fetchKml(ge, kmlUrl, function(kmlObject) {
    // NOTE: we still have access to the 'file' variable (via JS closures)

    if (kmlObject) {
        // show it on Earth
        currentKmlObjects[file] = kmlObject;
        // ge.getFeatures().appendChild(kmlObject);
    } else {
        // bad KML
        currentKmlObjects[file] = null;
        // wrap alerts in API callbacks and event handlers
        // in a setTimeout to prevent deadlock in some browsers
        setTimeout(function() {
            alert('Bad or null KML.');
        }, 0);

        // uncheck the box
        document.getElementById('kml-' + file + '-check').checked = '';
    }
};


function toggleStrade() {
    var kmlCheckbox = document.getElementById('kml-strade-check');
    if (kmlCheckbox.checked)
        ge.getLayerRoot().enableLayerById(ge.LAYER_ROADS, true);
    else
        ge.getLayerRoot().enableLayerById(ge.LAYER_ROADS, false);
}

function toggleConfini() {
    var kmlCheckbox = document.getElementById('kml-confini-check');
    if (kmlCheckbox.checked)
        ge.getLayerRoot().enableLayerById(ge.LAYER_BORDERS, true);
    else
        ge.getLayerRoot().enableLayerById(ge.LAYER_BORDERS, false);
} // JavaScript Document