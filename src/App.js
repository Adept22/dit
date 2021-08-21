import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { PieChart } from 'react-minimal-pie-chart';

import Points from './Points';
import { getRandomColor, getRandomInt, getRandomPoint } from './Function'

import ao from './ao.json';

import 'leaflet/dist/leaflet.css';
import './App.css';

// Фикс изображения маркера
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconSize: [25, 41],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40],
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;
// Конец фикса

const MOSCOW = [55.75, 37.57];

const okatos = ao.features.map(feature => feature.properties['OKATO']);
const colors = okatos.reduce((ac, a) => ({ ...ac, [a]: getRandomColor() }), {});

const App = () => {
    const [points, setPoints] = useState({});
    const [selected, setSelected] = useState([]);
    const [revision, setRevision] = useState(0);
    const [pieData, setPieData] = useState([]);

    useEffect(() => {
        const _points = getPoints();
        const _pieData = getPieData(_points);

        setSelected([]);
        setPoints(_points);
        setPieData(_pieData);
    }, [revision]);

    const getPoints = () => {
        let _points = {};

        for (let i = 0; i < 100; i++) {
            const featureIndex = getRandomInt(0, ao.features.length - 1);
            const feature = ao.features[featureIndex];

            const okato = feature.properties['OKATO'];

            if (!Array.isArray(_points[okato])) _points[okato] = [];

            let polygonCoordinates = feature.geometry.coordinates[0];

            if (feature.geometry.type === 'MultiPolygon') {
                const coordinatesIndex = getRandomInt(0, feature.geometry.coordinates.length - 1);

                polygonCoordinates = feature.geometry.coordinates[coordinatesIndex][0];
            }

            const title = feature.properties['NAME'];
            const coordinates = getRandomPoint(polygonCoordinates);

            _points[okato].push({ title, coordinates, okato });
        }

        return _points;
    };

    const getPieData = (_points) => ao.features.map(feature => ({
        key: feature.properties['OKATO'],
        title: feature.properties['NAME'],
        label: feature.properties['ABBREV'],
        value: _points[feature.properties['OKATO']].length,
        color: colors[feature.properties['OKATO']]
    }));

    const onEachFeature = (feature, layer) => layer.setStyle({ 
        fillColor: colors[feature.properties['OKATO']], 
        fillOpacity: 0.8 
    });

    const onPieClick = (e, i) => {
        let _selected = [...selected];

        const index = _selected.indexOf(i);

        if (~index) _selected.splice(index, 1);
        else _selected.push(i);

        setSelected(_selected);
    };

    return (
        <div className="App" style={{width: '100%', height: '100%'}}>
            <MapContainer center={MOSCOW} zoom={9}>
                <TileLayer
                    attribution='&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <GeoJSON data={ao} onEachFeature={onEachFeature} />
                <Points 
                    points={points} 
                    selected={selected.map(i => pieData?.[i]?.key)}
                    revision={revision} 
                />
            </MapContainer>
            <div className={'chart-wrapper'}>
                <div className={'button-wrapper'}>
                    <button
                        type={'button'}
                        onClick={() => setRevision(revision + 1)}
                    >
                        Перегенерировать
                    </button>
                </div>
                <PieChart
                    style={{padding: '20px 0'}}
                    data={pieData}
                    onClick={onPieClick}
                    segmentsStyle={{ transition: 'stroke .3s', cursor: 'pointer' }}
                    segmentsShift={index => (selected.includes(index) ? 5 : 0)}
                    radius={39}
                    label={({ dataEntry }) => dataEntry.label}
                    labelStyle={{
                        fill: '#000000',
                        fontSize: '3px',
                        fontFamily: 'sans-serif',
                    }}
                    labelPosition={112}
                />
            </div>
        </div>
    );
};

export default App;