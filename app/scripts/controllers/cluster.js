/* global define */
(function() {
    'use strict';
    define(['lodash'], function(_) {

        var ClusterController = function($location, $route, $scope, ClusterResolver, ClusterService, config, $modal, $http) {
            ClusterResolver.then(function() {
                if (ClusterService.clusterId === null) {
                    $location.path(config.getFirstViewPath());
                    return;
                }
                $scope.clusterDropdownTemplate = 'views/cluster-dropdown.html';
                $scope.selectedCluster = ClusterService.clusterModel;
                $scope.selectedCluster.id_short = ClusterService.clusterModel.id.substring(0, 8);

                ClusterService.getList().then(function(clusters) {
                    _.each(clusters, function(cluster){
                        cluster.id_short = cluster.id.substring(0, 8);
                    });
                    $scope.clusters = clusters;
                });
            });

            $scope.switchCluster = function(cluster) {
                if ($scope.selectedCluster && cluster.id === $scope.selectedCluster.id) {
                    return;
                }
                else {
                    // Remember the last cluster selection in localStorage
                    if(typeof(Storage)!=="undefined") {
                        localStorage.setItem('cluster', JSON.stringify(cluster.id));
                    }

                    $scope.selectedCluster = cluster;
                    ClusterService.switchCluster(cluster);
                    $route.reload();
                }
            }
        };
        return ['$location', '$route', '$scope', 'ClusterResolver', 'ClusterService', 'ConfigurationService', '$modal', '$http', ClusterController];
    });
})();
