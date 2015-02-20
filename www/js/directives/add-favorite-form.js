'use strict';
angular.module('Trendicity')

.directive('addFavoriteForm', function() {
  return {
    restrict: 'E',
    scope: {
      'onSubmit': '&'
    },
    controller: function($scope) {
      $scope.submit = function(favorite) {
        $scope.onSubmit({ favorite: favorite });
      }
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
