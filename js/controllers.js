'use strict';

/**
 * Main controller
 * @param $scope
 * @param $overpass
 * @constructor
 */
function IndexCtrl($scope, $overpass) {

    // default value for the map
    $scope.defaults = { minZoom: 14};

    // Default location for map
    $scope.bounds = { northEast: { lat: 47.2178, lng: -1.5496 }, southWest: { lat: 47.2178, lng:-1.5496 } };

    // get user location
    navigator.geolocation.getCurrentPosition(function(position) {
        $scope.bounds = { northEast: { lat: position.coords.latitude, lng:  position.coords.longitude }, southWest: { lat: position.coords.latitude, lng:  position.coords.longitude } };
    });

    // populate amenities select
    $overpass.amenities().then(function(datas){
       $scope.amenities = datas;

        // default amenity map
        $scope.amenity = $scope.amenities[0];

        // query !
        $overpass.query(
                $scope.bounds.northEast.lat,
                $scope.bounds.northEast.lng,
                $scope.bounds.southWest.lat,
                $scope.bounds.southWest.lng,
                $scope.amenity.key).then(function(datas){
                $scope.geojson = datas;
            });

        // watch change on amenity
        $scope.$watch('amenity', function(newValue, oldValue) {
            // query !
            $overpass.query(
                    $scope.bounds.northEast.lat,
                    $scope.bounds.northEast.lng,
                    $scope.bounds.southWest.lat,
                    $scope.bounds.southWest.lng,
                    $scope.amenity.key).then(function(datas){
                    $scope.geojson = datas;
                });
        });
        // watch change on bounds
        $scope.$watch('bounds', function(newValue, oldValue) {
            $overpass.query(
                    $scope.bounds.northEast.lat,
                    $scope.bounds.northEast.lng,
                    $scope.bounds.southWest.lat,
                    $scope.bounds.southWest.lng,
                    $scope.amenity.key).then(function(datas){
                    $scope.geojson = datas;
                });
        });

    });

}

/*
 * Error.
 */
function ErrorCtrl() {
}