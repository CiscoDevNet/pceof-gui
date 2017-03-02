define(['lodash'], function () {
    'use strict';

    /**
     * Service to handle network object
     */
    function NetworkService(NetworkModel, Restangular, UtilsService, LinksService, NextTopologyService) {
        var self = this;

        /**
         * Update node and links status ( next topo, network obj);
         * @param nxTopo
         * @param nxDict
         * @param networkObj
         */
        this.updateTopologyStatuses = function (nxTopo, nxDict, networkObj, newNxDict, nxTopoColors, successCbk) {
            var updateNodesStatuses = function (nodes) {
                    //console.log('nodes', nodes);
                    nodes.forEach(function (node) {
                        var nxNode = nxTopo.getNode(nxDict.nodes.getItem(node.data['node-id'])),
                            diffStatus = nxNode ? nxNode.model().get("status") !== node.data['ofl3-topology:status'] : null;

                        //check if node has diifferent status
                        if (nxNode && diffStatus) {
                            nxNode.model().set("status", node.data['ofl3-topology:status']);
                            var netObjNode = networkObj.findNodeById(node.data['node-id']);

                            if (netObjNode) {
                                netObjNode.updateData(node.data);
                            }

                            if( node.data['ofl3-topology:status'] == "configured" ){
                                nxNode._showDownBadge();
                            } else {
                                nxNode._hideDownBadge();
                            }
                        }
                    });
                },
                updateSingleNodeStatus = function (id, networkObj, newNetworkObj) {
                    var netObjNode = networkObj.findNodeById(id),
                        newNetObjNode = newNetworkObj.findNodeById(id);

                    if (netObjNode && newNetObjNode) {
                        netObjNode.updateData(newNetObjNode.data);
                    }
                },
                updateLinksStatuses = function (topoData, networkObj, newNetworkObj) {
                    var findConnectionByST = function (connections, source, target) {
                            var conn = null;

                            connections.some(function (connection) {
                                if ( connection.sourceName === source && connection.targetName === target ) {
                                    conn = connection;
                                }
                                return connection.sourceName === source && connection.targetName === target;
                            });

                            return conn;
                        },
                        updateConnectionProp = function (conn, newConn) {
                            for(var prop in conn){
                                conn[prop] = newConn[prop];
                            }
                        };

                    networkObj.data.connections.forEach(function (connection) {
                        var newConn = findConnectionByST(newNetworkObj.data.connections, connection.sourceName, connection.targetName);

                        if ( newConn ) {
                            var isDifferentStatus = connection.status.configured !== newConn.status.configured
                                || connection.status.operational !== newConn.status.operational;

                            if ( isDifferentStatus ) {
                                var nxLink  = nxTopo.getLink(connection.id);

                                if ( nxLink ) {
                                    nxLink.model().set("status", newConn.status);
                                    nxLink.update();
                                    updateConnectionProp(connection, newConn);
                                    updateSingleNodeStatus(connection.sourceName, networkObj, newNetworkObj);
                                    updateSingleNodeStatus(connection.targetName, networkObj, newNetworkObj);
                                }
                            }
                        }
                    });
                };

            if ( nxTopo ) {
                // get new network data for updating
                this.getNetwork(function (newNetworkObj) {
                    var rawTopoData = {
                            nodes: newNetworkObj.data.node,
                            links: newNetworkObj.data['ietf-network-topology:link'],
                            groups: newNetworkObj.data['ofl3-topology:links-in-group']
                        },
                        topoData = {nodes: [], links:[]};

                    updateNodesStatuses(newNetworkObj.data.node);

                    if ( rawTopoData.nodes.length ) {
                        topoData.nodes = self.getNodesData(rawTopoData.nodes, newNxDict);
                        topoData.links = self.getLinksData(rawTopoData.links, rawTopoData.groups, newNxDict, nxTopoColors);
                        newNetworkObj.data.connections = LinksService.processLinks(newNetworkObj.data, newNxDict, topoData);
                        updateLinksStatuses(topoData, networkObj, newNetworkObj);
                        //console.info('INFO :: newNetworkObj - ', newNetworkObj);
                    }

                    successCbk();

                }, function () {

                })
            }

        };

        /**
         * Get device name found by datapath id
         * @param nodes
         * @param inventoryNodeId
         * @returns {*}
         */
        this.getNodeByDataPath = function (nodes, inventoryNodeId) {
            var inventoryNodeIdParts = inventoryNodeId.split(':'),
                result = UtilsService.findObjInArray(nodes, {'datapath-id': inventoryNodeIdParts[1] || inventoryNodeId}, 'node-id');
            return result ? result : inventoryNodeId;
        };

        /**
         * Get NX topo links obj list between nodes
         * @param nxTopo
         * @param nodes
         * @param nodesRealIds
         * @returns {Array}
         */
        this.getLinksDataByNodes = function (nxTopo, nodes, nodesRealIds) {

            var nodesNxIds = nodesRealIds.map(function (node) {
                    return UtilsService.findObjInArray(nodes, {'node-id': node}, 'id');
                }),
                linksArray = [],
                index = 0;
            while ( !angular.isUndefined(nodesNxIds[index + 1]) ){
                var cLinkKey = nodesNxIds[index] < nodesNxIds[index + 1] ? nodesNxIds[index] + '-' + nodesNxIds[index + 1] : nodesNxIds[index + 1] + '-' + nodesNxIds[index],
                    linkObj = nxTopo.getLinksByNode(nodesNxIds[index], nodesNxIds[index + 1])[cLinkKey];

                //console.log('link', nodesNxIds[index] + '-' + nodesNxIds[index + 1]);

                if ( linkObj ) {
                    linksArray.push(linkObj);
                }
                index++;
            }

            return linksArray;
        };

        /**
         * Get data from controller and create network object with wrapping
         * @param successCbk
         * @param errorCbk
         */
        this.getNetwork = function(successCbk, errorCbk) {
            Restangular.one('restconf').one('operational').one('ietf-network:network').one('of-l3-dci').get().then(
                function(data){
                    var networkObj = new NetworkModel(data);
                    self.wrap(networkObj);
                    successCbk(networkObj);
                }, function(err){
					var errData = {
						"errCode": "GET_TOPOLOGY_ERROR",
						"errTitle": "Couldn't get network topology",
						"errMessage": "Couldn't get network topology. It seems like there is no connection to the network controller.",
						"errResolution": "Check if controller is down, otherwise check your connection.",
						"errObj": err
					};
					errorCbk(errData);
                }
            );
        };

        /**
         * Preparing links data for topology directive
         * @param rawLinks
         * @param rawGroups
         * @param nxDict
         * @returns {Array}
         */
        this.getLinksData = function(rawLinks, rawGroups, nxDict, nxTopoColors){
            // containter link index
            var cLinkIndex = null,
                linksObj = {},
                nxLinks = [];

            var i=0;

            //create ungrouped links + create linksObj
            rawLinks.forEach(function (link, index) {
                var linkInfoObj = {};
                linksObj[link.data['link-id']] = link.data;

                var srcNodeId = nxDict.nodes.getItem(link.data.source['source-node']),
                    destNodeId = nxDict.nodes.getItem(link.data.destination['dest-node']),
                    cLinkKey = srcNodeId < destNodeId ? srcNodeId + '-' + destNodeId : destNodeId + '-' + srcNodeId,
                    groups = link.data['ofl3-topology:link-group-id'][0] === 'Ungrouped' ? [] : link.data['ofl3-topology:link-group-id'],
                    cNxLink = null;

                // if ungrouped
                if ( groups.length===0 ) {
                    if ( nxDict.links.contains(cLinkKey) ) {
                        cLinkIndex = nxDict.links.getItem(cLinkKey);
                    } else {
                        //var link = $filter('filter')(nxLinks, {id: cLinkKey});
                        cLinkIndex = nxLinks.length;

                        nxDict.links.setItem(cLinkKey, cLinkIndex);


                        var nxLinkObj = {
                            id: cLinkKey,
                            source: srcNodeId,
                            target: destNodeId,
                            linkColor: null,
                            gLinks: [],
                            status: {
                                operational: 0,
                                configured: 0
                            }
                        };
                        setLinkStatus(nxLinkObj, link.data['link-id']);

                        if ( nxTopoColors ){
                            nxLinkObj.linkColor = NextTopologyService.getLinkColor(nxLinkObj.status, nxTopoColors);
                        }

                        nxLinks.push(nxLinkObj);
                    }

                    cNxLink = nxLinks[cLinkIndex];
                    cNxLink.gLinks.push(link.data['link-id']);
                }
            });

            // create grouped links
            var updatedStatus = {};
            rawGroups.forEach(function(group, index){
                var nxLinkObj = {
                    gLinks: [],
                    status: {
                        operational: 0,
                        configured: 0
                    }
                };


                group.data['link-id'].forEach(function(linkId, index){

                    if ( linksObj[linkId] ) {
                        var srcNodeId = nxDict.nodes.getItem(linksObj[linkId].source['source-node']),
                            destNodeId = nxDict.nodes.getItem(linksObj[linkId].destination['dest-node']),
                            cLinkKey = srcNodeId < destNodeId ? srcNodeId + '-' + destNodeId : destNodeId + '-' + srcNodeId;

                        //console.info('linkId', linkId, cLinkKey, linksObj, group);

                        if ( !nxDict.links.contains(cLinkKey) ) {
                            cLinkIndex = nxLinks.length;
                            nxDict.links.setItem(cLinkKey, cLinkIndex);

                            nxLinks.push(setLinkData(nxLinkObj, linkId, cLinkKey));
                        }
                        if(!updatedStatus.hasOwnProperty(linkId)){
                            setLinkStatus(nxLinkObj, linkId);
                            updatedStatus[linkId] = true;

                            if ( nxTopoColors ){
                                nxLinkObj.linkColor = NextTopologyService.getLinkColor(nxLinkObj.status, nxTopoColors);
                            }
                        }
                        nxLinkObj.gLinks.push(linkId);
                    }

                });
                //console.info('group', group, nxLinkObj);
            });

            // set base data
            function setLinkData(obj, linkId, cLinkKey){
                obj.source = nxDict.nodes.getItem(linksObj[linkId].source['source-node']);
                obj.target = nxDict.nodes.getItem(linksObj[linkId].destination['dest-node']);
                obj.id = cLinkKey;
                return obj;
            }

            // set link status
            function setLinkStatus(nxLinkObj, linkId){
                nxLinkObj.status[linksObj[linkId]['ofl3-topology:status']]++;

                // if operational it's configured
                if ( linksObj[linkId]['ofl3-topology:status'] === 'operational' ) {
                    nxLinkObj.status.configured++;
                }
            }

            //console.warn('nxLinks', nxLinks);
            return nxLinks;
        };

        /**
         * Preparing node data for topology directive
         * @param nodes
         * @param nxDict
         * @returns {*}
         */
        this.getNodesData = function(nodes, nxDict) {
            var prefix = 'ofl3-topology:';

            return nodes.map(function (node, index) {
                var n = {
                    'id': index, // internal node id (inside next)
                    'node-id': node.data['node-id'], // global node id
                    'label': node.data['node-id']
                    //'tp': node.data['ietf-network-topology:termination-point'] // termination points
                };

                // Set Node into nx dictionary
                nxDict.nodes.setItem(node.data['node-id'], index);

                return getNodeData(node.data, n);
            });

            /**
             * Import ofl3-topology-ish data
             * @param node
             * @param n
             * @returns {*}
             */
            function getNodeData(node, n){
                Object.getOwnPropertyNames(node).forEach(function(val, idx, array){
                    var prop = val.split(prefix);

                    if( prop.length === 2 ) {
                        n[prop[1]] = node[val];
                    }
                });

                // fix node type value
                n.type = n.type.indexOf(prefix) > -1 ? n.type.split(prefix)[1] : n.type;
                // set icon prop
                setTypeIcon(n, node);
                // clone all data
                n.data = _.cloneDeep(n);

                return n;
            }

            /**
             * Set correct node icon by type
             * @param n
             * @returns {*}
             */
            function setTypeIcon(n){
                switch (n.type) {
                    case 'host':
                        n.icon = 'host';
                        break;
                    case 'forwarding-box':
                        n.icon = 'router';
                        //n.label = n['forwarding-box-name'];
                        break;
                }

                return n;
            }

        };

        /**
         * Service for getting termination points object
         * @param nodes
         * @returns {{}}
         */
        this.getTpData = function(nodes){
            var tpObj = {};

            nodes.forEach(function (n) {
                tpObj[n.data['node-id']] = n.data['ietf-network-topology:termination-point'];
            });

            return tpObj;
        };

        /**
         * Method which wrap all objects with necessary props and functions for controller
         * @param networkObj
         */
        this.wrap = function(networkObj){

            networkObj.getDevicesForTable = function(){

                var DeviceObjForTable = function(data){
                    this.id = data['node-id'];
                    this.forwardingBoxName = data['ofl3-topology:forwarding-box-name'];
                    this.status = data['ofl3-topology:status'];
                    this.datapathType = data['ofl3-topology:datapath-type'];
                    this.datapathId = data['ofl3-topology:datapath-id'];
                    this.configFlowsCount = 0;
                    this.operationalFlowsCount = 0;
                    this.confAndOperFlowsCount = 0;

                    this.setFlowsTypeCount = setFlowsTypeCount;

                    function setFlowsTypeCount(flows){
                        this.configFlowsCount = flows[this.datapathId].filter(function(f){return f.status === 'config'}).length;
                        this.operationalFlowsCount = flows[this.datapathId].filter(function(f){return f.status === 'operational'}).length;
                        this.confAndOperFlowsCount = flows[this.datapathId].filter(function(f){return f.status === 'config + operational'}).length;
                    }
                };

                //TODO rest call config and operational invntory data
                return this.data && this.data.node && this.data.node.length ? 
                        this.data.node.filter(function(el){
                            return el.data['ofl3-topology:type'] === 'ofl3-topology:forwarding-box';
                        }).map(function(el){
                            return new DeviceObjForTable(el.data);
                        }) : [];
            };
        };

    }

    NetworkService.$inject=['NetworkModel', 'Restangular', 'UtilsService', 'LinksService', 'NextTopologyService'];


    return NetworkService;

});
