define([], function () {
	'use strict';

	function RegistrationModel(NotificationListService) {
		var self = null;
		/**
		 * constructor for Registration model
		 * @constructor
		 */
		function Registration (){
			self = this;
			self.data = {};
		}

		Registration.prototype.setData = setData;

		/**
		 * Implementations
		 */

		/**
		 * extends Registration prototype
		 * @param registrationData
		 */
		function setData (registrationData){

			self.data['registration-id'] = registrationData['registration-id'];
			self.data.link = registrationData.link;
			// todo: need to .hasOwnProperty?
			self.data.notification = setNotificationData(registrationData.notification);

			function setNotificationData(notificationData) {

				var notificationList = NotificationListService.createNotificationList();

				if(notificationData)
					notificationList.setData(notificationData);

				return notificationList;
			}
		}

		return Registration;
	}

	RegistrationModel.$inject=['NotificationListService'];

	return RegistrationModel;

});
