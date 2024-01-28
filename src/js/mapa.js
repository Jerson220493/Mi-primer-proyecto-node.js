(function() {

    const lat = 6.9878585;
    const lng = -73.0509035;
    const mapa = L.map('mapa').setView([lat, lng ], 15);
    let marker;

    // utilizar provider y Geocoder
    const geocodeService = L.esri.Geocoding.geocodeService();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    marker = new L.marker([lat, lng], {  // configura para que el punto salga en las coordenadas principales
        draggable : true,   // que se pueda mover
        autoPan : true,     // para que se vuelva a centrar el mapa despues de movido el pin
    })
    .addTo(mapa)

    // detectar el movimiento del pin
    marker.on('moveend', function(e){
        marker = e.target;
        const posicion = marker.getLatLng();
        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));

        // obtener la informacion de las calles al soltar el pin 
        geocodeService.reverse().latlng(posicion, 15).run(function(error, resultado){
            console.log(resultado)
            marker.bindPopup(resultado.address.LongLabel)

            //llenar los campos
            document.querySelector('.calle').textContent = resultado?.address?.Address ?? '';
            document.querySelector('#calle').textContent = resultado?.address?.Address ?? '';
            document.querySelector('#lat').textContent = resultado?.latlng?.lat ?? '';
            document.querySelector('#lng').textContent = resultado?.latlng?.lng ?? '';
        })
    })

})()