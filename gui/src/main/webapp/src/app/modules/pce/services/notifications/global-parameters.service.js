define([], function () {
	'use strict';

	function GlobalParametersService(GlobalParametersModel, Restangular) {

		this.createGlobalParameters = createGlobalParameters;

		/**
		 * Creates GlobalParameters object, fills it with globalParametersData (if available), adds methods and returns the object.
		 * @param globalParametersData {Object} Data for one GlobalParameters object
		 * @returns {Object} GlobalParameters object with service methods
		 */
		function createGlobalParameters (globalParametersData) {
			var obj = new GlobalParametersModel();

			if(globalParametersData) {
				obj.setData(globalParametersData);
			}

			obj.getGlobalParameters = getGlobalParameters;
			obj.deleteGlobalParameter = deleteGlobalParameter;
			obj.putGlobalParameters = putGlobalParameters;

			return obj;
		}

		/**
		 * Get globalParameters object from configured datastore, convert it to GlobalParameters object and return
		 * @param successCbk
		 * @param errorCbk
		 */
		function getGlobalParameters(successCbk, errorCbk) {

			var self = this;

			var restObj = Restangular.one('restconf').one('config').one('ofl3-statistics:ofl3-statistics').one('global-parameters');

			restObj.get().then(
				function(globalParametersData){
					var gpData = globalParametersData['global-parameters'];
					self.setData(gpData);
					successCbk(gpData);
				},
				function(err){
					errorCbk({
						"errCode": "GLOBALPARAMS_NOT_LOADED",
						"errTitle": "Global parameters data not loaded",
						"errMsg": "Couldn't load Global parameter information from controller. Server does not respond.",
						"errResolution": "Check if controller is down, otherwise check your connection.",
						"errObj": err
					});
				}
			);
		}

		/**
		 * Gets the latest Global Parameters list, removes the parameter from local copy
		 * and puts the rest to the controller
		 * @param param
		 * @param successCbk
		 * @param errorCbk
		 */
		function deleteGlobalParameter(param, successCbk, errorCbk){

			var self = this;

			// reload parameter list
			self.getGlobalParameters(
				getGlobalParametersSuccessCbk,
				getGlobalParametersErrorCbk
			);

			function getGlobalParametersSuccessCbk(data){
				// delete the parameter from the local copy
				delete self.data[param];
				// update the remote GP list
				self.putGlobalParameters(
					putGlobalParametersSuccessCbk,
					putGlobalParametersErrorCbk
				);
			}

			function getGlobalParametersErrorCbk(err){
				// just pass the error object further
				errorCbk(err);
			}

			function putGlobalParametersSuccessCbk(data){
				successCbk(data);
			}

			function putGlobalParametersErrorCbk(err){
				errorCbk(err);
			}

		}

		/**
		 * Update the list of Global parameters (sync local copy with controller)
		 * @param successCbk
		 * @param errorCbk
		 */
		function putGlobalParameters(successCbk, errorCbk){

			var self = this;

			var restObj = Restangular.one('restconf').one('config').one('ofl3-statistics:ofl3-statistics').one('global-parameters');
			var dataObj = {
				"global-parameters": self.data
			};

			restObj.customPUT(dataObj).then(
				function(data){
					successCbk(data);
				},
				function(err){
					errorCbk(
						{
							"errCode": "GLOBALPARAM_NOT_PUT",
							"errTitle": "Couldn't Save Global Parameters",
							"errMsg": "You tried to add or edit a global parameter, but it failed.",
							"errResolution": "Check if controller is down, otherwise check your connection.",
							"errObj": err
						}
					);
				}
			);

		}

	}

	GlobalParametersService.$inject=['GlobalParametersModel', 'Restangular'];

	return GlobalParametersService;

});
