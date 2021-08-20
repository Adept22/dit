import React, { useState } from 'react';
import { YMaps, Map, Polygon } from 'react-yandex-maps';

import Points from './Points';

import './App.css';

const App = () => {
    const [ymaps, setYmaps] = useState(null);
    const [moscowGeometry, setMoscowGeometry] = useState(null);

    const onLoad = (_ymaps) => {
        _ymaps.borders.load('RU', {
            lang: 'ru',
            quality: 3
        }).then(borders => {
            const moscowFeature = borders.features.find(feature => feature?.properties.iso3166 === 'RU-MOW');

            console.log(moscowFeature);

            setMoscowGeometry(moscowFeature.geometry);
            setYmaps(_ymaps);
        });
    };

    return (
        <div className="App">
            <YMaps>
                <Map 
                    width={1000}
                    height={500}
                    defaultState={{ center: [55.75, 37.57], zoom: 9 }}
                    onLoad={onLoad}
                    modules={['borders', 'geocode']}
                >
                    <Points ymaps={ymaps} geometry={moscowGeometry} />
                    {moscowGeometry ? <Polygon geometry={moscowGeometry.coordinates} /> : null}
                </Map>
            </YMaps>
        </div>
    );
};

export default App;
