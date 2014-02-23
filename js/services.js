'use strict';

var overpassUrl = 'http://api.openstreetmap.fr/oapi/interpreter';

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