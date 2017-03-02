define([''], function () {

    'use strict';

    function FlowsTableCtrl($scope) {

       $scope.filter = {
            options: {
                debounce: 500
            },
            show : false
        };

        $scope.query = {
            order: 'flow-name',
            limit: 25,
            page: 1,
            filter: ''
        };

        $scope.options = {
            boundaryLinks: true,
            pageSelector: true,
            rowSelection: true
        };

        $scope.removeFilter = function () {
            $scope.filter.show = false;
            $scope.query.filter = '';

            if($scope.filter.form.$dirty) {
              $scope.filter.form.$setPristine();
            }
        };
    }

    FlowsTableCtrl.$inject=['$scope'];

    return FlowsTableCtrl;
});
