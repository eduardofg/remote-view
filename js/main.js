
/**
 * Main AngularJS Web Application
 */
var app = angular.module('TotvsRemoteServer', []);

/*** Verificação se o DOM foi atualização e renderizar o MDL novamente ***/
app.run(function ($rootScope,$timeout) {

    var mdlUpgradeDom = false;
    
    setInterval(function() {
      if (mdlUpgradeDom) {
        componentHandler.upgradeDom();
        mdlUpgradeDom = false;
      }
    }, 200);

    var observer = new MutationObserver(function () {
      mdlUpgradeDom = true;
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});
      
app.controller('remoteController', function($rootScope, $scope) {
	
    $rootScope.customerList = [];
    
    var screensharing = new Screen('totvs-remote-sharing');
    
    screensharing.onscreen = function(_screen) {
    
        /* Verifica se item já existe */
        for(var i=0; i < $rootScope.customerList.length; i++) {
            if ($rootScope.customerList[i].id === _screen.userid) {
                return;
            }
        }

        $rootScope.customerList.push({
              id:    _screen.userid,
              info:  _screen.info
        });
        
        $rootScope.$apply();
    };
    
    // on getting each new screen
    screensharing.onaddstream = function(media) {
        
        media.video.id = media.userid;
        
        var video = media.video;
        video.setAttribute('controls', true);
        $scope.video.insertBefore(video, $scope.video.firstChild);
        video.play();
    };

    screensharing.openSignalingChannel = function(callback) {
        console.log('openSignalingChannel');
        return io.connect('https://localhost').on('message', callback);
    };
    
    // check pre-shared screens
    screensharing.check();
    
    $scope.getConnectionCustumer = function(customer){
        
        var _screen = {
            userid: customer.info.name,
            roomid: customer.info.roomid
        };
        screensharing.view(_screen);
            
        var dialog = document.querySelector('dialog');
        $scope.video = document.querySelector('.videos-container');
        
        console.log($scope.video);
        
        dialog.showModal();
        dialog.querySelector('.close').addEventListener('click', function() {
             dialog.close();
        });
    };
});