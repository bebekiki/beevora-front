var app = angular.module('TestApp', ['ngRoute']);

const clientId = 'fd1c2d3878184f3aadeeb5b74cf4d47a';
const clientSecret = 'b012fe8b4561475ab69297b75f006b34';
var token;

var albumsArtist = {};

//Controlleur page index
app.controller('frontCtrl', function ($scope, $location, $rootScope) {

    //fonction permettant de récupérer le token de spotify néccessaire pour l'appel des API
    $scope.getToken = async function() {
        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded', 
                'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });

        const data = await result.json();
        token = data.access_token;
    }
    $scope.getToken();

    //fonction qui recherhe les albums en fonction du nom de l'artist 
    $scope.search = async function(){
        const result = await fetch(`https://api.spotify.com/v1/search?q=artist:`+ $scope.artist +`&type=album`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        const data = await result.json();
        albumsArtist = data.albums.items;
        $scope.$apply(function () {
            $location.path('/albumsArtist');
        });     
    }

    // $rootScope.test = "$scope.artist";
    
});

//Controlleur page d'accueil
app.controller('homeCtrl', function ($scope, $location) {
   
    //fonction récuperant tous les albums de artist ayant pour id = 0TnOYISbd1XYRBk9myaseg
    $scope.getAlbums = async function () {
        const result = await fetch(`https://api.spotify.com/v1/artists/0TnOYISbd1XYRBk9myaseg/albums?include_groups=album&limit=10&offset=5`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        const data = await result.json();
        $scope.albums = data.items;
        $scope.$apply();
    }
    $scope.getAlbums();

    // $scope.getAlbumsArtist = albumsArtist;

    //appel de la page présentant les différentes musics d'un album 
    $scope.viewAlbums = function (idAlbum) {
        $location.path('/music/' + idAlbum);
    };

});

//controlleur page présentant les musics
app.controller('musicCtrl', function ($scope, $routeParams, $rootScope) {

    //fonctions pour récupérer toutes les musics d'un album préci
    $scope.getMusics = async function () {
        const result = await fetch(`https://api.spotify.com/v1/albums/` + $routeParams.id + `/tracks`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        const data = await result.json();
        $scope.musics = data.items;
        $scope.$apply();
    }
    $scope.getMusics();

    //fonction d'initialisation de howlerjs
    var sound;
    $scope.getMusic = function(url){
        sound = new Howl({
            src: [url],
            html5: true
        });
    }

    //fonction pour jouer la music
    $scope.readMusic = function (url) {
        $scope.getMusic(url);
        sound.play();
    }

    //fonction pour mettre pause
    $scope.pauseMusic = function (url) {
        sound.pause();
    }

});

//controller des albums provenant de la recherche
app.controller('albumsArtistCtrl', function ($scope, $location, $rootScope) {
    console.log('le res : '+ albumsArtist);
    $scope.getAlbumsArtist = albumsArtist;
    // $scope.$apply();

    $scope.viewAlbums = function (idAlbum) {
        $location.path('/music/' + idAlbum);
    };

});


