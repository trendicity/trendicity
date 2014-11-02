'use strict';
angular.module('Trendicity')

.controller('CardViewCtrl', function ($scope) {
  console.log('Inside CardViewCtrl...');
  $scope.$root.canDragContent = false;
})

.controller('CardCtrl', function ($scope, InstagramService) {
  console.log('Inside CardCtrl....');

  $scope.cardTransitionedLeft = function(index) {
    console.log('cardTransitionedLeft called with index:' + index);
    // TODO: If user liked the post previously, unlike it
  };

  $scope.cardTransitionedRight = function(index) {
    console.log('cardTransitionedRight called with index:' + index);
    var post = $scope.posts[index];
    console.log('post.id:' + post.id);

    InstagramService.likePost(post.id)
    .success(function(data) {
      console.log('you liked it!  data:', angular.toJson(data,true));
    });
  };

  $scope.cardDestroyed = function(index) {
    $scope.posts.splice(index, 1);
  };
});
