define([], function () {
    'use strict';

    function WizardService($filter, Restangular) {
        this.getConfig = getConfig;

        /**
         * Implementation
         */


        function getConfig(configName, filter, successCbk) {
            var config = Restangular.oneUrl('config','./app/modules/pce/data/' + configName + '.json');
            return config.get().then(function (response) {
                if ( response.steps ) {
                    var data = filterConfig(filter, response.steps);
                    successCbk(data);
                } else {
                    console.warn('INFO :: couldn\'t load wizard config file');
                }

            }, function () {
                console.warn('INFO :: couldn\'t load wizard config file');
            });
        }

        function filterConfig(filter, config) {
            if(!filter) {
                return config;
            }

            return config.filter(function(step) {
                if(step['visible-value'].indexOf(filter) >= 0) {
                    return step;
                }
            });
        }
    }

    WizardService.$inject=['$filter', 'Restangular'];

    return WizardService;

});
