define([], function () {
    'use strict';

    function AddressMappingsListService($filter, $q, AddressMappingsListModel, Restangular) {

        this.createAddressMappingsList = createAddressMappingsList;

        /**
         * Implementations
         */

        /**
         * Creates AddressMappingListModel object and adds methods and returns the object.
         * @returns {Object} AddressMappingsListModel object with service methods
         */
        function createAddressMappingsList () {
            var obj = new AddressMappingsListModel();

            obj.getAddressMappingsList = getAddressMappingsList;
            obj.allChecked = allChecked;
            obj.setExpirationTimes = setExirationTimes;
            obj.toggleAmChecked = toggleAmChecked;
            obj.toggleAllAms = toggleAllAms;
            obj.renewCheckedMappings = renewCheckedMappings;

            return obj;
        }

        function setExirationTimes(timeoutSetting){
            /*jshint validthis:true */
            var self = this;

            self.data.forEach(function(amObj){
                amObj.setExpirationTime(timeoutSetting);
            });
        }

        function allChecked(filter){
            /*jshint validthis:true */
            var self = this;

            filter = filter ? filter : '';

            var filtered = $filter('filter')(self.data, filter),
                filteredChecked = $filter('filter')(filtered, isChecked);
            return {
                checked : filtered.length === filteredChecked.length,
                indeterminate: filteredChecked.length > 0 && filteredChecked.length < filtered.length
            };

        }


        function renewCheckedMappings(filter){
            /*jshint validthis:true */
            var self = this;

            filter = filter ? filter : '';

            var promiseList = [],
                filtered = $filter('filter')(self.data, filter);

            filter = filter ? filter : '';

            promiseList = $filter('filter')(filtered, isChecked).map(refreshAM);
            return $q.all(promiseList);

            function refreshAM(amObj){
                return amObj.renew();
            }
        }

        function isChecked(amObj){
            return amObj.checked;
        }

        function toggleAllAms(filter, checked){
            /*jshint validthis:true */
            var self = this;
            filter = filter ? filter : '';
            var filteredItems = $filter('filter')(self.data, filter);

            filteredItems.forEach(toggleAm);

            function toggleAm(amObj){
                amObj.checked = checked;
            }
        }

        function toggleAmChecked(amObj){
            /*jshint validthis:true */
            var self = this;
            amObj.toggleChecked();
        }

        /**
         * Get list of address mappings from datastore and sets them to AddressMappingsListModel
         */
        function getAddressMappingsList() {
            /*jshint validthis:true */
            var self = this;
            var restObj = Restangular.one('restconf').one('operational').one('nd:AddressMapping');

            return restObj.get().then(function(data) {
                if(data.AddressMapping && data.AddressMapping.AddressMappingRecord) {
                    self.setData(data.AddressMapping.AddressMappingRecord);
                }
            });
        }
    }

    AddressMappingsListService.$inject=['$filter', '$q', 'AddressMappingsListModel', 'Restangular'];

    return AddressMappingsListService;

});
