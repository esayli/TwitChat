'use strict';


angular.module('twitChatApp')
  .controller('MainCtrl', function ($scope,$timeout,$http,$resource,$sce) {


    $scope.start = false;
    chrome.app.runtime.onLaunched.addListener(function() {
      $scope.start = true;
      chrome.app.window.create('index.html', {
        //state: "fullscreen",
        frame: "none",
        bounds: {
          width: 1400,
          height: 1000
        }
      });
    });


    $scope.queue = [];
    $scope.windowCreated = false;
    $scope.windowId = 0;


    $scope.media = [
      {mimeType: ''}

    ];

    $scope.slickConfig = {
      dots: false,
      infinite: false,
      speed: 6000,
      pauseOnHover:false,
      slidesToShow: 1,
      centerMode: true,
      variableWidth: true,
      waitForAnimate: true,
      onBeforeChange: function(_this, currentIndex,targetIndex) {
        console.log(_this, currentIndex,targetIndex);
      }
    };
    $scope.slickHandle = {

    };

    var MessageObj = function(){
      this.userName = '';
      this.message = '';
      this.color = '';
      this.time = new Date().getTime();
    };

    var findProperty = function(data,key){

      var msgArray = data.split('----');

      for(var i = 0; i < msgArray.length; i++){
        if(msgArray[i].indexOf(key) != -1){
          return msgArray[i].split("::::")[1];
        }
      }

    };

    var wrapCallbackMessage = function(msg){

      var obj = new MessageObj();
      obj.userName = findProperty(msg,'name');
      obj.message = findProperty(msg,'message');
      obj.color = findProperty(msg,'color');

      return obj;

    };



    var colorChanger = true;
    var backgroundColor;

    // handles the callback from the received event
    var handleCallback = function (msg) {

      var currentMessage = wrapCallbackMessage(JSON.parse(msg.data));

      $scope.$apply(function () {
          $scope.queue.push(currentMessage);
        var date = new Date;
        date.setTime(currentMessage.time);
        var minutes = date.getMinutes();
        var hour = date.getHours();



        if(colorChanger){backgroundColor = '#c8c8c8'; colorChanger =!colorChanger}else{backgroundColor='#d9d9d9';colorChanger =!colorChanger}


        var strVar="";
        strVar += "<div  style=\"padding-right: 20px; background-color:"+backgroundColor+"\"><table><tr>";
        strVar += "          <td>";
        strVar += "            <span style=\"color:#8c8c8c; font-size: smaller \" data-link-color=\"#8c8c8c\"><small>"+hour+":"+minutes+"</small></span>";
        strVar += "            <span style=\"color:"+currentMessage.color+"; font-family: 'Trebuchet MS', Helvetica, sans-serif; font-weight: bold\">"+currentMessage.userName+"</span>";
        strVar += "          </td>";
        strVar += "        </tr>";
        strVar += "        <tr>";
        strVar += "          <td>";
        strVar += "            <span style=\"font-family: 'Trebuchet MS', Helvetica, sans-serif; white-space: nowrap\">"+currentMessage.message+"</span>";
        strVar += "          </td>";
        strVar += "        </tr></table></div>";

          $scope.slickHandle.slickAdd(strVar);
          //$scope.slickHandle.slickNext();

          //if($scope.queue.length > 100){
          //  $scope.queue.shift();
          //}

      });
    };

    var source = new EventSource('http://localhost:3000/message');
    source.addEventListener('message', handleCallback, false);

    $scope.fullScreen = function () {
      chrome.app.window.current().fullscreen();
    };

    $scope._onBeforeChange = function(slider,currentIndex,targetIndex) {

      console.log(slider,currentIndex,targetIndex);

    };
    $scope.timer = function () {
      $timeout(function() {
        $scope.slickHandle.slickGoTo($scope.queue.length);
        $scope.timer();
      }, 100);
    };

    $scope.timer();





    $scope.sendMessage = function (newMessage) {
      var message = $resource('http://localhost:3000/say',{},
        {
          newMessage: {method:'POST', params:{message:newMessage}}
        });

      message.newMessage();
    };


    $scope.currentProjectUrl = $sce.trustAsResourceUrl('http://www.twitch.tv/sirhcez/embed');



  });
