define(['lodash'], function () {

    'use strict';

    function ConfigurationModalCtrl($scope, $mdDialog, data, ConfigurationService, ErrorHandlerService) {
        //params

        console.log('data', data);

        $scope.modalPath = 'app/modules/pce/views/modals/config-parts/';
        $scope.type = data.type;
        $scope.configMethod = data.method;
        $scope.config = _.cloneDeep(data.config);
        $scope.showProgressBar = false;

        //methods
        $scope.closeDialog = closeDialog;
        $scope.saveData = saveData;

        function saveData(type){//NeighbourDiscovery
            $scope.showProgressBar = true;
            ConfigurationService['put'+type]($scope.config, function(){
                $scope.showProgressBar = false;
                $mdDialog.hide($scope.config);
            },function (err) {
                $scope.showProgressBar = false;
                ErrorHandlerService.log(err, true);
                //console.warn('WARNING :: error save neighbour-discovery config - ', err);
            });
        }

        function closeDialog() {
            $mdDialog.cancel();
        }


    }

    ConfigurationModalCtrl.$inject=['$scope', '$mdDialog', 'data', 'ConfigurationService'];

    return ConfigurationModalCtrl;
});
