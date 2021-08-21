import pointInPolygon from 'point-in-polygon';

export const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

export const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomPoint = (coordinates) => {
    const x = coordinates.map(point => point[0]);
    const y = coordinates.map(point => point[1]);

    const minX = Math.min(...x);
    const minY = Math.min(...y);
    const maxX = Math.max(...x);
    const maxY = Math.max(...y);

    const lat = minY + (Math.random() * (maxY - minY));
    const lng = minX + (Math.random() * (maxX - minX));

    if (pointInPolygon([lng, lat], coordinates)) return [lat, lng];
    else return getRandomPoint(coordinates);
};