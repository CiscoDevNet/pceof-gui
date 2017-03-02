define([''], function () {

    'use strict';

	/*
	Controller for "Notifications" screen
	 */
    function NotificationsCtrl($scope, $log, $mdDialog, ErrorHandlerService, StatsService,
							   RegisteredEventsService, RegistrationListService) {

		// TODO: DEBUG ONLY - REMOVE ALL $log OCCURRENCES
		$scope.log = $log;

		// Functions
		$scope.init = init;

		// * Registrations
		$scope.addEditRegistration = addEditRegistration;
		$scope.warnDeleteRegistration = warnDeleteRegistration;
		$scope.deleteRegistration = deleteRegistration;
		$scope.reloadRegistrations = reloadRegistrations;
		// for table
		$scope.removeRegTableFilter = removeRegTableFilter;

		// * Registered Events
		$scope.reloadRegisteredEvents = reloadRegisteredEvents;
		$scope.clearRegisteredEvents = clearRegisteredEvents;


		$scope.statsService = {};
		$scope.stats = {};
		$scope.statsLoaded = false;


		$scope.regTableFilter = {
			options: {},
			show : false
		};

		$scope.regTableQuery = {
			order: "data['registration-id']",
			limit: 10,
			page: 1,
			filter: '',
			pageSelect: 1
		};

		$scope.eventsTableFilter = {
			options: {},
			show : false
		};

		$scope.eventsTableQuery = {
			order: "['registration-id']",
			limit: 10,
			page: 1,
			filter: '',
			pageSelect: 1
		};

		$scope.editConfig = {
			"globalParameter": {
				"add": false,
				"edit": false,
				"key": "",
				"values": {}
			}
		};

		/**
		 * Init the controller & elements on the screen
		 */
		function init(){
			$scope.showProgressBar();
			$scope.statsService = StatsService.createStats();
			$scope.statsService.getStats(
				function(data){
					$scope.stats = data;
					$scope.statsLoaded = true;
					$scope.reloadRegisteredEvents(
						function(data){
							$scope.registeredEvents = data;
							$scope.hideProgressBar();
						},
						function(err){
							$scope.registeredEvents = {};
							ErrorHandlerService.log(err, data);
							$scope.hideProgressBar();
						}
					);
					$log.log($scope.stats);
				},
				function(err){
					if(err.errCode === 'REGSTATS_DATA_MISSING'){
						$scope.stats['stat-registration'].data = [];
						$scope.statsLoaded = true;
					}
					else{
						ErrorHandlerService.log(err, true);
						$scope.statsLoaded = false;
					}
					$scope.hideProgressBar();
				}
			);
		}


		/// *** REGISTRATIONS *** ///


		/**
		 *
		 * @param registration
		 */
		function addEditRegistration(registration){
			$mdDialog.show({
				clickOutsideToClose: true,
				controller: 'AddEditRegistrationDialogCtrl',
				templateUrl: 'app/modules/pce/views/notifications/add-edit-registration/add-edit-registration.tpl.html',
				parent: angular.element(document.body),
				locals: {
					registration: registration,
					pScope: $scope
				}
			});
		}


		/**
		 * Display confirmation dialog before delete a registration
		 * @param registration {Object}
		 * @param $event
		 */
		function warnDeleteRegistration(registration, $event){
			var confirm = $mdDialog.confirm()
				.title('Delete the registration?')
				.textContent("If you hit Yes, the registration " + registration.data['registration-id'] + " will be deleted. Are you sure?")
				.ariaLabel('Delete registration')
				.targetEvent($event)
				.ok('Yes, delete it')
				.cancel('No, leave it');
			$mdDialog.show(confirm).then(function() {
				$scope.deleteRegistration(registration);
			}, function() {});
		}

		/**
		 * Delete registration; called when user approves the deletion
		 * @param registration
		 */
		function deleteRegistration(registration){

			registration.deleteRegistration(
				// registration deleted
				deleteRegistrationSuccessCbk,
				// error occurred
				deleteRegistrationErrorCbk
			);

			function deleteRegistrationSuccessCbk(){
				$log.info("reg deleted");
				// reload regs
				$scope.stats['stat-registration'].updateRegistrationList(
					getRegistrationsSuccessCbk,
					getRegistrationsErrorCbk
				);
			}

			function deleteRegistrationErrorCbk(err){
				ErrorHandlerService.log(err);
			}

			function getRegistrationsSuccessCbk(data){

			}

			function getRegistrationsErrorCbk(err){
				ErrorHandlerService.log(err);
			}

		}

		/**
		 * Refresh the registration list
		 */
		function reloadRegistrations(){

			$scope.stats['stat-registration'].updateRegistrationList();

		}

		/**
		 * Cancel searching thru registrations
		 */
		function removeRegTableFilter(){
			$scope.regTableFilter.show = false;
			$scope.regTableQuery.filter = '';

			if($scope.regTableFilter.form.$dirty) {
				$scope.regTableFilter.form.$setPristine();
			}
		}


		/// *** REGISTERED EVENTS *** ///
		/**
		 * Refresh the registered events in local storage
		 * @param successCbk
		 * @param errorCbk
		 */
		function reloadRegisteredEvents(successCbk, errorCbk){

			successCbk = successCbk || function(data){
					$scope.registeredEvents = data;
				};
			errorCbk = errorCbk || function(err){
					$scope.registeredEvents = {};
					ErrorHandlerService.log(err, data);
				};

			RegisteredEventsService.getRegisteredEvents(successCbk, errorCbk);
			
		}

		/**
		 * Clear registered events from local data storage
		 */
		function clearRegisteredEvents(){
			RegisteredEventsService.clearRegisteredEvents();
			$scope.registeredEvents = [];
		}

		$scope.init();


    }

    NotificationsCtrl.$inject=[ '$scope', '$log', '$mdDialog', 'ErrorHandlerService', 'StatsService', 'RegisteredEventsService', 'RegistrationListService' ];

    return NotificationsCtrl;
});
