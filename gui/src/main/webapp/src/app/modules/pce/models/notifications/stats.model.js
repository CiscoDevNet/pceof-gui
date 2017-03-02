define([], function () {
	'use strict';

	function StatsModel(RegistrationListService, GlobalParametersService) {
		/**
		 * constructor for Registration model
		 * @constructor
		 */
		function Stats (){
			this.data = {};
		}

		Stats.prototype.setData = setData;

		/**
		 * Implementations
		 */

		/**
		 * extends Stats prototype
		 * @param statsData
		 */
		function setData (statsData){
			/*jshint validthis:true */
			this.data['global-parameters'] = setGlobalParameters(statsData['global-parameters']);
			this.data['stat-registration'] = setRegistrationData(statsData['stat-registration']);

			function setGlobalParameters(globalParametersData){
				var globalParameters = GlobalParametersService.createGlobalParameters();
				globalParameters.setData(globalParametersData);

				return globalParameters;
			}

			function setRegistrationData(registrationData) {
				var registrationList = RegistrationListService.createRegistrationList();

				registrationList.setData(registrationData);

				return registrationList;
			}
		}

		return Stats;
	}

	StatsModel.$inject=['RegistrationListService', 'GlobalParametersService'];

	return StatsModel;

});
