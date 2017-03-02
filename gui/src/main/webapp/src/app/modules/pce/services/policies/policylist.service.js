define([], function () {
    'use strict';

    function PolicyListService(PolicyListModel, Restangular) {
        this.createPolicyList = createPolicyList;

        /**
         * Implementation
         */

        /**
         * Creates PolicyList object and adds methods and returns the object.
         * @returns {Object} PolicyList object with service methods
         */
        function createPolicyList () {
            var obj = new PolicyListModel();

            obj.getPolicyList = getPolicyList;

            return obj;
        }

        /**
         * Get list of policy items from operational datastore and sets them to PolicyList
         */
        function getPolicyList(dataStore) {
            /*jshint validthis:true */
            var self = this;

            var restObj = Restangular.one('restconf').one(dataStore).one('ofl3-policy:ofl3-policies');

            return restObj.get().then(function(data) {
                if(data['ofl3-policies'].policy) {
                    self.setData(data['ofl3-policies'].policy);
                }
            });
        }
    }

    PolicyListService.$inject=['PolicyListModel', 'Restangular'];

    return PolicyListService;

});
