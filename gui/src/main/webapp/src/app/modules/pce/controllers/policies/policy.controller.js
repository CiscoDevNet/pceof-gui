define([''], function () {

    'use strict';

    function PolicyCtrl($filter, $mdDialog, $scope, HopListService, NetworkService, NextTopologyService, PathService,
                        PolicyService, PolicyListService, UtilsService) {

        $scope.policyListConfig = [];
        $scope.policyListOperational = [];
        $scope.selectedObjects = {
            policy: null,
            pathBundle: null,
            path: null,
            segmentPolicy: null
        };
        $scope.tabContent = 'policyList';

        $scope.addEditPolicyDialog = addEditPolicyDialog;
        $scope.changeTabContent = changeTabContent;
        $scope.clearPaths = clearPaths;
        $scope.deletePolicyDialog = deletePolicyDialog;
        $scope.drawPathFromHops = drawPathFromHops;
        $scope.drawPathFromSegmentPolicy = drawPathFromSegmentPolicy;
        $scope.fadeInAllLayers = fadeInAllLayers;
        $scope.getLabelForNode = getLabelForNode;
        $scope.getNameForPath = getNameForPath;
        $scope.highlightNode = highlightNode;
        $scope.reloadConfigPolicy = reloadConfigPolicy;
        $scope.reloadOperationalPolicy = reloadOperationalPolicy;


        init();

        /**
         * Implementations
         */

        function addEditPolicyDialog() {

            $mdDialog.show({
                clickOutsideToClose: true,
                controller: 'AddPolicyCtrl',
                preserveScope: true,
                templateUrl: $scope.viewPath +'policy/add_dialog/dialog_add_policy.tpl.html',
                parent: angular.element(document.body),
                scope: $scope,
                locals: {
                    policy: $scope.selectedObjects.policy
                }
            });
        }

        /**
         * change tab content and fills data to appropriate object
         *
         * @param tabContentPart {string} name of the template
         * @param objectType {string} identifier of the object
         * @param object {Object} object value
         */
        function changeTabContent(tabContentPart, objectType, object) {
            $scope.tabContent = tabContentPart;

            if(objectType) {
                $scope.selectedObjects[objectType] = object;
            }

            togglePathsForPolicyDetail();
            clearSelectedObjects(objectType);
            init();
        }

        /**
         * Clears all paths from topology
         */
        function clearPaths() {
            NextTopologyService.clearPathLayer($scope.nxTopology);
        }

        /**
         * Clears data from $scope.selectedObjects, based on objectType parameter
         * @param objectType
         */
        function clearSelectedObjects(objectType) {
            switch(objectType) {
                case 'policy':
                    $scope.selectedObjects.pathBundle = null;
                    break;
                case 'pathBundle':
                    $scope.selectedObjects.path = null;
                    $scope.selectedObjects.segmentPolicy = null;
                    break;
                case 'path':
                case 'segmentPolicy':
                    break;
                default:
                    $scope.selectedObjects.policy = null;
            }
        }

        /**
         * Opens confirm dialog for deleting policies
         */
        function deletePolicyDialog() {
            var confirm = $mdDialog.confirm()
                .title('Delete policy')
                .textContent('Do you want to delete policy ' + $scope.selectedObjects.policy.data['policy-id'] + '?')
                //.targetEvent(ev)
                .ok('Delete')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function() {
                $scope.selectedObjects.policy.deletePolicy(
                    function() {
                        $scope.changeTabContent('policyList');
                        init();
                    },
                    function() {
                        console.log('error deleting policy');
                    }
                );
            }, function() {

            });
        }

        /**
         * Function draws path between two endpoints
         * @param pathData {Array} path object data
         */
        function drawPathFromHops(pathData) {
            var nodesRealIds = HopListService.getOrderedNodeIds(pathData.hop.data, $scope.topologyData.nodes, 'data.order');
            var nxLinksObjs = NetworkService.getLinksDataByNodes($scope.nxTopology, $scope.topologyData.nodes, nodesRealIds);

            NextTopologyService.highlightPath($scope.nxTopology, nxLinksObjs);
        }

        function drawPathFromSegmentPolicy(segmentPolicyData) {
            var links = segmentPolicyData.segment.data.filter(function(segment) {
                return segment.data['element-type'] === 'link';
            });

            console.log(links);
        }

        /**
         * Fades back in all layers. Good to use after highlighting.
         */
        function fadeInAllLayers() {
            NextTopologyService.fadeInAllLayers($scope.nxTopology);
        }

        /**
         * Returns the display name of node
         * @param nodeId {string} Id of the node
         * @returns {string} label of the node
         */
        function getLabelForNode(nodeId) {
            return NetworkService.getNodeByDataPath($scope.topologyData.nodes, nodeId);
        }

        /**
         * Creates descriptive name for path, based on path parameter
         * @param path
         */
        function getNameForPath(path) {
            return path && PathService.getPathNameFromHops(path.data);
        }

        function highlightNode(nodeLabel) {
            var result = UtilsService.findObjInArray($scope.topologyData.nodes, {label: nodeLabel}, 'id');

            NextTopologyService.highlightNode($scope.nxTopology, result, true);
        }

        /**
         * Initialisation. Reads the config and operational policy data.
         */
        function init() {
            $scope.reloadConfigPolicy();
            $scope.reloadOperationalPolicy();
        }

        /**
         * Read policy list from config data store
         */
        function reloadConfigPolicy () {
            var policyListConfig = PolicyListService.createPolicyList();
            policyListConfig.getPolicyList('config').then(function() {
                $scope.policyListConfig = policyListConfig;
            }, function() {
                $scope.policyListConfig = [];
            });
        }

        /**
         * Read policy list from operational data store
         */
        function reloadOperationalPolicy () {
            var policyListOperational = PolicyListService.createPolicyList();
            policyListOperational.getPolicyList('operational').then(function() {
                $scope.policyListOperational = policyListOperational;
                //console.log($scope.policyListOperational);
            }, function() {
                $scope.policyListOperational = [];
            });
        }

        /**
         *
         */
        function togglePathsForPolicyDetail() {
            if($scope.tabContent === 'pathDetail') {
                $scope.drawPathFromHops($scope.selectedObjects.path.data);
            }
            else {
                $scope.clearPaths();
            }
        }

        $scope.$on('RELOAD_POLICIES', function() {
            if($scope.tabContent !== 'policyDetail') {
                init();
            }
        });
    }

    PolicyCtrl.$inject=['$filter', '$mdDialog', '$scope', 'HopListService', 'NetworkService', 'NextTopologyService', 'PathService',
                        'PolicyService', 'PolicyListService', 'UtilsService'];

    return PolicyCtrl;
});
