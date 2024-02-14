(function(){
    const lat = 6.9878585;
    const lng = -73.0509035;
    const mapa = L.map('mapa-inicio').setView([lat, lng ], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

})()