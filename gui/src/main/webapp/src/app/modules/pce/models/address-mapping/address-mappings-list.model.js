define([], function () {
    'use strict';

    function AddressMappingsListModel(AddressMappingService) {
        /**
         * constructor for AddressMappingsList model
         * @constructor
         */
        function AddressMappingsList (){
            this.data = [];

            this.setData = setData;
        }

        /**
         * Implementations
         */

        /**
         * Fills AddressMappingsList.data with data
         * @param addressMappingsListData {Array} Array of brp routes from server
         */
        function setData (addressMappingsListData){
            /*jshint validthis:true */
            var self = this;

            self.data = [];
            addressMappingsListData.forEach(function(amData) {
                self.data.push(AddressMappingService.createAddressMapping(amData));
            });
        }

        return AddressMappingsList;
    }

    AddressMappingsListModel.$inject=['AddressMappingService'];

    return AddressMappingsListModel;

});