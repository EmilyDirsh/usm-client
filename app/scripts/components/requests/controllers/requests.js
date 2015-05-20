/* global define */
(function() {
    'use strict';
    define(['lodash'], function(_) {
        var RequestsController = function($scope, $interval, UserService, RequestTrackingService, ServerService) {
            $scope.tasks = [];
            $scope.discoveredHosts = [];
            $scope.reloadTasks = function() {
                RequestTrackingService.getTrackedRequests().then(function(tasks) {
                    $scope.tasks = tasks;
                });
            }
            $scope.reloadDiscoveredHosts = function() {
                ServerService.getDiscoveredHosts().then(function(freeHosts) {
                   $scope.discoveredHosts = freeHosts;
                });
            }

            $scope.logoutUser = function()   {
                var test = UserService.logout();
            }

            $interval($scope.reloadTasks, 5000);
            $interval($scope.reloadDiscoveredHosts, 5000);
        };
        return ['$scope', '$interval', 'UserService', 'RequestTrackingService', 'ServerService', RequestsController];
    });
})();
