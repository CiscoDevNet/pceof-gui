define([], function () {
    'use strict';

    /**
     * Model for storing network data
     */
    function NetworkModel($filter) {

        /**
         * Network constructor
         * @constructor
         */
        function Network(data) {
            this.getAllTerminationPoints = getAllTerminationPoints;
            this.findNodeById = findNodeById;

            this.init();
            this.fill(data);
            this.processPortLinks();
        }

        Network.prototype.fill = fill;
        Network.prototype.init = init;
        Network.prototype.processPortLinks = processPortLinksForAllNodes;

        /**
         * Implementations
         */
        function getAllTerminationPoints(){
            var result = [];
            this.data.node.forEach(addNodeTPsToResult);
            return result;

            function addNodeTPsToResult(nodeObj){
                result = result.concat(nodeObj.data['ietf-network-topology:termination-point']);
            }
        }

        function findNodeById(id){
            var node = null,
                found = this.data.node.some(function (n) {
                    if (n.data['node-id'] === id){
                        node = n;
                    }

                    return n.data['node-id'] === id;
                });

            return node;
        }


        /**
         * Creates basic properties in object
         */
        function init(){

            this.data = {};
            this.data['network-id'] = "";
            this.data['ofl3-topology:links-in-group'] = [];
            this.data.node = [];
            this.data.connections = [];
            this.data['ietf-network-topology:link'] = [];
        }

        /**
         * Fills network data with data from controller
         * @param data
         */
        function fill(data){
            var networkObj = {},
                self = this.data,
                createObjHelper = new ObjectCreator();

            initFilling(data);

            /**
             * Implementations
             */

            /**
             * Object for creating our objects in lists instead of copying data from response data
             */
            function ObjectCreator(){

                this['ofl3-topology:links-in-group'] = createLinkInGroupObj;
                this.node = createNodeObj;
                this['ietf-network-topology:link'] = createLinkObj;
                this['ietf-network-topology:termination-point'] = createTerminationPointObj;

                function createLinkInGroupObj(sourceDataObj){
                    var LinkInGroup = function(sourceDataObj){
                        this.data = {};
                        cloneObj(sourceDataObj, this.data);
                    };

                    return new LinkInGroup(sourceDataObj);
                }

                function createNodeObj(sourceDataObj){
                    var Node = function(sourceDataObj){
                        this.data = {};

                        var nodeData = this.data;
                        /**
                         * Count of expanded ports in Nodes side panel
                         * @type {number}
                         */
                        this.expandedPortsCount = 0;

                        this.collapseAllPorts = collapseAllPorts;
                        this.expandAllPorts = expandAllPorts;
                        this.processPortLinks = processPortLinksForAllNodes;
                        this.updateData = updateData;

                        cloneObj(sourceDataObj, this.data);

                        /**
                         * Implementations
                         */

                        function expandAllPorts(){
                            nodeData['ietf-network-topology:termination-point'].map(function(tp){
                                tp.expand();
                            });
                        }

                        function collapseAllPorts(){
                            nodeData['ietf-network-topology:termination-point'].map(function(tp){
                                tp.collapse();
                            });
                        }

                        function updateData(data){
                            this.data = nodeData = data;
                        }

                    };

                    return new Node(sourceDataObj);
                }

                function createLinkObj(sourceDataObj){
                    var Link = function(sourceDataObj){
                        this.data = {};
                        cloneObj(sourceDataObj, this.data);
                    };

                    return new Link(sourceDataObj);
                }

                function createTerminationPointObj(sourceDataObj){
                    var TerminationPoint = function(sourceDataObj){
                        this.data = {};

                        /**
                         * If the port detail is expanded in Nodes side panel
                         * @type {boolean}
                         */
                        this.expanded = false;
                        this.networkLinkIds = []; // will be processed by Network model
                        this.bgpRoutes = [];  // will be processed by BGPRoutesList service

                        this.collapse = collapse;
                        this.expand = expand;
                        this.setBGPRoutes = setBGPRoutes;
                        this.toggleExpanded = toggleExpanded;

                        cloneObj(sourceDataObj, this.data);

                        /**
                         * Implementations
                         */

                        /**
                         * @param array of bgpRoutes objects
                         */
                        function setBGPRoutes(bgpRoutes){
                            this.bgpRoutes = bgpRoutes;
                        }

                        function toggleExpanded(){
                            this.expanded = !this.expanded;
                        }

                        function expand(){
                            this.expanded = true;
                        }

                        function collapse(){
                            this.expanded = false;
                        }

                    };

                    return new TerminationPoint(sourceDataObj);
                }
            }

            /**
             *  Copies all properties from source object to new object
             *  excepting props/lists which we want to have as a special object defined in ObjectCreator
             */
            function cloneObj(sourceObj, newObj){

                function createObjectsFromList(obj){
                    return obj[prop].map(function(el){
                        return createObjHelper[prop](el, newObj);
                    });
                }

                for (var prop in sourceObj){
                    if (sourceObj.hasOwnProperty(prop)) {  // check if prop is direct property, not inherited
                        if(!createObjHelper.hasOwnProperty(prop)){  //checking if its just a property or list defined in CreateObject
                            newObj[prop] = sourceObj[prop];
                        }else{
                            if(sourceObj[prop].length){
                                newObj[prop] = createObjectsFromList(sourceObj);
                            }
                        }
                    }
                }
            }

            /**
             * Start creating networkObject in this.data
             * @param data
             */
            function initFilling(data){
                networkObj = data && data.network && data.network.length ? data.network[0] : {};
                cloneObj(networkObj, self);
            }


        }

        function processPortLinksForAllNodes(){
            var networkData = this.data;

            networkData.node.map(processPortLinksForNode);

            function processPortLinksForNode(node){
                node.data['ietf-network-topology:termination-point'].map(processPLForPort);

                function processPLForPort(port){
                    var nodeId = node.data['node-id'],
                        portId = port.data['tp-id'],
                        networkLinkObjs = $filter('filter')(networkData['ietf-network-topology:link'], portIsSrcOrDest),
                        networkLinkIds = networkLinkObjs.map(function(linkObj){return linkObj.data['link-id'];});

                    port.networkLinkIds = networkLinkIds;

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
            }
        }

        return Network;
    }

    NetworkModel.$inject = ['$filter'];

    return NetworkModel;
});