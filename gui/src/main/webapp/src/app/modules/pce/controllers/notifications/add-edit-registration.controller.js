define([''], function () {

	'use strict';

	function AddEditRegistrationDialogCtrl($scope, $mdDialog, $mdConstant, NetworkService, ErrorHandlerService,
										   registration, pScope, RegistrationService) {

		// methods
		$scope.init = init;
		$scope.saveRegistration = saveRegistration;
		$scope.closeRegistrationDialog = closeRegistrationDialog;
		$scope.refreshLinkIds = refreshLinkIds;

		$scope.formatRegistrationForEdit = formatRegistrationForEdit;

		$scope.searchForLinks = searchForLinks;
		$scope.formatLinksForChips = formatLinksForChips;

		$scope.saveNotification = saveNotification;
		$scope.addEditNotification = addEditNotification;
		$scope.formatNotificationsForEdit = formatNotificationsForEdit;

		$scope.deleteRestoreNotification = deleteRestoreNotification;

		$scope.isNotificationsArrayNotEmpty = isNotificationsArrayNotEmpty;

		// variables
		$scope.pScope = pScope;

		// run controller
		$scope.init();

		function init(){

			registration = registration || false;

			$scope.refreshLinkIds();

			// Separators for "chips"
			$scope.linksSeparators = [
				$mdConstant.KEY_CODE.ENTER,
				$mdConstant.KEY_CODE.COMMA
			];

			$scope.linksChipsConfig = {
				selectedItem: null,
				searchText: null
			};

			$scope.editConfig = {
				tab: 'registration',
				regMode: 'add',
				regId: null,
				notificationsMode: 'list',
				notificationId: null,
				hoveredNotification: null
			};

			$scope.editBuffer = {
				id: null,
				links: [],
				// list of notifications
				notifications: [],
				// temporary notification data
				_notification: {}
			};

			// modify existing
			if(registration){

				// registration data if in edit mode
				$scope.regData = registration.data;

				angular.extend($scope.editConfig, {
					regId: $scope.regData['registration-id'],
					regMode: 'edit'
				});


				$scope.formatRegistrationForEdit();
				//console.log($scope.editBuffer);

			}
			// add new
			else{

				$scope.editConfig.regMode = 'add';

			}
		}

		function saveRegistration(){

			pScope.statsService.getStats(
				function(data){

					if($scope.editConfig.regMode == 'add'){
						pScope.stats['stat-registration'].data.push(buildRegistrationHelper());
					}
					else if($scope.editConfig.regMode == 'edit'){
						var registrationReplaced = false;
						for(var i = 0; i < pScope.stats['stat-registration'].data.length; i++){
							if(pScope.stats['stat-registration'].data[i].data['registration-id'] == $scope.editConfig.regId){
								pScope.stats['stat-registration'].data[i] = buildRegistrationHelper();
								registrationReplaced = true;
							}
						}
						if(!registrationReplaced){
							pScope.stats['stat-registration'].data.push(buildRegistrationHelper());
						}
					}

					pScope.statsService.putStats();
					pScope.statsService.getStats();
					closeRegistrationDialog();

				},
				function(err){
					closeRegistrationDialog();
					ErrorHandlerService.log(err);
				}
			);

			function buildRegistrationHelper(){

				return RegistrationService.createRegistration({
					'registration-id': $scope.editBuffer.id,
					'link': buildLinksHelper($scope.editBuffer.links),
					'notification': buildNotificationsHelper($scope.editBuffer.notifications)
				});
			}

			/**
			 * Returns links good for Registration model
			 * @param links
			 * @returns {Array}
			 */
			function buildLinksHelper(links){
				var newLinks = links.map(function(link){
					return link.id;
				});
				return newLinks;
			}

			/**
			 * Returns notifications good for Registration model
			 * @param notifications
			 */
			function buildNotificationsHelper(notifications){

				var newNotifications = [];

				for(var i = 0; i < notifications.length; i++){
					var notification = notifications[i];
					if(!notification._deleted){
						newNotifications.push(
							{
								'notification-id': notification.id,
								'window': notification.window,
								'threshold': {
									'type': notification.thresholdType,
									'crossing': notification.thresholdCrossing,
									'threshold-value': notification.thresholdValue
								}
							}
						);
					}
				}

				return newNotifications;

			}
		}

		/**
		 * Refresh IDs of existing links
		 * @param successCbk
		 * @param errorCbk
		 */
		function refreshLinkIds(successCbk, errorCbk){

			successCbk = successCbk ||
				function(linkIds){
					return linkIds;
				};

			errorCbk = errorCbk ||
				function(err){
					ErrorHandlerService.log(err);
				};

			var linkIds;
			NetworkService.getNetwork(
				function(network){
					linkIds = network.data['ietf-network-topology:link'].map(function(link){
						return {
							id: link.data['link-id'],
							_lowerId: link.data['link-id'].toLowerCase()
						}
					});
					$scope.linkIds = linkIds;
					successCbk(linkIds);
				},
				errorCbk
			);
		}

		function closeRegistrationDialog() {

			$mdDialog.cancel();
		}

		function createFilterFor(query) {
			var lowercaseQuery = angular.lowercase(query);
			return function filterFn(link) {
				return (link._lowerId.indexOf(lowercaseQuery) != -1)
			};
		}

		/**
		 * Filter link IDs array by a random query. Returns array of matched links.
		 * @param query
		 * @returns {Array}
		 */
		function searchForLinks(query){
			var results = query ? $scope.linkIds.filter(createFilterFor(query)) : [];
			return results;
		}


		function formatLinksForChips(rawLinks){

			var procLinks = rawLinks.map(function(link){
				return {
					'id': link,
					'_lowerId': angular.lowercase(link)
				};
			});

			return procLinks;

		}

		function saveNotification(){

			if($scope.editConfig.notificationsMode == 'add'){
				addTempNotificationToList();
			}

			else if($scope.editConfig.notificationsMode == 'edit'){
				var notificationReplaced = false;
				for(var i = 0; i < $scope.editBuffer.notifications.length; i++){
					if($scope.editBuffer.notifications[i].id == $scope.editConfig.notificationId){
						$scope.editBuffer.notifications[i] = $scope.editBuffer._notification;
						notificationReplaced = true;
					}
				}
				if(!notificationReplaced){
					addTempNotificationToList();
				}
			}

			$scope.editConfig.notificationsMode = 'list';

			function addTempNotificationToList(){
				$scope.editBuffer.notifications.push(
					angular.extend($scope.editBuffer._notification, {
						'_deleted': false
					})
				);
			}
		}

		/**
		 * Makes add/edit notification form appear
		 * @param notificationId
		 */
		function addEditNotification(notificationId){

			$scope.editConfig._notification = {};

			if(notificationId === undefined){

				angular.extend($scope.editConfig, {
					notificationId: null,
					notificationsMode: 'add'
				});

				angular.extend($scope.editBuffer, {
					_notification: {}
				})

			}
			else{
				angular.extend($scope.editConfig, {
					notificationId: notificationId,
					notificationsMode: 'edit'
				});

				// copy to temporary object
				for(var i = 0; i < $scope.editBuffer.notifications.length; i++){
					if($scope.editBuffer.notifications[i].id == $scope.editConfig.notificationId){
						$scope.editBuffer._notification = angular.copy($scope.editBuffer.notifications[i]);
					}
				}
			}
		}


		/**
		 * Simple formatter of registrations
		 * @param registration
		 */
		function formatRegistrationForEdit(registration){
			angular.extend($scope.editBuffer, {
				id: $scope.regData['registration-id'],
				links: $scope.formatLinksForChips($scope.regData.link),
				notifications: $scope.formatNotificationsForEdit($scope.regData.notification.data)
			});
		}

		/**
		 * Change notification model to display it in notification form
		 * @param notifications standard notifications model
		 * @returns {Array} formatted notifications
		 */
		function formatNotificationsForEdit(notifications){
			var formattedNotifications = [];
			formattedNotifications = notifications.map(function(notification){
				return {
					id: notification.data['notification-id'],
					window: notification.data.window,
					thresholdType: notification.data.threshold['type'],
					thresholdCrossing: notification.data.threshold['crossing'],
					thresholdValue: notification.data.threshold['threshold-value'],
					_deleted: false
				};
			});

			return formattedNotifications;
		}

		/**
		 * Delete OR restore a notification
		 * @param notificationId Unique ID of the notification
		 * @param deleteStatus {Boolean} true - delete, false - restore
		 */
		function deleteRestoreNotification(notificationId, deleteStatus){
			for(var i = 0; i < $scope.editBuffer.notifications.length; i++){
				if($scope.editBuffer.notifications[i].id == notificationId){
					$scope.editBuffer.notifications[i]._deleted = deleteStatus;
					break;
				}
			}
		}

		/**
		 * Determines if there is even one notification that is not marked as deleted
		 * Used to validate the form
		 * @returns {Boolean} true if not empty, otherwise false
		 */
		function isNotificationsArrayNotEmpty(){
			for(var i = 0; i < $scope.editBuffer.notifications.length; i++){
				if( $scope.editBuffer.notifications[i]._deleted === false ){
					return true;
				}
			}
			return false;
		}

	}

	AddEditRegistrationDialogCtrl.$inject=['$scope', '$mdDialog', '$mdConstant', 'NetworkService', 'ErrorHandlerService',
		'registration', 'pScope', 'RegistrationService'];

	return AddEditRegistrationDialogCtrl;
});
