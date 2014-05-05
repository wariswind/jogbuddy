// JavaScript Document
var app=angular.module('jogapp.controllers', [])
.controller('MainCtrl', function($scope, $ionicLoading){
})
.controller('MapCtrl', function($scope, $ionicLoading){
	$scope.loadingIndicatorShow = function(){$scope.loading=$ionicLoading.show({
	    content: '<i class="button button-icon icon ion-loading-a"></i>',
	    animation: 'fade-in',
	    showBackdrop: false,
	    maxWidth: 100,
	    showDelay: 0
	});
	
	}
	 $scope.startTimer = function (){
$scope.$broadcast('timer-start');
$scope.timerRunning = true;
};
 
$scope.stopTimer = function (){
$scope.$broadcast('timer-stop');
$scope.timerRunning = false;
};
 
$scope.$on('timer-stopped', function (event, data){
console.log('Timer Stopped - data = ', data);
$scope.millis=data.millis;
});
$scope.startStop=false;
	$scope.timeCount=false;
	$scope.StartLat=null;$scope.StartLong=null;
	$scope.EndLat=null;$scope.EndLong=null;$scope.distance=0.0;$scope.speed=0.0;$scope.calories=0.0;
	$scope.weight='';
	$scope.loadingIndicatorHide=function(){
		 $ionicLoading.hide();
	}
	$scope.options = { maximumAge: 5000, timeout: 27000, enableHighAccuracy: true };
	$scope.loadingIndicatorShow();
	function initialize() {
        var mapOptions = {
          center: new google.maps.LatLng(43.07493,-89.381388),
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);

        // Stop the side bar from dragging when mousedown/tapdown on the map
        google.maps.event.addDomListener(document.getElementById('map'), 'mousedown', function(e) {
          e.preventDefault();
          return false;
        });

        $scope.map = map;
		$scope.loadingIndicatorHide();
      }
      google.maps.event.addDomListener(window, 'load', initialize());
	  
	  $scope.startJog = function() {
        if(!$scope.map) {
			alert('Internet Connection is poor');
          return;
        }
		$scope.enWeight=true;
		
		
      };
	  $scope.doStartJog=function(){
		  if(!$scope.map) {
			alert('Internet Connection is poor');
          return;
        }
		if($scope.weight===null || isNaN($scope.weight)){
			alert('Invalid weight entered');
          return;
		}
		$scope.enWeight=false;
		 $scope.doJog();
	  }
	  $scope.doJog=function(){
		  $scope.loadingIndicatorShow();
		  $scope.startStop=true;
	$scope.timeCount=true;
		navigator.geolocation.getCurrentPosition(function(position){
			$scope.StartLat=position.coords.latitude;
			$scope.StartLong=position.coords.longitude}, function(err){$scope.StartLat=null;$scope.StartLong=null});
			
	
        $scope.watchID=navigator.geolocation.watchPosition(function(pos) {
          $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          $scope.point = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
    if(!$scope.marker){
        //create marker
        $scope.marker = new google.maps.Marker({
            position: $scope.point,
            map: $scope.map
			
        });
		
		
    }else{
        //move marker to new position
        $scope.marker.setPosition($scope.point);
		
    }
	$scope.startTimer();
	
		$scope.loadingIndicatorHide();
        }, function(error) {
          alert('Unable to get location: ' + error.message);
		  $scope.loadingIndicatorHide();
        },$scope.options);
	  }
	 $scope.stopjog=function(){
		  if(!$scope.map) {
			alert('Internet Connection/GPS is off');
          return;
        }
		$scope.loadingIndicatorShow();
		navigator.geolocation.clearWatch($scope.watchID);
		navigator.geolocation.getCurrentPosition(function(position){
			$scope.EndLat=position.coords.latitude;
			$scope.EndLong=position.coords.longitude;
			$scope.distance=$scope.distanceFrom($scope.StartLat,$scope.StartLong,$scope.EndLat,$scope.EndLong);
			$scope.startStop=false;
			$scope.stopTimer();
			$scope.timeHr=$scope.millis/(1000*60*60);
			$scope.speed=($scope.distance/$scope.timeHr).toFixed(3);
			$scope.calories=(0.75*$scope.distance*$scope.weight).toFixed(3);
			alert($scope.timeHr);
			$scope.loadingIndicatorHide();
			}, function(err){$scope.EndLat=null;$scope.EndLong=null});
			
	 }
	 $scope.distanceFrom=function (lat1,lng1,lat2,lng2) {
			var lat1 =lat1;
			var radianLat1 = lat1 * (Math.PI / 180);
			var lng1 = lng1;
			var radianLng1 = lng1 * (Math.PI / 180);
			var lat2 = lat2;
			var radianLat2 = lat2 * (Math.PI / 180);
			var lng2 = lng2;
			var radianLng2 = lng2 * (Math.PI / 180);
			var earth_radius = 6371;
			var diffLat = (radianLat1 - radianLat2);
			var diffLng = (radianLng1 - radianLng2);
			var sinLat = Math.sin(diffLat / 2);
			var sinLng = Math.sin(diffLng / 2);
			var a = Math.pow(sinLat, 2.0) + Math.cos(radianLat1) * Math.cos(radianLat2) * Math.pow(sinLng, 2.0);
			var distance = earth_radius * 2 * Math.asin(Math.min(1, Math.sqrt(a)));
			return distance.toFixed(3);
}
})