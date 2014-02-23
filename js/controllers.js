'use strict';

/**
 * Main controller
 * @param $scope
 * @param $overpass
 * @constructor
 */
function IndexCtrl($rootScope, $scope, $overpass, $routeParams, $location) {
    var name = $routeParams.name || 'recycling';

    // default value for the map
    $scope.defaults = {
        minZoom: 14,
        tileLayer: 'http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/85317/256/{z}/{x}/{y}.png',
        icon: {
            url: './img/marker.png'
        }
    };

    if(typeof $rootScope.sessionBounds ==  'undefined') {

        // Default location for map
        $scope.bounds = { northEast: { lat: 47.2178, lng: -1.5496 }, southWest: { lat: 47.2178, lng:-1.5496 } };

        // get user location
        navigator.geolocation.getCurrentPosition(function(position) {
            $scope.bounds = { northEast: { lat: position.coords.latitude, lng:  position.coords.longitude }, southWest: { lat: position.coords.latitude, lng:  position.coords.longitude } };
        });
    }
    else {
        $scope.bounds = $rootScope.sessionBounds;
    }


    // populate amenities select
    $overpass.amenities().then(function(datas){
       $scope.amenities = datas;

        // default amenity map
        $scope.amenity = datas.filter(function(amenity){ return (amenity.key == name); })[0]

        // watch change on bounds
        $scope.$watch('bounds', function(newValue, oldValue) {
            $rootScope.sessionBounds = $scope.bounds;
            $overpass.query(
                    $scope.bounds.northEast.lat,
                    $scope.bounds.northEast.lng,
                    $scope.bounds.southWest.lat,
                    $scope.bounds.southWest.lng,
                    $scope.amenity).then(function(datas){
                    $scope.geojson = datas;
                });
        });

        // watch change on amenity
        $scope.$watch('amenity', function(newValue, oldValue) {
            if(newValue.key != oldValue.key)
                $location.url('/' + newValue.key);
        });

    });

}

/*
 * Error.
 */
function ErrorCtrl() {
}