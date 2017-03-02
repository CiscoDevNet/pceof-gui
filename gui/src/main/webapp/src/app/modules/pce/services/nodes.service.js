define([], function () {
    'use strict';

    function NodesService($filter) {

        this.getPortLinksInTopo = getPortLinksInTopo;
        this.findNodeByLabel = findNodeByLabel;

        /**
         * Returns array of links to be highlighted on port mouseenter in node detail
         * @param nodePortObj
         * @param topoData
         */
        function getPortLinksInTopo(tpObj, topoData){
            var networkLinkIds = tpObj.networkLinkIds,
                topoLinkObjs = $filter('filter')(topoData.links, hasNetworkLinkInGroup),
                topoLinkIds = topoLinkObjs.map(function(linkObj){return linkObj.id;});

            if(topoLinkIds.length > 1){
                console.warning('More than 1 link found!');
            }

            return topoLinkIds[0];

            /**
             * Returns true if topology link object contains some of networkLinkIds in gLink
             * @param topoLinkObj
             * @returns {boolean}
             */
            function hasNetworkLinkInGroup(topoLinkObj){
                var result = false;
                angular.forEach(topoLinkObj.gLinks, function(gLink){result = result || networkLinkIds.indexOf(gLink) !== -1;});
                return result;
            }

            /**
             * Returns true if link contains current nodeId and portId in source or destination
             * @param networkLinkObj
             * @returns {boolean}
             */
            function portIsSrcOrDest(networkLinkObj){
                return (networkLinkObj.data.source['source-tp'] === portId && networkLinkObj.data.source['source-node'] === nodeId) ||
                    (networkLinkObj.data.destination['dest-tp'] === portId && networkLinkObj.data.destination['dest-node'] === nodeId);
            }
        }

        /**
         * Return found node in network data by label
         * @param list
         * @param label
         */
        function findNodeByLabel(list, label){
            var node = list.filter(function (item) {
                    return item.data['node-id'] === label;
                });

            return node.length ? node[0] : null;
        }
    }

    NodesService.$inject = ['$filter'];

    return NodesService;

});
