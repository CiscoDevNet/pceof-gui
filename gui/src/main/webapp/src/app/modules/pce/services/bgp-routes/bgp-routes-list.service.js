define([], function () {
    'use strict';

    function BGPRoutesListService($filter, BGPRoutesListModel, Restangular) {

        this.createBGPRoutesList = createBGPRoutesList;

        /**
         * Implementations
         */

        /**
         * Creates BGPRoutesList object and adds methods and returns the object.
         * @returns {Object} BGPRoutesList object with service methods
         */
        function createBGPRoutesList () {
            var obj = new BGPRoutesListModel();

            obj.getBGPRoutesList = getBGPRoutesList;
            obj.getBGPRoutesForIPs = getBGPRoutesForIPs;

            return obj;
        }

        /**
         * Get list of bgp routes from datastore and sets them to BGPRoutesList
         */
        function getBGPRoutesList() {
            /*jshint validthis:true */
            var self = this;
            var restObj = Restangular.one('restconf').one('config').one('ofl3-rib:rib');

            return restObj.get().then(function(data) {
                if(data.rib['external-route']) {
                    self.setData(data.rib['external-route']);
                }
            });
        }

        /**
         * Filters only BGP Routes, which contain some of ipAddresses in next-hop array and set them to result obj
         * using ip address as key
         *
         * @param bgpRoutesListObj
         * @param array of strings ipAddress
         * @returns object
         */
        function getBGPRoutesForIPs(ipAddresses){
            /*jshint validthis:true */
            var self = this;
            var result = {};

            ipAddresses.forEach(checkOneIP);

            return result;

            function checkOneIP(ipAddress){
                result[ipAddress] = $filter('filter')(self.data, routeHasHop);

                function routeHasHop(bgpRouteObj){
                    return bgpRouteObj.data['next-hop'].indexOf(ipAddress) !== -1 ;
                }
            }
        }
    }

    BGPRoutesListService.$inject=['$filter', 'BGPRoutesListModel', 'Restangular'];

    return BGPRoutesListService;

});
