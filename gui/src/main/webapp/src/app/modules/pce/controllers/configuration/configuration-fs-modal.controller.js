define(['lodash'], function () {

    'use strict';

    function ConfigurationFsModalCtrl($scope) {
        //params
        //console.info('INFO :: $scope.config - ', $scope.config);
        $scope.statsList = {
            ports: false,
            groups: false,
            flows: false,
            queues: false,
            meters: false
        };
        //methods
        $scope.init = init;
        $scope.updateConfigIncStats = updateConfigIncStats;

        /**
         * Initialization
         */
        function init(){
            updateIncStatsStates();
        }

        /**
         * Update stats list object by real config values
         */
        function updateIncStatsStates(){
            if ( $scope.config['included-stats'] ) {

                $scope.config['included-stats'].forEach(function (stat) {
                    if ( !angular.isUndefined($scope.statsList[stat]) ){
                        $scope.statsList[stat] = true;
                    }
                });

                //console.info('INFO :: update config stats obj - ',$scope.statsList);
            }
        }

        /**
         * Update config inc stats array by stats list obj
         * @param type
         */
        function updateConfigIncStats(type){

            if ( $scope.statsList[type] && $scope.config['included-stats'].indexOf(type) === -1 ){
                $scope.config['included-stats'].push(type);
            } else {
                if ( !$scope.statsList[type] ) {
                    $scope.config['included-stats'].splice($scope.config['included-stats'].indexOf(type), 1);
                }
            }

            //console.info('INFO :: $scope.config[\'included-stats\'] - ', $scope.config['included-stats']);
        }

        $scope.init();
    }

    ConfigurationFsModalCtrl.$inject=['$scope'];

    return ConfigurationFsModalCtrl;
});
