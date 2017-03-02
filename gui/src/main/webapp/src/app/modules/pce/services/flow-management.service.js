define([], function () {
    'use strict';

    // FORM OF ANY SERVICE
    function FlowManagementService(Restangular, FlowModel) {

        this.assignFlowsToDevices = assignFlowsToDevices;
        this.getFlowsByType = getFlowsByType;

        /**
         * Assigns flows from raw data into flows parameter
         * @param data
         * @param flows
         * @param type
         */
        function assignFlowsToDevices(data, flows, type){
            data.nodes.node.forEach(function(node){
                if(node['flow-node-inventory:table'] && node['flow-node-inventory:table'].length){
                    node['flow-node-inventory:table'].forEach(function(flowTable, index){
                        if(flowTable.flow && flowTable.flow.length){
                            flowTable.flow.forEach(function(fl){
                                var pathId = node.id.split(':'),
                                    pathIdParsed = pathId && pathId.length > 1 ? pathId[1] : '';

                                if(!flows.hasOwnProperty(pathIdParsed)){
                                    flows[pathIdParsed] = [];
                                }

                                if(pathIdParsed){
                                     if(type === 'operational'){
                                        var sameFlow = flows[pathIdParsed].filter(function(el){
                                            return el.id === fl.id;
                                        });

                                         if(sameFlow && sameFlow.length){
                                            flows[pathIdParsed][flows[pathIdParsed].indexOf(sameFlow[0])].status = 'config + operational';
                                         }

                                     } else {
                                         flows[pathIdParsed].push(new FlowModel(fl, type, pathId[1]));

                                     }
                                }
                            });
                        }
                    });
                }
            });
        }

        /**
         * Gets data from inventory
         * @param dataStoreType
         * @param successCbk
         * @param errorCbk
         * @returns {*}
         */
        function getFlowsByType(dataStoreType, successCbk, errorCbk){
            var restObj = Restangular.one('restconf').one(dataStoreType).one('opendaylight-inventory:nodes');

            return restObj.get().then(
                function(data){
					if(data.nodes.hasOwnProperty('node')){
						successCbk(data);
					}
					else{
						var errData = {
							"errCode": "GET_FLOWS_BY_TYPE_NO_NODES_FOUND",
							"errTitle": "Couldn't get flows by type",
							"errMsg": "Couldn't get flows by type, because no nodes information was found.",
							"errResolution": "Check if controller is okay.",
							"errObj": data
						};
						errorCbk(errData);
					}
                }, function(err){
					var errData = {
						"errCode": "GET_FLOWS_BY_TYPE_FAILED",
						"errTitle": "Couldn't get flows by type",
						"errMsg": "Couldn't get flows by type. Server does not respond.",
						"errResolution": "Check if controller is down, otherwise check your connection.",
						"errObj": err
					};
                    errorCbk(errData);
                }
            );
        }



    }

    FlowManagementService.$inject=['Restangular', 'FlowModel'];

    return FlowManagementService;
});
