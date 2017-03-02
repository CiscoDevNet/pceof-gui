define([], function () {
    'use strict';

    function LinksService($filter) {

        this.processLinks = processLinks;
        this.setConnectionsColors = setConnectionsColors;
        this.findConnectionById = findConnectionById;
        this.findLinkByPorts = findLinkByPorts;

        function findLinkByPorts(list, port1, port2){
            var link = null;
            list.some(function (item) {
                if ( item.port1 === port1 && item.port2 === port2 ) {
                    link = item;
                }
                return item.port1 === port1 && item.port2 === port2;
            });

            return link;
        }

        function findConnectionById(list, id){
            var result = $filter('filter')(list, {id : id});

            return result.length ? result[0] : null;
        }

        function setConnectionsColors(connections, topologyData){
            //console.warn('connections, topologyData',connections, topologyData);
            connections.forEach(setConnectionColor, topologyData);

            /**
             * Finds connectionObj in links in topologyData and sets its color
             * @param connectionObj
             * @param topologyData
             */
            function setConnectionColor(connectionObj){
                var topoLinkArr = $filter('filter')(topologyData.links, connectionIsCurrentLink);

                connectionObj.color = topoLinkArr.length > 0 ? topoLinkArr[0].linkColor : '#000000';

                function connectionIsCurrentLink(topoLink){
                    return topoLink.id === connectionObj.id;
                }
            }
        }

        function processLinks(networkData, nxDict, topologyData){
            var connectionsObj = {},
                connections = [];

            //console.debug(networkData);
            networkData['ietf-network-topology:link'].forEach(processLink);
            connections = Object.keys(connectionsObj).map(function(con){return connectionsObj[con];});
            setConnectionsColors(connections, topologyData);

            return connections;


            function processLink(link){
                var srcNodeId = nxDict.nodes.getItem(link.data.source['source-node']),
                    tarNodeId = nxDict.nodes.getItem(link.data.destination['dest-node']),
                    connectionKey = srcNodeId < tarNodeId ? srcNodeId + '-' + tarNodeId : tarNodeId + '-' + srcNodeId,
                    connection = null;

                if(connectionsObj.hasOwnProperty(connectionKey)){
                    connection = connectionsObj[connectionKey];
                }else {
                    connection = new Connection();
                    connection.id = connectionKey;
                    connection.sourceName = link.data.source['source-node'];
                    connection.targetName = link.data.destination['dest-node'];
                    if(srcNodeId > tarNodeId) {
                        connection.caption = connection.targetName + ' - ' + connection.sourceName;
                    }
                    else {
                        connection.caption = connection.sourceName + ' - ' + connection.targetName;
                    }
                    connectionsObj[connectionKey] = connection;
                }

                var existingConnectionLink = $filter('filter')(connection.connectionLinks, checkBiLink);

                if(existingConnectionLink.length > 0){
                    existingConnectionLink[0].links.push(link.data);
                }
                else{
                    var newConLink = new ConnectionLink();
                    newConLink.port1 = link.data.source['source-tp'];
                    newConLink.port2 = link.data.destination['dest-tp'];
                    newConLink.links.push(link.data);
                    // todo: check
                    newConLink.status = link.data['ofl3-topology:status'];
                    connection.connectionLinks.push(newConLink);
                    connection.status[link.data['ofl3-topology:status']]++;
                    //console.debug('status', link.data['ofl3-topology:status']);
                    if(link.data['ofl3-topology:status']==='operational'){
                        connection.status.configured++;
                    }
                }

                connection.ecmp = connection.connectionLinks.length > 1;

                function checkBiLink(conLink){
                    return conLink.port1 == link.data.source['source-tp'] && conLink.port2 == link.data.destination['dest-tp'] ||
                            conLink.port1 == link.data.destination['dest-tp'] && conLink.port2 == link.data.source['source-tp'];
                }

            }

            function Connection(){
                this.id = '';
                this.sourceName = '';
                this.targetName = '';
                this.caption = '';
                this.color = '';
                this.status = {
                    configured: 0,
                    operational: 0
                };
                this.ecmp = false;
                this.connectionLinks = [];
            }

            function ConnectionLink(){
                this.port1 = '';
                this.port2 = '';
                this.status = '';
                this.links = [];
            }


        }

    }

    LinksService.$inject = ['$filter'];

    return LinksService;

});
