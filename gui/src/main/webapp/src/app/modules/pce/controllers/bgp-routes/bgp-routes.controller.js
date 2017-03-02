define([''], function () {

    'use strict';
    /**
     * Controller for BGP routes
     *
     * @param $scope
     * @constructor
     */
    function BGPRoutesCtrl($scope, BGPRoutesListService, BGPRouteService, $mdDialog) {

        /**
         * Local variables
         */
        var dialogOptions = {
            clickOutsideToClose: true,
            controller: 'BGPRouteDialogCtrl',
            preserveScope: true,
            templateUrl: 'app/modules/pce/views/dialog_bgp-route.tpl.html',
            parent: angular.element(document.body),
            scope: $scope,
            locals: {

            }
        };

        /**
         * Scope variables
         */
        $scope.bgpRoutesList = {};
        $scope.selectedBGPRoute = null;

        $scope.bgpTableFilter = {
            options: {
                debounce: 500
            },
            show : false
        };

        $scope.bgpTableQuery = {
            order: "data['ip-prefix']",
            limit: 25,
            page: 1,
			options: [25, 50, 100],
            filter: ''
        };

        /**
         * Scope functions
         */
        $scope.deleteRoute = deleteRoute;
        $scope.editRoute = editRoute;
        $scope.init = init;
        $scope.removeBGPTableFilter = removeBGPTableFilter;
        $scope.loadBgpRoutesList = loadBgpRoutesList;
        $scope.addRoute = addRoute;

        init();
        //console.debug($scope.bgpRoutesList);

        /**
         * Implementations
         */

        function editRoute(routeObj, event){
            dialogOptions.locals.bgpRoute = routeObj;
            dialogOptions.targetEvent = event;
            $mdDialog.show(dialogOptions).then(loadBgpRoutesList);
        }

        function deleteRoute(routeObj){
            var confirm = $mdDialog.confirm()
                .title('Delete BGP Route')
                .textContent('Do you want to delete BGP Route ' + routeObj.data['ip-prefix'] + '?')
                .ok('Delete')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function() {
                routeObj.deleteBGPRoute(
                    init,
                    function() {
                        console.log('error deleting bgp route');
                    }
                );
            }, function() {

            });
        }

        function addRoute(event){
            dialogOptions.locals.bgpRoute = BGPRouteService.createBGPRoute();
            dialogOptions.targetEvent = event;
            $mdDialog.show(dialogOptions).then(loadBgpRoutesList);
        }

        function loadBgpRoutesList(){
            $scope.showProgressBar();
            $scope.bgpRoutesList.getBGPRoutesList().then(function(){$scope.hideProgressBar();}, function(){$scope.hideProgressBar();});

        }

        function init(){
            $scope.bgpRoutesList = BGPRoutesListService.createBGPRoutesList();
            loadBgpRoutesList();
        }

        function removeBGPTableFilter(){
            $scope.bgpTableFilter.show = false;
            $scope.bgpTableQuery.filter = '';

            if($scope.bgpTableFilter.form.$dirty) {
                $scope.bgpTableFilter.form.$setPristine();
            }
        }

    }

    BGPRoutesCtrl.$inject = ['$scope', 'BGPRoutesListService', 'BGPRouteService', '$mdDialog'];

    return BGPRoutesCtrl;
});
