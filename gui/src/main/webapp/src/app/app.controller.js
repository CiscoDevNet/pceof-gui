define(['app/app.module'], function (app) {
    'use strict';

    app
        .register
        .controller('AppCtrl', AppCtrl);

    function AppCtrl($scope, $window) {

        console.debug('app ctrl');

        if ((!/chrom(e|ium)/.test($window.navigator.userAgent.toLowerCase())) && (!/firefox/.test($window.navigator.userAgent.toLowerCase()))){
            alert("Browser not supported. For best results, use Chrome browser or Firefox 34.0.0 and above.");
        }

        $scope.broadcastFromRoot = function(bcName, data){
            $scope.$broadcast(bcName, data);
        };

    }
});
