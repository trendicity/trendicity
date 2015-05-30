'use strict';
angular.module('Trendicity')

  .service('BlacklistService', function($q, $http) {
    var self = this;

    var BLACKLIST_API_ENDPOINT = 'https://blacklist-kdm.rhcloud.com/api';

    this.reportPost = function(post) {
      console.log('reporting post.id:' + post.id);
      console.log('reporting userId:' + post.user.id);

      var promise = $http.post(BLACKLIST_API_ENDPOINT + '/blacklists',
        {
          "userId": post.user.id,
          "postId": post.id
        })
        .error(function (data, status) {
          console.log('reportPost returned status:' + status);
        });
      return promise;
    };

    this.filterPosts = function(posts) {
      var deferred = $q.defer();
      var filteredPosts = [];
      if (posts && posts.length) {
        var userIdsToCheck = self.collectUserIds(posts);
        console.log(userIdsToCheck);
        // Create url parms from userIdsToCheck
        var baseUrl = BLACKLIST_API_ENDPOINT + '/blacklists?1=1';
        // &filter[where][userId][inq]=1
        var parms = '';
        _.each(userIdsToCheck, function (userId) { // jshint ignore:line
          parms += '&filter[where][userId][inq]=' + userId;
        });
        console.log(baseUrl + parms);

        $http.get(baseUrl + parms)
          .success(function(data){
            console.log(data);
            var blacklistedPosts = data;
            if (blacklistedPosts && blacklistedPosts.length) {
              var blacklistedUserIds = self.collectBlacklistedUserIds(blacklistedPosts);
              console.log('blacklistedUserIds:');
              console.log(blacklistedUserIds);
              _.each(posts, function (post) { // jshint ignore:line
                if (!_.includes(blacklistedUserIds, post.user.id)) {
                  filteredPosts.push(post);
                } else {
                  console.log('excluding:' + post.id);
                }
              });
              console.log('filteredPosts:');
              console.log(filteredPosts);
              deferred.resolve(filteredPosts);
            } else {
              deferred.resolve(posts);
            }
          })
          .error(function (data, status) {
            console.log('filterPosts returned status:' + status);
            deferred.resolve(posts);
          });
      }
      return deferred.promise;
    };

    this.collectUserIds = function(posts) {
      // Create an array of unique user ids from posts array
      var  userIdsToCheck = _.collect(posts, function(post) {
        return post.user.id;
      });
      return _.uniq(userIdsToCheck);
    };

    this.collectBlacklistedUserIds = function(blacklists) {
      // Create an array of unique user ids from blacklists array
      var  blacklistedUserIds = _.collect(blacklists, 'userId');
      return _.uniq(blacklistedUserIds);
    };
  });