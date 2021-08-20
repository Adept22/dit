import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import pointInPolygon from 'point-in-polygon';

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generatePoint = (coordinates) => {
    const x = coordinates.map(point => point[0]);
    const y = coordinates.map(point => point[1]);

    const minX = Math.min(...x);
    const minY = Math.min(...y);
    const maxX = Math.max(...x);
    const maxY = Math.max(...y);

    const lat = minY + (Math.random() * (maxY - minY));
    const lng = minX + (Math.random() * (maxX - minX));

    if (pointInPolygon([lng, lat], coordinates)) return [lat, lng];
    else return generatePoint(coordinates);
};

const Points = (props) => {
    let points = [];

    for (let i = 0; i < 100; i++) {
        const featureIndex = getRandomInt(0, props.features.length - 1);
        const district = props.features[featureIndex];

        let polygonCoordinates = district.geometry.coordinates[0];

        if (district.geometry.type === 'MultiPolygon') {
            const coordinatesIndex = getRandomInt(0, district.geometry.coordinates.length - 1);

            polygonCoordinates = district.geometry.coordinates[coordinatesIndex][0];
        }

        const title = district.properties['NAME'];
        const coordinates = generatePoint(polygonCoordinates);

        points.push({ title, coordinates, district });
    }

    console.log(points);

    return points.map((point, index) =>
        <Marker key={index} position={point.coordinates}>
            <Popup>{`${point.title} #${index}`}</Popup>
        </Marker>
    );
}

export default Points;