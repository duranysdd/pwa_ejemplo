//Plantilla de un service worker minimo

//1. Nombre del sw y los archivos a cachear

const CACHE_NAME = "mi-cache";

const urlsToCache = [ 
    "index.html",
    "styles.css", 
    "app.js",
    "offline.html"
];

//2. INSTALL - se ejecuta al instalar el service Worker
//se cachean los recursos de base de la PWA

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open((CACHE_NAME).then(cache => cache.addAll(urlsToCache)))
    );
});

//3. ACTIVATE -> se ejecuta al activar el service Worker
//limpiar el cache viejo para mantener solo la versión actual de la cache

self.addEventListener("activate", event =>{
    event.waitUntil(
        caches.keys().then(keys => 
            Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                .map(key => caches.delete(key))
        )
    ));
});

//3. FETCH -> interpreta peticiones de la app web
//intercepta las peticiones de la PWA
//busca primeron en cache 
//si no esta busca en internet 
//en caso de falla, muestra la pagina offline.html

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).catch (() => caches.match("offline.html"));
        })
    )
});

//4. PUSH -> notificaciones en segundo plano
//Manejo de notificaciones push (opcional)

self.addEventListener("push", event => {
    const data = event.data ? event.data.text() : "Notificaciones sin texto";
    event.waitUntil(
        self.registration.showNotification("Notificación Push", {body: data})
    );
});