define([''], function () {

    'use strict';

    /**
     * Controller for add/edit form for BGP Route
     * @constructor
     */
    function BGPRouteDialog($mdDialog, $scope, bgpRoute, BGPRouteService, ErrorHandlerService, constants) {

        /**
         * Object to work with, created copy from original object to not affect list of all routes
         */
        $scope.bgpRoute = angular.copy(bgpRoute);
        /**
         * Constants used for validation
         */
        $scope.constants = constants;
        /**
         * Used to display error msgs from controller
         * @type {Array}
         */
        $scope.errMsgs = [];
        /**
         * Used to check if ip-prefix of new object was changed
         */
        $scope.oldBgpRoute = bgpRoute;


        $scope.cancelDialog = cancelDialog;
        $scope.checkHops = checkHops;
        $scope.saveData = saveDataSubmit;

        /**
         * Implementations
         */

        /**
         * Used for validation of hops inserted to current bgpRoute
         */
        function checkHops(){
            $scope.bgpRouteForm.nextHopVal.invalidHops = $scope.bgpRoute.getInvalidHops();
        }

        /**
         * Close the dialog with cancel message
         */
        function cancelDialog(){
            $mdDialog.cancel();
        }

        /**
         * Used to hide dialog after succesfull put
         */
        function hideDialog(){
            $mdDialog.hide();
        }

        /**
         * If some error got from controller, add messages to errMsgs, which will be displayed in form
         * @param err
         */
        function savingErrorCBK(err){
            $scope.errMsgs = [];
            if(err){
                err.data.errors.error.forEach(function(curErrObj){$scope.errMsgs.push(curErrObj['error-message']);});
            }
        }

        /**
         * Put new object data if object with same ip-prefix doesn't exist
         */
        function saveData(){
            $scope.bgpRoute.putBGPRoute(function(data) {
                hideDialog();
            }, function(err) {
                savingErrorCBK(err);
            } );
        }

        /**
         * If ip-prefix of current object is not defined for any other existing object, saving data,
         * otherwise displaying error message via errMsgs
         */
        function saveDataSubmit(){

            if($scope.bgpRoute.data['ip-prefix'] === $scope.oldBgpRoute.data['ip-prefix']){
                saveData();
            }
            else{
                BGPRouteService.createBGPRoute().getBGPRoute($scope.bgpRoute.data['ip-prefix']).then(
                    function(){savingErrorCBK({data:{errors:{error:[{'error-message':'BGP Route with ip prefix '+$scope.bgpRoute.data['ip-prefix']+' already exists.'}]}}});},
                    saveData
                );
            }


        }
    }

    BGPRouteDialog.$inject=['$mdDialog', '$scope', 'bgpRoute', 'BGPRouteService', 'ErrorHandlerService', 'constants'];

    return BGPRouteDialog;
});
