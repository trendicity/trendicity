'use strict';
angular.module('Trendicity')

.directive('addFavoriteForm', function() {
  return {
    restrict: 'E',
    scope: {
      'onSubmit': '&'
    },
    link: function($scope, $element, $attr) {
      $scope.$on('modal.hidden', function() {
        // Clear form
        $scope.favorite = null;
        $scope.formAddFavorite.$setPristine(true);
      });
    },
    templateUrl: 'templates/directives/add-favorite-form.html'
  };
});
