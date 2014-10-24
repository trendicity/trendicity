'use strict';
angular.module('Trendicity')

.controller('FavoritesCtrl', function($scope) {
  $scope.favorites = [
    { city: 'Dallas, TX', id: 1 },
    { city: 'Willemstad, Curaçao', id: 2 },
  ];
});
