define([''], function () {

    'use strict';
    /**
     * Controller for nodes on right panel in topology
     *
     * @param $scope
     * @param NetworkService
     * @constructor
     */
    function NodesCtrl($scope, BGPRoutesListService, NetworkService, NextTopologyService, NodesService, UtilsService) {

        // scope variables
        $scope.selectedNode = null;
        $scope.bgpRoutesList = null;

        // scope functions
        $scope.deselectNode = deselectNode;
        $scope.fadeAllIfNoNodeSelected = fadeAllIfNoNodeSelected;
        $scope.fadeInAllLayers = fadeInAllLayers;
        $scope.fadeOutAllLayers = fadeOutAllLayers;
        $scope.highlightNode = highlightNode;
        $scope.highlightPortLink = highlightPortLink;
        $scope.selectNode = selectNode;


        init();

        /**
         * Implementations
         */

        function init(){
            var bgpRoutesList = BGPRoutesListService.createBGPRoutesList(),
                tps = $scope.networkObj.getAllTerminationPoints();

            // set all bgp routes for all termination points in network object
            bgpRoutesList.getBGPRoutesList().then(function(){tps.map(setBGPRoutesToTP);});

            function setBGPRoutesToTP(tpObj){
                if(tpObj.data.hasOwnProperty('ofl3-topology:ip-address')){
                    tpObj.setBGPRoutes(bgpRoutesList.getBGPRoutesForIPs(tpObj.data['ofl3-topology:ip-address']));
                }
            }
        }

        function selectNode(nodeObject) {
            $scope.selectedNode = nodeObject;
            $scope.highlightNode(nodeObject);
        }

        function deselectNode(){
            $scope.selectedNode = null;
            $scope.fadeInAllLayers();
        }

        function highlightNode(nodeObj){
            var topoNode = UtilsService.findObjInArray($scope.topologyData.nodes, {'node-id': nodeObj.data['node-id']}, 'id');
            NextTopologyService.highlightNode($scope.nxTopology, topoNode, false);
        }

        function fadeAllIfNoNodeSelected(){
            if($scope.selectedNode === null){
                fadeInAllLayers();
            }
        }

        /**
         * Fades back in all layers. Good to use after highlighting.
         */
        function fadeInAllLayers() {
            NextTopologyService.fadeInAllLayers($scope.nxTopology);
        }
        function fadeOutAllLayers() {
            NextTopologyService.fadeOutAllLayers($scope.nxTopology);
        }

        function highlightPortLink(tpObj){
            var linkId = NodesService.getPortLinksInTopo(tpObj, $scope.topologyData);
            if(linkId){
                NextTopologyService.highlightLink($scope.nxTopology, linkId);
            }
            else{
                NextTopologyService.fadeOutAllLayers($scope.nxTopology);
            }
        }

        /**
         * Watcher for selecting selected node another ctrl
         */
        $scope.$on('SELECT_NODE',function (e, newVal, oldVal) {
            var nodeLabel = newVal._model._data.label;
            //console.log('SELECT_NODE', newVal, nodeLabel);
            $scope.selectNode(NodesService.findNodeByLabel($scope.networkData.node, nodeLabel));
        });

    }

    NodesCtrl.$inject = ['$scope', 'BGPRoutesListService', 'NetworkService', 'NextTopologyService', 'NodesService', 'UtilsService'];

    return NodesCtrl;
});
