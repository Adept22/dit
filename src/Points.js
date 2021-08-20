import React from 'react';
import { Placemark } from 'react-yandex-maps';
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

    if (pointInPolygon([lng, lat], coordinates)) return [lng, lat];

    return generatePoint(coordinates);
};

const Points = (props) => {
    const { ymaps, geometry } = props;

    if (!ymaps || !geometry?.coordinates.length > 0) return null;

    const getPointDistrict = (point) => {
        ymaps.geocode(point.coordinates, {
            kind: 'district',
            results: 1
        }).then(function (res) {
            console.log(res);
        });
    };

    let points = [];

    for (let i = 0; i < 100; i++) {
        const polyIndex = getRandomInt(0, geometry.coordinates.length - 1);

        const coordinates = generatePoint(geometry.coordinates[polyIndex]);
        const district = getPointDistrict(coordinates);

        points.push({ coordinates, district });
    }

    console.log(points);

    return points.map((point, index) =>
        <Placemark
            key={index}
            geometry={point.coordinates}
            options={{
                preset: 'islands#circleDotIcon',
                iconColor: 'red'
            }}
        />
    );
}

export default Points;