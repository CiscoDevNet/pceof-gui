define(['lodash'], function () {

    'use strict';

    function ConfigurationCtrl($scope, ConfigurationService, $mdDialog, ErrorHandlerService) {
        $scope.hideProgressBar();

        //params
        $scope.config = {
            nd: null,
            rp: null,
            fs: null,
            kafka: null,
            xrv: null
        };

        $scope.methods = {
            nd: 'NeighbourDiscovery',
            fs: null,//'FlowStatistic',
            rp: 'RegistrationParameters',
            kafka: null,
            xrv: null
        };

        $scope.section = {
            nd: 'loading',
            rp: 'loading',
            fs: 'loading',
            kafka: 'loading',
            xrv: 'loading'
        };

        // methods
        $scope.getCorrectValueView = getCorrectValueView;
        $scope.init = init;
        $scope.openEditDialog = openEditDialog;



        $scope.init();

        /**
         * Initialization
         */
		function init(){

            for (var prop in $scope.methods) {
                if (!$scope.methods.hasOwnProperty(prop) || $scope.methods[prop] === null) {
                    continue;
                }

                ConfigurationService['get' + $scope.methods[prop]](prop, function(data, type){
                    $scope.config[type] = data;
                    $scope.section[type] = 'data';
                },function(err, type){
                    $scope.section[type] = 'no-data';
                    console.warn('WARNING :: no configuration found - ', err);
                });
            }

		}

        /**
         * MEthod for opening modal win for editting configuration
         * @param type
         */
        function openEditDialog(type){
            $mdDialog.show({
                clickOutsideToClose: true,
                controller: 'ConfigurationModalCtrl',
                templateUrl: 'app/modules/pce/views/modals/dialog_config.tpl.html',
                parent: angular.element(document.body),
                locals: {
                    data:{
                        config: $scope.config[type] ? $scope.config[type] : {},
                        type: type,
                        method: $scope.methods[type]
                    }
                }
            }).then(function(data) {
                //console.log('data', data, type);

                $scope.config[type] = _.cloneDeep(data);
                $scope.section[type] = 'data';
            });
        }

        function getCorrectValueView(val){
            return Array.isArray(val) ? val.join(',') : val;
        }



    }

	ConfigurationCtrl.$inject=['$scope', 'ConfigurationService', '$mdDialog', 'ErrorHandlerService'];

    return ConfigurationCtrl;
});
