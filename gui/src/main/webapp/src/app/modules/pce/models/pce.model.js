define([], function () {
    'use strict';

    // FORM OF ANY FACTORY(MODEL)
    function PceModel() {
        function modelObj(){

        }

        modelObj.prototype.hello = function(){
            console.log('hello model');
        };

        return modelObj;
    }

    PceModel.$inject=[];

    return PceModel;
});
