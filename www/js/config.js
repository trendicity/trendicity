"use strict";

 angular.module("config", [])

.constant("ENV", {
  "name": "development",
  "apiEndpoint": "http://dev.yoursite.com:10000/"
})

;