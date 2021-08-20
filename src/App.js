import React, { useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import ao from './ao.json';

import Points from './Points';

import 'leaflet/dist/leaflet.css';
import './App.css';

// Фикс иконки маркера
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;
// Конец фикса

const App = () => {
    const MOSCOW = [55.75, 37.57];

    console.log(ao);

    return (
        <div className="App" style={{width: '100%', height: '100%'}}>
            <MapContainer center={MOSCOW} zoom={9}>
                <TileLayer
                    attribution='&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <GeoJSON data={ao} />
                <Points features={ao.features} />
            </MapContainer>
        </div>
    );
};

export default App;