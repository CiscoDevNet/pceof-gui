define([], function () {
	'use strict';

	function NotificationModel() {
		var self = null;

		/**
		 * constructor for Notification model
		 * @constructor
		 */
		function Notification (){
			self = this;
			self.data = {};
		}

		Notification.prototype.setData = setData;

		/**
		 * Implementations
		 */

		/**
		 * extends Notification prototype
		 * @param notificationData
		 */
		function setData (notificationData){

			self.data['notification-id'] = notificationData['notification-id'];
			self.data.window = notificationData.window;
			self.data.threshold = notificationData.threshold; // todo: need deep copy!

		}

		return Notification;
	}

	return NotificationModel;

});
