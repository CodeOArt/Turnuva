// sw.js (Service Worker dosyası)
// Bu dosya, web sunucusu üzerinden HTTPS ile sunulmalıdır.

// Firebase SDK'sını Service Worker'a import edin
importScripts('https://www.gstatic.com/firebasejs/11.9.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.9.1/firebase-messaging-compat.js');

// Firebase yapılandırmanızı buraya tekrar ekleyin (sadece Messaging için gerekli kısımlar)
// Bu, onBackgroundMessage dinleyicisinin çalışması için önemlidir.
const firebaseConfig = {
    apiKey: "AIzaSyC_4leEyiGLUg4pF420WtQOC2om-OyWoEU",
    authDomain: "futbol-1e4a5.firebaseapp.com",
    databaseURL: "https://futbol-1e4a5-default-rtdb.firebaseio.com",
    projectId: "futbol-1e4a5",
    storageBucket: "futbol-1e4a5.appspot.com",
    messagingSenderId: "915149469219",
    appId: "1:915149469219:web:dbc7fd59a2aa8708536396",
    measurementId: "G-ZF51DF32W7"
};

// Firebase uygulamasını Service Worker içinde başlat
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Arka planda (site kapalıyken) gelen push mesajlarını dinle
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    const notificationTitle = payload.notification.title || 'Turnuva Duyuru';
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon || 'https://placehold.co/48x48/1de9b6/000?text=⚽',
        badge: 'https://placehold.co/48x48/1de9b6/000?text=🏆',
        data: payload.data, // Özel verileri ekleyebilirsiniz
        tag: 'tournament-update',
        renotify: true
    };

    // Bildirimi göster
    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Bildirim tıklamalarını dinle (isteğe bağlı: tıklandığında sayfayı açma)
self.addEventListener('notificationclick', (event) => {
    const clickedNotification = event.notification;
    clickedNotification.close();

    const urlToOpen = 'https://codeoart.github.io/Turnuva/'; // Uygulamanızın URL'si

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
            return null;
        })
    );
});
