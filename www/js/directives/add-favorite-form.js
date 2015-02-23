'use strict';
angular.module('Trendicity')

.directive('addFavoriteForm', function() {
  return {
    restrict: 'E',
    scope: {
      'onSubmit': '&'
    },
    link: function($scope, $element, $attr) {
      $scope.submit = function() {
        $scope.formAddFavorite.$attempt = true;

        if ($scope.formAddFavorite.$valid) {
          $scope.onSubmit({ favorite: $scope.favorite });
        }
      };

      $scope.$on('modal.hidden', function() {
        // Clear form
        $scope.favorite = null;
        $scope.formAddFavorite.$attempt = false;
        $scope.formAddFavorite.$setPristine(true);
      });
    },
    templateUrl: 'templates/directives/add-favorite-form.html'
  };
});
