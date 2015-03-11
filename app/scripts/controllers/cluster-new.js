/* global define */
(function() {
    'use strict';
    define(['lodash', 'helpers/cluster-helpers'], function(_, ClusterHelpers) {

        var ClusterNewController = function($scope, $modal, $location, ClusterService, UtilService) {
            this.step = 1;
            var self = this;
            this.clusterTypes = ClusterHelpers.getClusterTypes();
            this.clusterType = this.clusterTypes[0];

            this.storageTypes = ClusterHelpers.getStorageTypes();
            this.storageType = this.storageTypes[0];

            this.hosts = [];
            this.hosts.push({isDummy:true, isNew:true, isEdit:false});

            this.onAddRow = function(host) {
                host.isDummy = false;
                host.isEdit = true;
                host.isMon = false;
                this.hosts.push({isDummy:true, isNew:true, isEdit:false});
            }

            this.updateFingerprint = function(host) {
                UtilService.getIpAddress(host.hostname)
                .then(function(ipaddress){
                    host.ipaddress = ipaddress;
                    return UtilService.getSshFingerprint(host.ipaddress);
                })
                .then(function(fingerprint) {
                    host.fingerprint = fingerprint;
                });
            }

            this.onEditHost = function(host) {
                host.isEdit = true;
            }

            this.onSaveHost = function(host) {
                host.isEdit = false;
            }

            this.onRemoveHost = function(host) {
                _.remove(this.hosts, function(currenthost) {
                    return !currenthost.isDummy && currenthost.hostname === host.hostname;
                });
            }

            this.moveStep = function(nextStep) {
                this.step = this.step + nextStep;
            };

            this.isCancelAvailable = function() {
                return this.step === 1;
            };

            this.isSubmitAvailable = function() {
                return this.step === 4;
            };

            this.cancel = function() {
                $location.path('/clusters');
            };

            this.submit = function() {
                var hosts = [];
                _.forEach(this.hosts, function(host){
                    if(!host.isDummy) {
                        var node_type = self.clusterType.id === 1 ? 4 : (host.isMon ? 1 : 2);
                        var localhost = {
                            node_name: host.hostname,
                            management_ip: host.ipaddress,
                            cluster_ip: host.ipaddress,
                            public_ip: host.ipaddress,
                            ssh_username: host.username,
                            ssh_password: host.password,
                            ssh_key_fingerprint: host.fingerprint,
                            ssh_port: 22,
                            node_type: node_type
                        };
                        hosts.push(localhost);
                    }
                });

                var cluster = {
                    cluster_name: this.clusterName,
                    cluster_type: this.clusterType.id,
                    storage_type: this.storageType.id,
                    nodes: hosts
                };
                ClusterService.create(cluster).then(function(result) {
                    console.log(result);
                    $location.path('/clusters');
                });
            };
        };
        return ['$scope', '$modal', '$location', 'ClusterService', 'UtilService', ClusterNewController];
    });
})();