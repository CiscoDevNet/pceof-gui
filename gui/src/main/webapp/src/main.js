require.config({
	baseUrl : '',
	urlArgs:'v1',
	waitSeconds: 0,
	paths : {
		'angular' : 'vendor/angular/angular.min',
		'angular-translate' : 'vendor/angular-translate/angular-translate.min',
		'angular-translate-loader-partial' : 'vendor/angular-translate-loader-partial/angular-translate-loader-partial.min',
		'angular-route' : 'vendor/angular-route/angular-route.min',
        'angular-material' : 'vendor/angular-material/angular-material.min',
        'angular-animate'  : 'vendor/angular-animate/angular-animate.min',
        'angular-aria' :  'vendor/angular-aria/angular-aria.min',
        'Restangular' : 'vendor/restangular/dist/restangular.min',
        'lodash': 'vendor/lodash/dist/lodash.min',
		'next-ui' : 'vendor/NeXt/js/next.min',
        'angular-material-data-table' : 'vendor/angular-material-data-table/dist/md-data-table.min',
		'i-multi-select' : 'assets/packages/i-multi-select/isteven-multi-select',
        'angular-json-tree' : 'vendor/angular-json-tree/build/angular-json-tree.min',
		'angular-messages' : 'vendor/angular-messages/angular-messages.min'
	},
	shim : {
		'angular-translate': ['angular'],
		'angular-translate-loader-partial' : ['angular-translate'],
		'angular-route' : ['angular'],
        'angular-material' : ['angular'],
        'angular-animate' : ['angular'],
        'angular-aria' : ['angular'],
		'i-multi-select' : ['angular'],
        'Restangular' : ['angular', 'lodash'],
        'angular-material-data-table' : ['angular', 'angular-material'],
        'angular-json-tree' : ['angular'],
		'angular-messages' : ['angular'],
		'angular' : {
			exports: 'angular'
		}
	},
	deps : ['app/app.module']

});

