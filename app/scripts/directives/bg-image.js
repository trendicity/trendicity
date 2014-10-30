'use strict';
angular.module('Trendicity')

.directive('bgImage', function() {
    return {
        restrict: 'E',
        scope: {
            class: '@',
            image: '@',
            transclude: '@'
          },
          link: function($scope, $element) {
            var inside = angular.element($element.children()[0]);

            $scope.$watch('image', function(newValue) {
                if (newValue) {
                  if (ImgCache.ready) {
                    // Check if image is cached
                    ImgCache.isCached($scope.image, function(path, success) {
                            if (success) {
                              // Remove spinner
                              removeLoadingIndicator();

                              inside.css('background-image', 'url("' + $scope.image + '")');

                              ImgCache.useCachedBackground(inside);
                            } else {
                              download();
                            }
                          });
                  } else {
                    download();
                  }
                }
              });

            function download() {
                // Add loading indicator
                if (!$scope.transclude) {
                  inside.html('<i class="icon icon-md ion-ios7-reloading"></i>');
                }

                if (ImgCache.ready) {
                  inside.css('background-image', 'url("' + $scope.image + '")');
                  ImgCache.cacheBackground(inside, function() {
                        // Use cached image
                        removeLoadingIndicator();
                        ImgCache.useCachedBackground(inside);
                      }, function() {
                        console.error('Could not download image (ImgCache).');
                        removeLoadingIndicator();
                      });
                } else {
                  var img = new Image();
                  img.src = $scope.image;

                  img.onload = function() {
                        removeLoadingIndicator();
                        inside.css('background-image', 'url("' + $scope.image + '")');
                      };

                  img.onerror = function() {
                        console.error('Could not download image.');
                        removeLoadingIndicator();
                      };
                }
              }

            function removeLoadingIndicator() {
                if (!$scope.transclude) {
                  inside.html('');
                }
              }
          },
          transclude: true,
          template: '<div class="{{class}}" ng-transclude></div>',
        };
  });