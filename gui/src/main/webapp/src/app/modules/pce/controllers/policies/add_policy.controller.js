define([''], function () {

    'use strict';

    function AddPolicyCtrl($mdDialog, $q, $scope, policy, PathBundleService, PathBundleListService, WizardService,
                           PolicyService, ElementPolicyService, ElementPolicyListService, SegmentPolicyService,
                           SegmentPolicyListService, SegmentService, UtilsService) {

        $scope.initObject = {
            'segmentPolicy': function() {
                $scope.segmentPolicy = SegmentPolicyService.createSegmentPolicy();
            },
            'elementPolicy': function() {
                $scope.elementPolicy = ElementPolicyService.createElementPolicy();
            },
            'pathBundle': function() {
                $scope.pathBundle = PathBundleService.createPathBundle();
            },
            'segment': function() {
                $scope.segment = SegmentService.createSegment();
            }
        }

        // form objects
        $scope.wizardConfig = {};
        $scope.wizardStep = null;

        $scope.policy = policy ? policy : PolicyService.createPolicy();

        $scope.initObject['elementPolicy']();
        $scope.initObject['pathBundle']();
        $scope.initObject['segmentPolicy']();
        $scope.initObject['segment']();

        $scope.editedPathBundleIndex = null;
        $scope.editedElementPolicyIndex = null;
        $scope.editedSegmentPolicyIndex = null;
        // display switches
        $scope.displayPathBundleForm = false;
        $scope.displayElementPolicyForm = false;
        $scope.displaySegmentPolicyForm = false;

        $scope.getWizardConfig = getWizardConfig;
        $scope.displayStep = displayStep;

        $scope.stepBack = stepBack;
        $scope.stepForward = stepForward;
        $scope.getStepIndex = getStepIndex;

        $scope.addPathBundleToList = addPathBundleToList;
        $scope.addElementPolicyToList = addElementPolicyToList;
        $scope.addSegmentPolicyToList = addSegmentPolicyToList;
        $scope.addSegmentToList = addSegmentToList;
        $scope.closeDialog = closeDialog;
        $scope.deleteElementPolicyFromList = deleteElementPolicyFromList;
        $scope.deletePathBundleFromList = deletePathBundleFromList;
        $scope.deleteSegmentPolicyFromList = deleteSegmentPolicyFromList;
        $scope.deleteSegmentFromList = deleteSegmentFromList;
        $scope.fillElementPolicyForm = fillElementPolicyForm;
        $scope.fillPathBundleForm = fillPathBundleForm;
        $scope.fillSegmentPolicyForm = fillSegmentPolicyForm;
        $scope.getAllElementPolicies = getAllElementPolicies;
        $scope.getAllSegmentPolicies = getAllSegmentPolicies;
        $scope.hideForm = hideForm;
        $scope.saveData = saveData;
        $scope.showForm = showForm;
        $scope.clearEmptyValues = clearEmptyValues;

        init();


        function init() {
            $scope.getWizardConfig();
        }

        function displayStep(step) {
            $scope.wizardStep = step;
        }

        function stepBack() {
            var index = getStepIndex();

            if(index-- >=0) {
                $scope.displayStep($scope.wizardConfig[index--]);
            }
        }

        function stepForward() {
            var index = getStepIndex();

            if($scope.wizardConfig.length > index++) {
                $scope.displayStep($scope.wizardConfig[index++]);
            }
        }

        function getStepIndex() {
            return $scope.wizardConfig.indexOf($scope.wizardStep);
        }

        function addElementPolicyToList() {
            var elementPolicyCopy = {};
            angular.copy($scope.elementPolicy, elementPolicyCopy);

            var pathBundleObject = UtilsService.findObjInArray($scope.policy.data['path-bundle'].data, {data: {'bundle-id': elementPolicyCopy.pathBundleId}});

            if(!pathBundleObject.data.constraints['element-policy']) {
                pathBundleObject.data.constraints['element-policy'] = ElementPolicyListService.createElementPolicyList();
            }

            if($scope.editedElementPolicyIndex !== null) {
                pathBundleObject.data.constraints['element-policy'].data[$scope.editedElementPolicyIndex] = elementPolicyCopy;
            }
            else {
                pathBundleObject.data.constraints['element-policy'].data.push(elementPolicyCopy);
            }

            $scope.editedElementPolicyIndex = null;
            $scope.initObject['elementPolicy']();

            $scope.hideForm('displayElementPolicyForm');
        }

        function addPathBundleToList() {
            var pathBundleCopy = {};
            angular.copy($scope.pathBundle, pathBundleCopy);

            if(!$scope.policy.data['path-bundle']) {
                $scope.policy.data['path-bundle'] = PathBundleListService.createPathBundleList();
            }

            if($scope.editedPathBundleIndex !== null) {
                $scope.policy.data['path-bundle'].data[$scope.editedPathBundleIndex] = pathBundleCopy;
            }
            else {
                $scope.policy.data['path-bundle'].data.push(pathBundleCopy);
            }

            $scope.editedPathBundleIndex = null;
            $scope.initObject['pathBundle']();

            $scope.hideForm('displayPathBundleForm');
        }

        function addSegmentToList() {
            $scope.initObject['segment']();

            if(!$scope.segmentPolicy.data.segment) {
                $scope.segmentPolicy.data.segment = SegmentListService.createSegmentList();
            }

            $scope.segmentPolicy.data.segment.data.push($scope.segment);
        }

        function addSegmentPolicyToList() {
            var segmentPolicyCopy = {};
            angular.copy($scope.segmentPolicy, segmentPolicyCopy);

            var pathBundleObject = UtilsService.findObjInArray($scope.policy.data['path-bundle'].data, {data: {'bundle-id': segmentPolicyCopy.pathBundleId}});

            if(!pathBundleObject.data.constraints['segment-policy']) {
                pathBundleObject.data.constraints['segment-policy'] = SegmentPolicyListService.createSegmentPolicyList();
            }

            if($scope.editedSegmentPolicyIndex !== null) {
                pathBundleObject.data.constraints['segment-policy'].data[$scope.editedSegmentPolicyIndex] = segmentPolicyCopy;
            }
            else {
                pathBundleObject.data.constraints['segment-policy'].data.push(segmentPolicyCopy);
            }

            $scope.editedSegmentPolicyIndex = null;
            $scope.initObject['segmentPolicy']();

            $scope.hideForm('displaySegmentPolicyForm');
        }

        function closeDialog() {
            $mdDialog.cancel();
        }

        function deleteElementPolicyFromList(elementPolicy) {
            var pathBundleObject = UtilsService.findObjInArray($scope.policy.data['path-bundle'].data, {data: {'bundle-id': elementPolicy.pathBundleId}});

            if(pathBundleObject.data.constraints['element-policy'] && pathBundleObject.data.constraints['element-policy'].data) {
                pathBundleObject.data.constraints['element-policy'].data.splice(pathBundleObject.data.constraints['element-policy'].data.indexOf(elementPolicy), 1);
            }
        }

        function deleteSegmentPolicyFromList(segmentPolicy) {
            var pathBundleObject = UtilsService.findObjInArray($scope.policy.data['path-bundle'].data, {data: {'bundle-id': segmentPolicy.pathBundleId}});

            if(pathBundleObject.data.constraints['segment-policy'] && pathBundleObject.data.constraints['segment-policy'].data) {
                pathBundleObject.data.constraints['segment-policy'].data.splice(pathBundleObject.data.constraints['segment-policy'].data.indexOf(segmentPolicy), 1);
            }
        }

        function deleteSegmentFromList(index) {
            if($scope.segmentPolicy.data.segment && $scope.segmentPolicy.data.segment.data) {
                $scope.segmentPolicy.data.segment.data.splice(index, 1);
            }
        }

        function deletePathBundleFromList(index) {
            if($scope.policy.data['path-bundle'] && $scope.policy.data['path-bundle'].data) {
                $scope.policy.data['path-bundle'].data.splice(index, 1);
            }
        }

        function fillElementPolicyForm(elementPolicy, index) {
            $scope.elementPolicy = elementPolicy;
            $scope.editedElementPolicyIndex = index;

            $scope.showForm('displayElementPolicyForm');
        }

        function fillSegmentPolicyForm(segmentPolicy, index) {
            $scope.segmentPolicy = segmentPolicy;
            $scope.editedSegmentPolicyIndex = index;

            $scope.showForm('displaySegmentPolicyForm');
        }

        function fillPathBundleForm(pathBundle, index) {
            $scope.pathBundle = pathBundle;
            $scope.editedPathBundleIndex = index;

            $scope.showForm('displayPathBundleForm');
        }

        function getAllElementPolicies() {
            return $scope.policy.getAllElementPolicies();
        }

        function getAllSegmentPolicies() {
            return $scope.policy.getAllSegmentPolicies();
        }

        function hideForm(formVariable) {
            $scope[formVariable] = false;

        }

        function saveData() {
            $scope.policy.putPolicy(function(data) {
                $scope.closeDialog();
                $scope.broadcastFromRoot('RELOAD_POLICIES');
            }, function(err) {
            } );
        }

        function getWizardConfig(){
            WizardService.getConfig('wizard_policy', $scope.policy.type, function(data) {
                $scope.wizardConfig = data;
                displayStep($scope.wizardConfig[0]);
            });
        }

        function showForm(formDisplayValue, objectInit) {
            $scope[formDisplayValue] = true;

            objectInit && $scope.initObject[objectInit]();
        }

        function clearEmptyValues(data, key) {
            if(data[key] === "") {
                data[key] = undefined;
            }
        }
    }

    AddPolicyCtrl.$inject=['$mdDialog', '$q', '$scope', 'policy', 'PathBundleService', 'PathBundleListService',
        'WizardService','PolicyService', 'ElementPolicyService', 'ElementPolicyListService', 'SegmentPolicyService',
        'SegmentPolicyListService', 'SegmentService', 'UtilsService'];

    return AddPolicyCtrl;
});
