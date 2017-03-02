define([], function () {
    'use strict';

    function ElementPolicyListService(ElementPolicyListModel) {
        this.createElementPolicyList = createElementPolicyList;

        /**
         * Implementation
         */

        /**
         * Creates ElementPolicyList object and adds methods and returns the object.
         * @returns {Object} ElementPolicyList object with service methods
         */
        function createElementPolicyList () {
            var obj = new ElementPolicyListModel();

            obj.getElementPolicyArray = getElementPolicyArray;

            return obj;
        }

        /**
         * Creates flat array of items from Element Policy list structure
         * @returns {Array}
         */
        function getElementPolicyArray() {
            /*jshint validthis:true */
            var result = [],
                self = this;

            self.data.forEach(function(ep) {
                result.push(ep.data);
            });

            return result;
        }
    }

    ElementPolicyListService.$inject=['ElementPolicyListModel'];

    return ElementPolicyListService;

});
