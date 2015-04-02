Trendicity
==================

Companion app for the [Developing an Ionic Edge](http://trendicity.co) book published by Bleeding Edge Press.

Clone this repo then run the following commands:

```sh
npm install
ionic serve
```

> `npm install -g cordova ionic gulp` initiated from the npm `preinstall` hook.

> `bower install` is automatically initiated from the npm `postinstall` hook.

## Running

### Run in browser 

`ionic serve`

### Run on device

#### iOS / Android

> Where ever you read 'iOS' and in the command line 'ios', you can switch that out for 'android' as well.

If you're running the app on iOS for the first time, first add the platform to your project using:

```sh
$ ionic platform add ios
```

After that you can run

```sh
$ ionic run ios
```

Every time you want to install the app on your device.

