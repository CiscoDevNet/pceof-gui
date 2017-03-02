define([''], function () {

    'use strict';
    /**
     * Controller for connections (links) on right panel in topology
     *
     * @param $scope
     * @constructor
     */
    function LinksCtrl($scope, LinksService, NextTopologyService) {

        $scope.selectedConnection = null;
        $scope.selectedConnectionLink = null;

        $scope.deselectConnection = deselectConnection;
        $scope.deselectConnectionLink = deselectConnectionLink;
        $scope.fadeInAllLayers = fadeInAllLayers;
        $scope.highlightConnection = highlightConnection;
        $scope.selectConnection = selectConnection;
        $scope.selectConnectionLink = selectConnectionLink;

        $scope.connections = $scope.networkObj.data.connections;
        LinksService.setConnectionsColors($scope.connections, $scope.topologyData);
        console.debug('connections', $scope.connections);

        function highlightConnection(connection){
            //console.debug('highlighting', connection);
            NextTopologyService.highlightLink($scope.nxTopology, connection.id);
        }

        function fadeInAllLayers() {
            if($scope.selectedConnection===null){
                NextTopologyService.fadeInAllLayers($scope.nxTopology);
            }
        }

        function selectConnection(connection){
            $scope.selectedConnection = connection;
            highlightConnection(connection);
        }

        function deselectConnection(){
            $scope.selectedConnection = null;
            fadeInAllLayers();
        }

        function selectConnectionLink(connectionLink){
            $scope.selectedConnectionLink = connectionLink;
        }

        function deselectConnectionLink(){
            $scope.selectedConnectionLink = null;
        }

        /**
         * Watcher for selecting selected link from another ctrl
         */
        $scope.$on('SELECT_CONNECTION',function (e, newVal, oldVal) {
            var linkId = newVal._model._data.id;
            selectConnection(LinksService.findConnectionById($scope.connections, linkId));
        });

        $scope.$on('CONN_CHECK_SEL_LINK', function () {
            if ( $scope.selectedConnectionLink ) {
                var port1 = $scope.selectedConnectionLink.port1,
                    port2 = $scope.selectedConnectionLink.port2,
                    foundLink = LinksService.findLinkByPorts($scope.selectedConnection.connectionLinks, port1, port2);

                $scope.deselectConnectionLink();
                $scope.selectConnectionLink(foundLink);
            }
        });

    }

    LinksCtrl.$inject = ['$scope', 'LinksService', 'NextTopologyService'];

    return LinksCtrl;
});
