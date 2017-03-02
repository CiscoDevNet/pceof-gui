define([], function () {
	'use strict';
	
	function NotificationService(NotificationModel, Restangular) {
		this.createNotification = createNotification;

		
		/**
		 * Creates Notification object, fills it with notificationData (if available), adds methods and returns the object.
		 * @param notificationData {Object} Data for one Notification object
		 * @returns {Object} Notification object with service methods
		 */
		function createNotification (notificationData) {
			var obj = new NotificationModel();
			
			if(notificationData) {
				obj.setData(notificationData);
			}

			return obj;
		}
		

	}
	
	NotificationService.$inject=['NotificationModel'];
	
	return NotificationService;
	
});
