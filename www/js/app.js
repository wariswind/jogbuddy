// JavaScript Document
angular.module('jogapp', ['ionic','timer', 'jogapp.controllers'])

.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
	
	
	.state('base', {
      url: "/base",
      abstract: true,
      templateUrl: "templates/base.html",
	  
    })
	.state('base.home', {
      url: "/home",
      views: {
        'menuContent' :{
          templateUrl: "templates/home.html",
		  controller: 'MapCtrl'
        }
      }
    })
	
		$urlRouterProvider.otherwise('base/home');
})