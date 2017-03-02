define([], function () {
    'use strict';

    /**
     * Model for storing network data
     */
    function FlowModel() {
        /**
         * Flow constructor
         * @constructor
         */
        function Flow(data, status, deviceIdNotParsed) {
            this.init();    //create empty flow object
            this.fill(data, status, deviceIdNotParsed);    //fill flow object with data from controller
        }

        /**
         * extends Flow prototype
         */
        Flow.prototype = {
            //create basic properties in object
            init: function(){
                this.id = "";
                this.instructions = {};
                this.match = {};
                this.priority = "";
                this.table_id = "";
                this['flow-name'] = "";
                this.status = "";
            },
            //fill network object with data from controller
            fill: function(data, status, deviceIdNotParsed){
                this.id = data.id;
                this.instructions = data.instructions.instruction[0]['apply-actions'].action[0];
                this.match = data.match;
                this.priority = data.priority;
                this.table_id = data.table_id;
                this['flow-name'] = data['flow-name'];
                this.status = status;

                this.deviceIdNotParsed = deviceIdNotParsed;
            }
        };

        return Flow;
    }

    FlowModel.$inject=[];

    return FlowModel;
});