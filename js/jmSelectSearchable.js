'use strict';


angular.module('jmSelectSearchable', []).directive('jmSelectSearchable', function() {
               return {
                 templateUrl: './partials/selectSearchable.html',
                 restrict:    'AE',
                 scope:       {
                   objects:    "=",
                   ngModel:    "=",
                   printAttrs: "@"
                 },
                 compile:     function(element, tAttrs) {
                   tAttrs.printAttrs = tAttrs.printAttrs.replace(/{{/g, '[[');
                   tAttrs.printAttrs = tAttrs.printAttrs.replace(/}}/g, ']]');
                 },
                 controller:  function($scope, $interpolate) {
                   $scope.setObject = function(object) {
                     $scope.ngModel = object;
                     $scope.show_list = false;
                     $scope.search = '';
                   };

                   $scope.getItemString = function(item) {
                     if (angular.isUndefined(item)) {
                       return '';
                     }
                     if (!$scope.printAttrs || !angular.isString($scope.printAttrs)) {
                       return '';
                     }
                     else {
                       $scope.printAttrs = $scope.printAttrs.replace(/\[\[/g, '{{');
                       $scope.printAttrs = $scope.printAttrs.replace(/\]\]/g, '}}');
                     }
                     return $interpolate($scope.printAttrs)(item);
                   };
                 }
               };
             });

