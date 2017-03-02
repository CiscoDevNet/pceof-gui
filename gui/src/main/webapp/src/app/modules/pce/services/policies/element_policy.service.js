define([], function () {
    'use strict';

    function ElementPolicyService(ElementPolicyModel) {
        this.createElementPolicy = createElementPolicy;

        /**
         * Implementation
         */

        /**
         * Creates ElementPolicy object, fills it with ElementPolicyData (if available), adds methods and returns the object.
         * @param elementPolicyData {Object} Data for one ElementPolicy object
         * @returns {Object} ElementPolicy object with service methods
         */
        function createElementPolicy(elementPolicyData, pathBundleId) {
            var obj = new ElementPolicyModel();

            if(elementPolicyData) {
                obj.setData(elementPolicyData, pathBundleId);
            }

            return obj;
        }
    }

    ElementPolicyService.$inject=['ElementPolicyModel'];

    return ElementPolicyService;

});
