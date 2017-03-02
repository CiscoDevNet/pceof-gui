define([], function () {
    'use strict';

    function BGPRouteModel() {
        /**
         * constructor for BGPRoute model
         * @constructor
         */
        function BGPRoute(){
            this.data = {
                'ip-prefix' : '',
                'next-hop': [],
                'vrf-name': ''
            };
            this.setData = setData;
        }

        /**
         * Implementations
         */

        /**
         * Sets Data
         * @param bgpRouteData
         */
        function setData (bgpRouteData){
            /*jshint validthis:true */
            this.data['ip-prefix'] = bgpRouteData['ip-prefix'];
            this.data['next-hop'] = bgpRouteData['next-hop'] ? bgpRouteData['next-hop'] : [];
            this.data['vrf-name'] = bgpRouteData['vrf-name'];
        }

        return BGPRoute;
    }

    return BGPRouteModel;

});
