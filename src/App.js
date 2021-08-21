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

L.Marker.prototype.options.icon = L.icon({
    iconSize: [25, 41],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40],
    iconUrl: icon,
    shadowUrl: iconShadow
});
// Конец фикса

/** @constant array MOSCOW - Координаты центра города Москвы */
const MOSCOW = [55.75, 37.57];
/** @constant integer ZOOM - Масштаб карты по-умолчанию */
const ZOOM = 9;

/** @constant array okatos - Массив всех кодов ОКАТО всех АО */
const okatos = ao.features.map(feature => feature.properties['OKATO']);
/** @constant array colors - Массив рандомных цветов по количеству АО */
const colors = okatos.reduce((ac, a) => ({ ...ac, [a]: getRandomColor() }), {});

const App = () => {
    /** @constant object points - Объект, где свойства - коды ОКАТО АО, значения - массивы точек внутри АО */
    const [points, setPoints] = useState({});
    /** @constant array selected - Массив индексов выбранных облатей круговой диаграммы */
    const [selected, setSelected] = useState([]);
    /** @constant integer revision - Пременная состояния для принудительного пересчера (ререндера) точек */
    const [revision, setRevision] = useState(0);
    /** @constant array pieData - массив областей круговой диаграммы */
    const [pieData, setPieData] = useState([]);

    useEffect(() => {
        getPoints().then(_points => {
            const _pieData = getPieData(_points);

            setSelected([]);
            setPoints(_points);
            setPieData(_pieData);
        });
    }, [revision]);

    /**
     * Получает 100 рандомных точек в пределах всех АО
     * 
     * @returns Promise
     */
    const getPoints = () => {
        return new Promise(resolve => {
            let _points = {};

            for (let i = 0; i < 100; i++) {
                const featureIndex = getRandomInt(0, ao.features.length - 1);
                const feature = ao.features[featureIndex];

                const title = feature.properties['NAME'];
                const okato = feature.properties['OKATO'];

                if (!Array.isArray(_points[okato])) _points[okato] = [];

                let polygonCoordinates = feature.geometry.coordinates[0];

                if (feature.geometry.type === 'MultiPolygon') {
                    const coordinatesIndex = getRandomInt(0, feature.geometry.coordinates.length - 1);
                    polygonCoordinates = feature.geometry.coordinates[coordinatesIndex][0];
                }

                const coordinates = getRandomPoint(polygonCoordinates);

                _points[okato].push({ title, coordinates, okato });
            }

            resolve(_points);
        });
    };

    /**
     * Получает элементы для круговой диаграммы
     * 
     * @param object _points - Все точки всех АО 
     * 
     * @returns array
     */
    const getPieData = (_points) => ao.features.map(feature => ({
        key: feature.properties['OKATO'],
        title: feature.properties['NAME'],
        label: feature.properties['ABBREV'],
        value: _points[feature.properties['OKATO']].length,
        color: colors[feature.properties['OKATO']]
    }));

    /**
     * Устанавливает цвет заливки полигона
     */
    const onEachFeature = (feature, layer) => layer.setStyle({ 
        fillColor: colors[feature.properties['OKATO']], 
        fillOpacity: 0.8 
    });

    /**
     * Событие клика на элементе круговой диаграммы
     */
    const onPieClick = (e, i) => {
        /** @var array _selected - Копия переменной состояния selected */
        let _selected = [...selected];

        /** @constant integer index - Положительное число - индекс в массиве, если такой элемент уже выбран, иначе - -1 */
        const index = _selected.indexOf(i);

        if (~index) _selected.splice(index, 1);
        else _selected.push(i);

        setSelected(_selected);
    };

    const labelStyle = {
        fill: '#000000',
        fontSize: '3px',
        fontFamily: 'sans-serif',
    };

    return (
        <div className="App">
            <MapContainer center={MOSCOW} zoom={ZOOM}>
                <TileLayer
                    attribution='&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <GeoJSON data={ao} onEachFeature={onEachFeature} />
                <Points 
                    points={points} 
                    selected={selected.map(i => pieData?.[i]?.key)}
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
                    segmentsStyle={{ cursor: 'pointer' }}
                    segmentsShift={index => (selected.includes(index) ? 5 : 0)}
                    radius={39}
                    label={({ dataEntry }) => dataEntry.label}
                    labelStyle={{ ...labelStyle }}
                    labelPosition={112}
                />
            </div>
        </div>
    );
};

export default App;