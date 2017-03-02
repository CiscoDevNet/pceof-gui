define([], function () {
	'use strict';

	function RegistrationListModel(RegistrationService) {
		/**
		 * constructor for RegistrationList model
		 * @constructor
		 */
		function RegistrationList (){
			this.data = [];
		}

		RegistrationList.prototype.setData = setData;

		/**
		 * Implementations
		 */

		/**
		 * Fills RegistrationList with data
		 * @param registrationListData {Array} Array of policy items from server
		 */
		function setData (registrationListData){
			/*jshint validthis:true */
			var self = this;

			self.data = [];

			// if the array is not empty (when no registrations)
			if(registrationListData){
				registrationListData.forEach(function(registrationData) {
					self.data.push(RegistrationService.createRegistration(registrationData));
				});
			}

		}

		return RegistrationList;
	}

	RegistrationListModel.$inject = ['RegistrationService'];

	return RegistrationListModel;

});