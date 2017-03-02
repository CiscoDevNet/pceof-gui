define([''], function () {

    'use strict';

    function FlowManagementCtrl($q, $scope, NetworkService, FlowManagementService, ErrorHandlerService) {

        //get data from controller and create network object with wraping
        NetworkService.getNetwork(function(networkObj){
            $scope.showProgressBar();

            $scope.network = networkObj;
            $scope.devices = $scope.network.getDevicesForTable();
            $scope.flows = {};

            var promiseList = [],
                operationalData = [],
                configData = [],
                assignOperationalData = function(data) {
                    operationalData = data;
                },
                assignConfigData = function(data) {
                    configData = data;
                };

            promiseList.push(FlowManagementService.getFlowsByType('operational', assignOperationalData,
				function(err){
					ErrorHandlerService.log(err, true);
				}));

            promiseList.push(FlowManagementService.getFlowsByType('config', assignConfigData,
				function(err){
					ErrorHandlerService.log(err, true);
				}));

            $q.all(promiseList).then(function () {
				// TODO: it throws an error if there's no data in a chosen datastore
                FlowManagementService.assignFlowsToDevices(configData, $scope.flows, 'config');
                FlowManagementService.assignFlowsToDevices(operationalData, $scope.flows, 'operational');
                $scope.devices.forEach(function(device){
                    device.setFlowsTypeCount($scope.flows);
                });
                $scope.hideProgressBar();
            });

        }, function(){
            $scope.hideProgressBar();
        });

        $scope.filter = {
            options: {
                debounce: 500
            },
            show : false
        };

        $scope.query = {
            order: 'id',
            limit: 25,
            page: 1,
            filter: ''
        };

        $scope.options = {
            boundaryLinks: true,
            pageSelector: true,
            rowSelection: true,
            autoSelect: false
        };

        $scope.removeFilter = function () {
            $scope.filter.show = false;
            $scope.query.filter = '';

            if($scope.filter.form.$dirty) {
              $scope.filter.form.$setPristine();
            }
        };

    }

    FlowManagementCtrl.$inject=['$q', '$scope', 'NetworkService', 'FlowManagementService', 'ErrorHandlerService'];

    return FlowManagementCtrl;
});
