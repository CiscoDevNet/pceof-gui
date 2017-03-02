define([], function () {
	'use strict';
	
	function ConfigurationService(Restangular) {

		var service = {
			getNeighbourDiscovery: getNeighbourDiscovery,
			getRegistrationParameters: getRegistrationParameters,
			getFlowStatistic: getFlowStatistic,
			getKafka: getKafka,
			getXrv: getXrv,
			putNeighbourDiscovery: putNeighbourDiscovery,
			putFlowStatistic: putFlowStatistic,
			putRegistrationParameters: putRegistrationParameters
		};

		return service;



		function getRegistrationParameters(type, successCbk, errorCbk){
			var restObj = Restangular.one('restconf').one('config').one('ofl3-statistics:ofl3-statistics').one('global-parameters');

			restObj.get().then(function (data) {

				if ( data['global-parameters'] ){
					successCbk(data['global-parameters'], type);
				} else {
					errorCbk(null, type);
				}
			}, function (err) {
				var errData = {
					"errCode": "REGISTRATION_GLOBAL_PARAMETERS_NOT_FOUND",
					"errTitle": "No registration global parameters configuration found",
					"errMsg": "The application tried to find registration global parameters configuration, but it seems to be complicated at this point.",
					"errResolution": "Check if controller is down, otherwise check your connection.",
					"errObj": err
				};
				errorCbk(errData, type);
			});
		}

		/**
		 * Get Neighbour Discovery Configuration Parameters
		 * @param successCbk
		 * @param errorCbk
		 */
		function getNeighbourDiscovery(type, successCbk, errorCbk){
			var restObj = Restangular.one('restconf').one('config').one('nd:cfg');

			return restObj.get().then(function (data) {

				if ( data.cfg ){
					successCbk(data.cfg, type);
				} else {
					errorCbk(null, type);
				}
			}, function (err) {
				var errData = {
					"errCode": "NEIGHBOR_DISCOVERY_CONFIG_NOT_FOUND",
					"errTitle": "No neighbor discovery configuration found",
					"errMsg": "The application tried to find neighbor discovery configuration, but it seems to be complicated at this point.",
					"errResolution": "Check if controller is down, otherwise check your connection.",
					"errObj": err
				};
				errorCbk(errData, type);
			});
		}

		/**
		 * Put Neighbour Discovery Configuration Parameters
		 * @param data
		 * @param successCbk
		 * @param errorCbk
		 */
		function putNeighbourDiscovery(data, successCbk, errorCbk){
			var restObj = Restangular.one('restconf').one('config').one('nd:cfg');

			restObj.customPUT({cfg: data}).then(function (response) {
				successCbk();
			}, function (err) {
				var errData = {
					"errCode": "NEIGHBOR_DISCOVERY_NOT_PUT",
					"errTitle": "Couldn't save neighbor discovery configuration",
					"errMsg": "The application tried to save neighbor discovery configuration, but it seems to be complicated at this point.",
					"errResolution": "Check if controller is down, otherwise check your connection and input data.",
					"errObj": err
				};
				errorCbk(errData);
			});
		}

		function putRegistrationParameters(data, successCbk, errorCbk){
			var restObj = Restangular.one('restconf').one('config').one('ofl3-statistics:ofl3-statistics').one('global-parameters');

			restObj.customPUT({'global-parameters': data}).then(function (response) {
				successCbk();
			}, function (err) {
				var errData = {
					"errCode": "REGISTRATION_PARAMETERS_NOT_PUT",
					"errTitle": "Couldn't save registration parameters configuration",
					"errMsg": "The application tried to save registration parameters configuration, but it seems to be complicated at this point.",
					"errResolution": "Check if controller is down, otherwise check your connection and input data.",
					"errObj": err
				};
				errorCbk(errData);
			});
		}

		/**
		 * Get Flow Statistic Configuration Parameters
		 * @param successCbk
		 * @param errorCbk
		 */
		function getFlowStatistic(type, successCbk, errorCbk){
			var restObj = Restangular.one('restconf').one('config').one('ofl3-flow-statistics:registration');

			restObj.get().then(function (data) {

                data = {
                    "registration":{
                        "update-interval":32,
                        "included-stats":[
                            "ports",
                            "groups"
                        ]

                    }
                };

				if ( data.registration ){
					successCbk(data.registration);
				} else {
					errorCbk(null, type);
				}
			}, function (err) {
				var errData = {
					"errCode": "FLOW_STATISTICS_CONFIG_NOT_FOUND",
					"errTitle": "No flow statistics configuration found",
					"errMsg": "The application tried to find flow statistics configuration, but it seems to be complicated at this point.",
					"errResolution": "Check if controller is down, otherwise check your connection.",
					"errObj": err
				};
				errorCbk(errData, type);
			});
		}

		/**
		 * Put Flow Statistics Configuration Parameters
		 * @param data
		 * @param successCbk
		 * @param errorCbk
		 */
		function putFlowStatistic(data, successCbk, errorCbk){
			var restObj = Restangular.one('restconf').one('config').one('ofl3-flow-statistics:registration');

			restObj.customPUT({registration: data}).then(function (response) {
				successCbk();
			}, function (err) {
				var errData = {
					"errCode": "FLOW_STATISTICS_NOT_PUT",
					"errTitle": "Couldn't save flow statistics configuration",
					"errMsg": "The application tried to save flow statistics configuration, but it seems to be complicated at this point.",
					"errResolution": "Check if controller is down, otherwise check your connection and input data.",
					"errObj": err
				};
				errorCbk(errData);
			});
		}

		/**
		 * Kafka Configuration on Controller
		 * @param successCbk
		 * @param errorCbk
		 */
		function getKafka(successCbk, errorCbk){

		}

		/**
		 * XRV Configuration Parameters
		 * @param successCbk
		 * @param errorCbk
		 */
		function getXrv(successCbk, errorCbk){

		}

	}

	ConfigurationService.$inject=['Restangular'];
	
	return ConfigurationService;
	
});
