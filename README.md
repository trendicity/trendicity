TrendiCity
==================
Companion app for the IonicFramework book published by Bleeding Edge Press.

### Running
Clone this repo then run the following commands:
````
npm install && bower install
grunt init
grunt serve
````

### Rough Outline
1. **Forward**
  * Mention advancements to hybrid mobile technology space (Ionic, [Famous](http://famo.us/), Cordova, [Crosswalk](https://crosswalk-project.org/)) since hearing "hybrid mobile app" seems to (still) leave a bad taste in the mouth for some.
  * Give background on Ionic, why its different, why its worth learning (build with AngularJS, focus on community, Drifty's past successes - [Jetstrap](https://jetstrap.com/) & [Codiqa](https://codiqa.com/)
  * Use analogies that front-end devs might relate to (ex. Ionic is like [Bootstrap](http://getbootstrap.com/) + [UI-Bootstrap](http://angular-ui.github.io/bootstrap/) but for mobile apps, etc)
2. **Development Environment, Tooling and Workflow**
  * Installing prerequisites - Node.js & GIT (for Bower)
  * Mention [Ionic Box](http://ionicframework.com/blog/ionic-vagrant-android/) for streamlining Android development.
  * [ionic cli](https://github.com/driftyco/ionic-cli) - start new project (templates + codepen), building, emulating, running
  * [Yeoman generator](https://github.com/diegonetto/generator-ionic) - Cordova hooks for plugin management & icons + splashscreens
  * Scaffolding project (`ionic start` & `yo ionic`)
  * Adding platforms & plugins
  * Browser based development (`ionic serve` & `grunt serve`)
  * Emulation with livereload
  * Version control system best practices (Cordova)
3. **Designing the App**
  * Overview of built-in CSS, JS, and [Ionicons](http://ionicons.com/)
  * Using Sass to override default design
  * *Consider mocking up the application (using [moqups](https://moqups.com/) or [Invision](http://www.invisionapp.com/) etc) so we can then post the screens here and discuss some basic UX principles?*
4. **Developing the App**
  * *Suggest breaking this section up into multiple chapters based on how we want to introduce features of the application we are building. This way, we can dive into certain components of the framework as they are needed to implement a particular piece of the application*
  * Architecture best practices
  * Connecting your app to a RESTful backend API (suggest using [Firebase](https://www.firebase.com/))
  * Useful Cordova plugins + [ngCordova](http://ngcordova.com/) (Maybe push notifications using [PushPlugin](https://github.com/phonegap-build/PushPlugin))
5. **Building for Production**
  * Performance optimizations (collection-repeat, etc)
  * Asset pipeline (concatenation, obfuscation, & minification) using Yeoman (Grunt / Gulp)
  * Build iOS and Android apps from command line (scripts using the xcrun command for iOS)
6. **Moving On**
  * Promoting your app - [Ionic Showcase](http://showcase.ionicframework.com/)
  * [Ionic Creator](http://ionicframework.com/creator/)
  * [Full Stack Hybrid Mobile Platform](http://ionic.io/)
  * [Ionic View App](https://itunes.apple.com/us/app/ionic-view/id849930087?mt=8)
  * [Ionic Collide](https://github.com/driftyco/collide)


### App Ideas
*We could pick a popular API from http://www.programmableweb.com/ and do some sort of mashup*

1. **BurnerChat**
  * Whatsapp + [Cyberdust](http://cyberdust.com/) mashup
  * Create a chat room, share link with friends for anonymous, ephemeral group conversations
  * Real-time messages powered by [Firebase](https://www.firebase.com/) with WebSockets
2. **TrendiCity**
  * See what Instagram posts are trending in your city
  * Realtime heatmaps of Instagram posts using geolocation
  * Like http://herefeed.com, but for mobile

### Worth discussing
1. Actually publishing this application to Google Play and Apple App Store
