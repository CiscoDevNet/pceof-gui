var modules = [
    'angular',
    'angular-route',
    'angular-animate',
    'angular-aria',
    'angular-material',
    'Restangular',
    'angular-material-data-table',
    'angular-json-tree',
    'i-multi-select',
    'app/common/filters.module',
    'app/modules/pce/pce.module',
    'angular-messages'
];

var e = [
    'ngRoute',
    'ngAnimate',
    'ngAria',
    'ngMaterial',
    'restangular',
    'md.data.table',
    'angular-json-tree',
    'isteven-multi-select',
    'app.filters',
    'app.pce',
    'ngMessages'
];

define(modules,
	function (angular) {
		"use strict";

		angular
            .module('app', e)
            .config(config);
        
        function config($routeProvider, $mdThemingProvider, RestangularProvider){

            $mdThemingProvider.theme('default')
                .primaryPalette('blue')
                .accentPalette('light-blue');

            $routeProvider
                .when('/pce/:page', {
                    templateUrl: 'app/modules/pce/views/index.tpl.html',
                    controller: 'PceCtrl'
                })
                .otherwise({redirectTo:'/pce/topology'});
            
            RestangularProvider.setBaseUrl(window.location.protocol + "//" + window.location.hostname + ":8181");
            RestangularProvider.setDefaultHeaders({Authorization: "Basic YWRtaW46YWRtaW4="});

			RestangularProvider.setRequestInterceptor(function (element, operation) {
				if (operation === 'post' && element.hasOwnProperty('id') && element.id === undefined) {
					return null;
				} else {
					return element;
				}
			});

		}

		angular.bootstrap(document, ['app']);

	}
);
