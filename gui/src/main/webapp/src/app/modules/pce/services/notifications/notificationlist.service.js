define([], function () {
	'use strict';

	function NotificationListService(NotificationListModel) {
		this.createNotificationList = createNotificationList;

		/**
		 * Creates NotificationList object and adds methods and returns the object.
		 * @returns {Object} NotificationList object with service methods
		 */
		function createNotificationList () {
			var obj = new NotificationListModel();

			return obj;
		}

	}

	NotificationListService.$inject=['NotificationListModel'];

	return NotificationListService;

});
