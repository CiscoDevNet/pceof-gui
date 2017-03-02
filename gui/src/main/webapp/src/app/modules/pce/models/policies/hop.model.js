define([], function () {
    'use strict';

    function HopModel() {
        /**
         * constructor for Hop model
         * @constructor
         */
        function Hop (){
            this.data = {};
        }

        Hop.prototype.setData = setData;

        /**
         * Implementations
         */

        /**
         * extends Hop prototype
         * @param hopData
         */
        function setData (hopData){
            /*jshint validthis:true */
            this.data.order = hopData.order;
            this.data['node-name'] = hopData['node-name'];
            this.data['in-tp-id'] = hopData['in-tp-id'];
            this.data['out-tp-id'] = hopData['out-tp-id'];
            this.data['cross-connect'] = hopData['cross-connect'];
        }

        return Hop;
    }

    HopModel.$inject=[];

    return HopModel;

});
