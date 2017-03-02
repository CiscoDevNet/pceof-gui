define([], function () {
	'use strict';

	function RegistrationService(RegistrationModel, Restangular) {

		this.createRegistration = createRegistration;


		/**
		 * Implementation
		 */

		/**
		 * Creates Registration object, fills it with registrationData (if available), adds methods and returns the object.
		 * @param registrationData {Object} Data for one Registration object
		 * @returns {Object} Registration object with service methods
		 */
		function createRegistration (registrationData) {
			var obj = new RegistrationModel();

			if(registrationData) {
				obj.setData(registrationData);
			}

			obj.updateRegistration = updateRegistration;
			obj.deleteRegistration = deleteRegistration;

			return obj;
		}

		/**
		 * Update registration object from controller, convert it to Registration object and return
		 * @param successCbk
		 * @param errorCbk
		 * @returns {*}
		 */
		function updateRegistration(successCbk, errorCbk) {
			/*jshint validthis:true */
			var self = this;
			var registrationId = self.data['registration-id'];

			var restObj = Restangular.one('restconf').one('config').one('ofl3-statistics:ofl3-statistics')
				.one('stat-registration').one(registrationId);

			return restObj.get().then(

				// success callback
				function(data) {
					var payload = data['stat-registration'][0];
					self.setData(payload);
					console.log(payload);
					successCbk(payload);
				},

				// error callback
				function(err){
					var errData = {
						"errCode": "GET_REGISTRATION_ERROR",
						"errTitle": "Couldn't read registration",
						"errMsg": "Couldn't load a Registration from controller. Server does not respond.",
						"errResolution": "Check if controller is down, otherwise check your connection",
						"errObj": err
					};
					errorCbk(errData);
				}
			);
		}

		/**
		 *
		 * @param successCbk
		 * @param errorCbk
		 * @returns {*}
		 */
		function deleteRegistration(successCbk, errorCbk) {
			/*jshint validthis:true */
			var self = this;
			var registrationId = self.data['registration-id'];

			var restObj = Restangular.one('restconf').one('config').one('ofl3-statistics:ofl3-statistics')
				.one('stat-registration').one(registrationId);

			return restObj.remove().then(

				// success callback
				function(data) {
					successCbk(true);
				},

				// error callback
				function(err){
					var errData = {
						"errCode": "DELETE_REGISTRATION_ERROR",
						"errTitle": "Couldn't delete registration",
						"errMsg": "Couldn't delete a Registration from controller. Server does not respond.",
						"errResolution": "Check if controller is down, otherwise check your connection",
						"errObj": err
					};
					errorCbk(errData);
				}
			);
		}
	}

	RegistrationService.$inject=['RegistrationModel', 'Restangular'];

	return RegistrationService;

});
