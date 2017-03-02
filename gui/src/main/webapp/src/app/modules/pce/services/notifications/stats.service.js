define([], function () {
	'use strict';
	
	function StatsService(StatsModel, Restangular) {
		this.createStats = createStats;

		/**
		 * Creates Stats object, fills it with statsData (if available), adds methods and returns the object.
		 * @param statsData {Object} Data for one Stats object
		 * @returns {Object} Stats object with service methods
		 */
		function createStats (statsData) {
			var obj = new StatsModel();
			
			if(statsData) {
				obj.setData(statsData);
			}
			
			obj.getStats = getStats;
			obj.putStats = putStats;

			return obj;
		}
		
		/**
		 * Get stats object from configured datastore, convert it to Stats object and return
		 * @returns {Object} Stats object
		 */
		function getStats(successCbk, errorCbk) {
			/*jshint validthis: true */
			var self = this;

			successCbk = successCbk || function(data){};
			errorCbk = errorCbk || function(err){};
			
			var restObj = Restangular.one('restconf').one('config').one('ofl3-statistics:ofl3-statistics');

			restObj.get().then(
				function(data) {
					self.setData(data['ofl3-statistics']);
					successCbk(self.data);
				},
				function(err){
					console.debug('error', err);
					var defaultError = {
						"errCode": "REGSTATS_NOT_LOADED",
						"errTitle": "Registration data not loaded",
						"errMsg": "Couldn't load Registration information from controller. Server does not respond.",
						"errResolution": "Check if controller is down, otherwise check your connection.",
						"errObj": err
					};

					var dataMissingError = {
						"errCode": "REGSTATS_DATA_MISSING",
						"errTitle": "Registration/notification data is missing",
						"errMsg": "Couldn't read registration configuration from controller. Data is missing.",
						"errResolution": "Check if it is configured in controller.",
						"errObj": err
					};

					try{
						// if data is missing
						if(err.data.errors.error[0]['error-tag'] === 'data-missing'){
							console.debug('data missing');
							errorCbk(dataMissingError);
						}
						else{
							errorCbk(defaultError);
						}
					}
					catch(e){
						errorCbk(defaultError);
					}
				}
			);

		}

		/**
		 * Processes all "ofl3-statistics:ofl3-statistics" data and sends it to the controller to write
		 * @param successCbk {Function} optional success callback
		 * @param errorCbk {Function} optional success callback
		 */
		function putStats(successCbk, errorCbk){
			/*jshint validthis: true */
			var self = this;
			successCbk = successCbk || function(data){};
			errorCbk = errorCbk || function(err){};

			var restObj = Restangular.one('restconf').one('config').one('ofl3-statistics:ofl3-statistics');

			// prepare body of request (input data)
			var dataObj = {
				"ofl3-statistics": {
					"global-parameters": self.data['global-parameters'].data,
					"stat-registration": adaptRegistrations(self.data['stat-registration'].data)
				}
			};

			// send REST call
			restObj.customPUT(dataObj).then(
				function(data){
					successCbk(data);
				},
				function(err){
					errorCbk(
						{
							"errCode": "REGSTATS_NOT_PUT",
							"errTitle": "Couldn't Save Registration information",
							"errMsg": "You tried to add or edit registration information, but it failed.",
							"errResolution": "Check if controller is down, otherwise check your connection.",
							"errObj": err
						}
					);
				}
			);

			/**
			 * Processes internal registration data, in order to feed it to the controller
			 * @param registrations {Array}
			 * @returns {Array}
			 */
			function adaptRegistrations(registrations){
				var newRegistrations;

				newRegistrations = registrations.map(function(registration){
					var newRegistration = registration.data;
					newRegistration.notification = adaptNotificationList(newRegistration.notification.data);
					return newRegistration;
				});

				return newRegistrations;
			}

			/**
			 * Processes internal notification-list data, in order to feed it to the controller
			 * @param notificationList {Array}
			 * @returns {Array}
			 */
			function adaptNotificationList(notificationList){
				var newNotificationList;

				newNotificationList = notificationList.map(function(notification){
					return notification.data
				});

				return newNotificationList;
			}

		}

	}
	
	StatsService.$inject=['StatsModel', 'Restangular'];
	
	return StatsService;
	
});
