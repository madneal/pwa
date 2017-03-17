var cacheName = 'weatherPWA-step-6-1';
var dataCacheName = 'weatherData-v1';
var filesToCache = [  
  '/',  
  '/index.html',  
  '../scripts/app.js',  
  '../styles/inline.css',  
  '../images/clear.png',  
  '../images/cloudy-scattered-showers.png',  
  '../images/cloudy.png',  
  '../images/fog.png',  
  '../images/ic_add_white_24px.svg',  
  '../images/ic_refresh_white_24px.svg',  
  '../images/partly-cloudy.png',  
  '../images/rain.png',  
  '../images/scattered-showers.png',  
  '../images/sleet.png',  
  '../images/snow.png',  
  '../images/thunderstorm.png',  
  '../images/wind.png'  
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
	console.log('[ServiceWorker] Activate');
	e.waitUntil(
		caches.keys().then(function(keyList) {
			return Promise.all(keyList.map(function(key) {
				console.log('[ServiceWorker] Removing old cache', key);
				if (key !== cacheName || key !== dataCacheName) {
					return caches.delete(key);
				}
			}));
		}));
});

self.addEventListener('fetch', function(e) {  
  console.log('[ServiceWorker] Fetch', e.request.url);  
  var dataUrl = 'https://publicdata-weather.firebaseio.com/';  
  if (e.request.url.indexOf(dataUrl) !== -1) {  
    // Put data handler code here  
    e.respondWith(
    	fetch(e.request)
    	.then(function(response) {
    		return caches.open(dataCacheName)
    			.then(function(cache) {
    				cache.put(e.request.url, response.clone());
    				console.log('[ServiceWorker] Fetched&Cached Data');
    				return response;
    			});
    	}));
  } else {  
    e.respondWith(  
      caches.match(e.request).then(function(response) {  
        return response || fetch(e.request);  
      })  
    );  
  }  
});