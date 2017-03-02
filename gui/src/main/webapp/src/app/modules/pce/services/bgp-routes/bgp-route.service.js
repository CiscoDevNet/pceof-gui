define([], function () {
    'use strict';

    function BGPRouteService(BGPRouteModel, Restangular, constants) {

        this.createBGPRoute = createBGPRoute;

        /**
         * Implementations
         */

        /**
         * Creates BGPRoute object, fills it with bgpRouteData (if available), adds methods and returns the object.
         * @param bgpRouteData {Object} Data for one BGPRoute object
         * @returns {Object} BGPRoute object with service methods
         */
        function createBGPRoute (bgpRouteData) {
            var obj = new BGPRouteModel();

            if(bgpRouteData) {
                obj.setData(bgpRouteData);
            }

            obj.deleteBGPRoute = deleteBGPRoute;
            obj.getBGPRoute = getBGPRoute;
            obj.getInvalidHops = getInvalidHops;
            obj.putBGPRoute = putBGPRoute;

            return obj;
        }

        /**
         * Used for model validation
         * @returns {Array} of all hops, which are not valid ip-address
         */
        function getInvalidHops(){
            /*jshint validthis:true */
            var self = this;
            var result = [],
                regEx = new RegExp(constants.regexps['ip-address']);

            this.data['next-hop'].forEach(pushIfInvalid);
            return result;

            function pushIfInvalid(str){
                if(!regEx.test(str)){
                    result.push(str);
                }
            }

        }


        /**
         * Get BGPRoute object from config datastore, convert it to BGPRoute object and return
         * @param ipPrefix {string}
         * @returns {Object} promise
         */
        function getBGPRoute(ipPrefix) {
            /*jshint validthis:true */
            var self = this;

            var restObj = Restangular.one('restconf').one('config').one('ofl3-rib:rib').one('external-route').one(ipPrefix.replace(/\//g, '%2F'));

            return restObj.get().then(
				function(data) {
					self.setData(data['external-route']);
				}
			);
        }

        /**
         *
         * @param successCallback
         * @param errorCallback
         * @returns {*|angular.IPromise<TResult>}
         */
        function deleteBGPRoute(successCallback, errorCallback) {
            /*jshint validthis: true */
            var self = this,
                restObj = Restangular.one('restconf').one('config').one('ofl3-rib:rib')
                .one('external-route').one(self.data['ip-prefix'].replace(/\//g, '%2F'));

            return restObj.remove().then(function(data) {
                successCallback(data);
            }, function(res) {
                errorCallback(res.data, res.status);
            });

        }

        /**
         *
         * @param successCallback
         * @param errorCallback
         * @returns {*|angular.IPromise<TResult>}
         */
        function putBGPRoute(successCallback, errorCallback){
            /*jshint validthis:true */
            var self = this;

            var restObj = Restangular.one('restconf').one('config').one('ofl3-rib:rib')
                    .one('external-route').one(self.data['ip-prefix'].replace(/\//g, '%2F')),
                dataObj = {'external-route': self.data};

            return restObj.customPUT(dataObj).then(function(data) {
                successCallback(data);
            }, function(res) {
                errorCallback(res);
            });
        }

    }

    BGPRouteService.$inject=['BGPRouteModel', 'Restangular', 'constants'];

    return BGPRouteService;

});
