define([], function () {
    'use strict';

    function BGPRoutesListModel(BGPRouteService) {
        /**
         * constructor for BGPRoutesList model
         * @constructor
         */
        function BGPRoutesList (){
            this.data = [];

            this.setData = setData;
        }

        /**
         * Implementations
         */

        /**
         * Fills BGPRouteList.data with data
         * @param bgpRouteListData {Array} Array of brp routes from server
         */
        function setData (bgpRouteListData){
            /*jshint validthis:true */
            var self = this;

            self.data = [];
            bgpRouteListData.forEach(function(bgpRouteData) {
                self.data.push(BGPRouteService.createBGPRoute(bgpRouteData));
            });
        }

        return BGPRoutesList;
    }

    BGPRoutesListModel.$inject=['BGPRouteService'];

    return BGPRoutesListModel;

});