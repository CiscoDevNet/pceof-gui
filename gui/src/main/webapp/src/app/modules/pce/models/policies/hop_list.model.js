define([], function () {
    'use strict';

    function HopListModel(HopService) {
        /**
         * constructor for HopList model
         * @constructor
         */
        function HopList (){
            this.data = [];
        }

        HopList.prototype.setData = setData;

        /**
         * Implementations
         */

        /**
         * Fills HopList with data
         * @param hopListData {Array} Array of Hop items from server
         */
        function setData (hopListData){
            /*jshint validthis:true */
            var self = this;

            hopListData.forEach(function(hopData) {
                self.data.push(HopService.createHop(hopData));
            });
        }

        return HopList;
    }

    HopListModel.$inject=['HopService'];

    return HopListModel;

});
