define([], function () {
	'use strict';

	function RegistrationListService(RegistrationListModel, Restangular) {
		this.createRegistrationList = createRegistrationList;

		/**
		 * Implementation
		 */

		/**
		 * Creates RegistrationList object and adds methods and returns the object.
		 * @returns {Object} RegistrationList object with service methods
		 */
		function createRegistrationList () {
			var obj = new RegistrationListModel();

			obj.updateRegistrationList = updateRegistrationList;

			return obj;
		}

		/**
		 * Get registration list RegistrationList
		 */
		function updateRegistrationList(successCbk, errorCbk) {
			/*jshint validthis:true */
			var self = this;

			successCbk = successCbk || function(data){};
			errorCbk = errorCbk || function(err){};

			var restObj = Restangular.one('restconf').one('config').one('ofl3-statistics:ofl3-statistics');

			return restObj.get().then(
				// successfully retrieved
				function(data) {
					if(data['ofl3-statistics']['stat-registration']) {
						var payload = data['ofl3-statistics']['stat-registration'];
						self.setData(payload);
						successCbk(payload);
					}
					else{
						self.setData([]);
					}
				},
				// error
				function(err){
					// todo: error description
					// empty the list
					self.setData([]);
				}
			);
		}

	}

	RegistrationListService.$inject=['RegistrationListModel', 'Restangular'];

	return RegistrationListService;

});
