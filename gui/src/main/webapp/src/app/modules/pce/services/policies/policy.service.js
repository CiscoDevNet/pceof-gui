define([], function () {
    'use strict';

    function PolicyService(PolicyModel, Restangular) {
        this.createPolicy = createPolicy;


        /**
         * Implementation
         */

        /**
         * Creates Policy object, fills it with policyData (if available), adds methods and returns the object.
         * @param policyData {Object} Data for one Policy object
         * @returns {Object} Policy object with service methods
         */
        function createPolicy (policyData) {
            var obj = new PolicyModel();

            if(policyData) {
                obj.setData(policyData);
            }

            obj.deletePolicy = deletePolicy;
            obj.getAllElementPolicies = getAllElementPolicies;
            obj.getAllSegmentPolicies = getAllSegmentPolicies;
            obj.getPolicy = getPolicy;
            obj.putPolicy = putPolicy;

            return obj;
        }

        function deletePolicy(successCallback, errorCallback) {
            /*jshint validthis: true */
            var self = this,
                restObj = Restangular.one('restconf').one('config').one('ofl3-policy:ofl3-policies')
                .one('policy').one(self.data['policy-id']);

            return restObj.remove().then(function(data) {
                successCallback(data);
            }, function(res) {
                errorCallback(res.data, res.status);
            });

        }

        /**
         * Get policy object from operational datastore, convert it to Policy object and return
         * @param policyId {string} Policy id
         * @returns {Object} Policy object
         */
        function getPolicy(policyId) {
            /*jshint validthis:true */
            var self = this;

            var restObj = Restangular.one('restconf').one('operational').one('ofl3-policy:ofl3-policies')
                .one('policy').one(self.data['policy-id'] || policyId);

            return restObj.get().then(function(data) {
                self.setData(data.policy[0]);
            });
        }

        /**
         *
         * @param successCallback
         * @param errorCallback
         * @returns {*}
         */
        function putPolicy(successCallback, errorCallback) {
            /*jshint validthis:true */
            var self = {};
            angular.copy(this, self);

            // PathBundleList converted to simple array of path bundles for putting into data store
            if(self.data['path-bundle']) {
                self.data['path-bundle'] = self.data['path-bundle'].getPathBundleArray();
            }

            var restObj = Restangular.one('restconf').one('config').one('ofl3-policy:ofl3-policies')
                .one('policy').one(self.data['policy-id']),
                dataObj = {policy: [self.data]};

            return restObj.customPUT(dataObj).then(function(data) {
                successCallback(data);
            }, function(res) {
				var errData = {
					"errCode": "POLICY_NOT_PUT",
					"errTitle": "Couldn't save policy",
					"errMsg": "You tried to save policy, but for some reason it is being complicated at this point.",
					"errResolution": "Check if controller is down, otherwise check your connection and input data.",
					"errObj": res
				};
                errorCallback(errData);
            });
        }

        function getAllElementPolicies() {
            /*jshint validthis:true */
            var retval = [];

            this.data['path-bundle'].data.forEach(function(pb) {
                if(pb.data.constraints && pb.data.constraints['element-policy'] && pb.data.constraints['element-policy'].data) {
                    pb.data.constraints['element-policy'].data.forEach(function(ep) {
                        retval.push(ep);
                    });
                }

            });

            return retval;
        }

        function getAllSegmentPolicies() {
            /*jshint validthis:true */
            var retval = [];

            this.data['path-bundle'].data.forEach(function(pb) {
                if(pb.data.constraints && pb.data.constraints['segment-policy'] && pb.data.constraints['segment-policy'].data) {
                    pb.data.constraints['segment-policy'].data.forEach(function(sp) {
                        retval.push(sp);
                    });
                }

            });

            return retval;
        }
    }

    PolicyService.$inject=['PolicyModel', 'Restangular'];

    return PolicyService;

});
