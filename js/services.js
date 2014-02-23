'use strict';

var overpassUrl = 'http://overpass-api.de/api/interpreter';
var templateQuery = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><osm-script output=\"json\" timeout=\"25\"><query type=\"node\"><has-kv k=\"amenity\" v=\"@@amenity@@\"/><bbox-query s=\"@@SWlat@@\" w=\"@@SWlng@@\" n=\"@@NElat@@\" e=\"@@NElng@@\"/></query><print mode=\"body\"/></osm-script>";

var bindPopup = function (feature, layer) {
    layer.bindPopup(JSON.stringify(feature.properties));
};
/* Overpass services */
angular.module('overpass', [ ])
    /* Overpass service*/
    .factory('$overpass', function($http, $location, $rootScope){
        return {
            query:function(NElat, NElng, SWlat, SWlng, amenity ){
                if(typeof amenity != 'undefined') {
                    var query = Mustache.render(amenity.query, { "sw_lat": SWlat, "sw_lng": SWlng, "ne_lat": NElat, "ne_lng": NElng} )
                    return $http.post(overpassUrl, query).then(function (response){
                        if( response.status == 200 ){
                            // transorfom JSON to GEOJSON
                            var geoNodes = response.data.elements.map(function(node) {
                                return {type: "Feature", geometry: {type: "Point", coordinates: [ node.lon , node.lat ]}, properties: node.tags};
                            });
                            var geoJson = {
                                data:
                                    {
                                        type: "FeatureCollection",
                                        features: geoNodes
                                    },
                                resetStyleOnMouseout: true,
                                onEachFeature : function (feature, layer) {
                                    layer.bindPopup(Mustache.render(amenity.template, feature.properties));
                                }
                            };
                            return geoJson;
                        } else {
                            $rootScope.error = "Error";
                            $location.path('/error');
                        }
                    })
                } else {
                    return
                }
            },
            amenities:function(){
                return $http.get("./json/amenities.json").then(function (response){
                    if( response.status == 200 ){
                        return response.data;
                    } else {
                        $rootScope.error = "Error";
                        $location.path('/error');
                    }
                });
            }
        }
    });