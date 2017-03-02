define([''], function () {

	'use strict';

	function ErrorHandlerCtrl($scope, errData, $mdToast, $mdDialog, ErrorHandlerService) {


		$scope.errData = errData;


		$scope.closeDialog = function(){
			$mdDialog.hide();
		};

		$scope.showMoreInfoInDialog = function(){
			$scope.closeToast();
			ErrorHandlerService.log($scope.errData, {
				type: "dialog",
				allowTologInConsole: false
			});
		};

		$scope.closeToast = function(){
			$mdToast
				.hide()
				.then(function() {

				});
		};

	}


	ErrorHandlerCtrl.$inject=['$scope', 'errData', '$mdToast', '$mdDialog', 'ErrorHandlerService'];

	return ErrorHandlerCtrl;
});
