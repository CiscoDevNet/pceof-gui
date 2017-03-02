define(['app/modules/pce/services/pce.service'], function () {

    'use strict';

    function PceCtrl($rootScope, $scope, $routeParams, NetworkService, NextTopologyService, PceMenuService, PceService, LinksService) {
        // scope properties
        $scope.mainMenu = [];
        $scope.page = 'topology';
        $scope.sidePanelPage = null;
        $scope.sidePanelCbk = null;
        $scope.viewPath = 'app/modules/pce/views/';

        // scope topo params
        $scope.topologyData = { nodes: [], links: []};
        $scope.nxDict = {};
        $scope.topologyLoaded = false;

        // whole network data
        $scope.networkData = {
            'ietf-network-topology:link': [],
            'network-id': '',
            node: [],
            'ofl3-topology:links-in-group': []
        };
        $scope.networkObj = null; // network model

        $scope.terminationPointsData = null;

        // scope methods
        $scope.broadcastFromRoot = broadcastFromRoot;
        $scope.closeSidePanel = closeSidePanel;
        $scope.hideProgressBar = hideProgressBar;
        $scope.openSidePanel = openSidePanel;
        $scope.showProgressBar = showProgressBar;
        $scope.updateTopologyData = updateTopologyData;

        // progressbar
        $scope.showProgressLine = false;

        loadMainMenu();

        // local variables
        var existingSidePanels = ['side_panel_nodes', 'side_panel_links', 'side_panel_policy', 'side_panel_flow_detail'];

        function broadcastFromRoot(eventName, val) {
            $scope.$broadcast(eventName, val);
        }

        /**
         * Loads main menu and sets current page, if existing
         */
        function loadMainMenu(){
            PceMenuService.loadMainMenu().then(function(menuData){
                $scope.mainMenu = PceMenuService.createPceMenu(menuData.data);
                if($scope.mainMenu.pageExists($routeParams.page)){
                    $scope.page = $routeParams.page;
                    $scope.mainMenu.setActivePage($scope.page);
                }else{
                    console.error('Not existins page', $routeParams.page);
                }
            });
        }


        /**
         * Closes side panel
         */
        function closeSidePanel() {
            $scope.sidePanelPage = null;
            NextTopologyService.fadeInAllLayers($scope.nxTopology);
            NextTopologyService.clearPathLayer($scope.nxTopology);
        }


        /**
         * Opens side panel and loads appropriate template file
         * @param page {string} page name
         */
        function openSidePanel(page, object, cbk) {
            var samePage = page === $scope.sidePanelPage;

            $scope.sidePanelCbk = cbk;
            $scope.sidePanelPage = page;
            $scope.sidePanelObject = object;

            if ( samePage &&  $scope.sidePanelCbk) {
                $scope.sidePanelCbk();
            }
        }

        /**
         * Loading topology data
         * @param successCbk
         */
        $scope.loadTopologyData = function (successCbk) {
            //reset nx dictionaries
            $scope.nxDict = setNewNxDict();
            //get data from controller and create network object with wraping
            NetworkService.getNetwork(function(networkObj){
                var rawTopoData = {
                        nodes: networkObj.data.node,
                        links: networkObj.data['ietf-network-topology:link'],
                        groups: networkObj.data['ofl3-topology:links-in-group']
                    },
                    topoData = {nodes: [], links:[]};

                if ( rawTopoData.nodes.length ) {
                    topoData.nodes = NetworkService.getNodesData(rawTopoData.nodes, $scope.nxDict);
                    topoData.links = NetworkService.getLinksData(rawTopoData.links, rawTopoData.groups, $scope.nxDict);
                    $scope.terminationPointsData = NetworkService.getTpData(rawTopoData.nodes);
                }

                $scope.topologyData = topoData;
                //console.debug('topoData', $scope.topologyData);
                $scope.networkData = networkObj.data;
                $scope.networkObj = networkObj;
                $scope.networkObj.data.connections = LinksService.processLinks($scope.networkData, $scope.nxDict, $scope.topologyData);

                $scope.topologyLoaded = true;



                if ( successCbk ) {
                    successCbk($scope.topologyData, $scope.nxDict);
                }
                //console.info('INFO :: PceCtrl Loading network -> ', networkObj, rawTopoData, topoData);
            }, function(){
                //error cbk
            });
        };

        /**
         * Utils - show progress bar
          */
        function showProgressBar() {
            $scope.showProgressLine = true;
        }

        /**
         * Utils - hide progress bar
         */
        function hideProgressBar() {
            $scope.showProgressLine = false;
        }

        /**
         * Utils - reset nx links and nodes dictionaries
         */
        function setNewNxDict(){
            return {
                nodes: new nx.data.Dictionary({}),
                links: new nx.data.Dictionary({})
            };
        }

        function updateTopologyData(nxTopoColors){
            NetworkService.updateTopologyStatuses($scope.nxTopology, $scope.nxDict, $scope.networkObj, setNewNxDict(), nxTopoColors, function () {

                if ( $scope.sidePanelPage ){
                    var refreshFunc = {
                        'side_panel_links': function(){
                            $scope.$broadcast('CONN_CHECK_SEL_LINK');
                        }
                    };

                    if ( refreshFunc[$scope.sidePanelPage] ){
                        refreshFunc[$scope.sidePanelPage]();
                    }
                }

            });
        }

        /**
         * Convert decimal to hexadecimal
         * @param decVal {string, number}
         */
        $scope.decToHex = function(decVal) {
            return PceService.convertDecToHex(decVal);
        };
    }
    

    PceCtrl.$inject=['$rootScope' ,'$scope', '$routeParams', 'NetworkService', 'NextTopologyService', 'PceMenuService', 'PceService', 'LinksService'];

    return PceCtrl;
});
