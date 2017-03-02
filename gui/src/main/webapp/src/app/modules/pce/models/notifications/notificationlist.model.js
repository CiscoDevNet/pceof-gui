define([], function () {
	'use strict';

	function NotificationListModel(NotificationService) {
		/**
		 * constructor for NotificationList model
		 * @constructor
		 */
		function NotificationList (){
			this.data = [];
		}

		NotificationList.prototype.setData = setData;

		/**
		 * Fills NotificationList with data
		 * @param notificationListData {Array} Array of policy items from server
		 */
		function setData (notificationListData){
			/*jshint validthis:true */
			var self = this;

			notificationListData.forEach(function(notificationData) {
				self.data.push(NotificationService.createNotification(notificationData));
			});
		}

		return NotificationList;
	}

	NotificationListModel.$inject=['NotificationService'];

	return NotificationListModel;

});