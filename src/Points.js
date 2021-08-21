import React from 'react';
import PropTypes from "prop-types";
import { Marker, Popup } from 'react-leaflet';

const Points = (props) => {
    /** @var object _points - Копия переменной с точками */
    let _points = props.points;

    if (props.selected.length > 0) {
        _points = {};

        props.selected.map(selectedOkato => _points[selectedOkato] = props.points[selectedOkato]);
    }

    return Object.getOwnPropertyNames(_points).map(okato =>
        _points[okato].map((point, index) => 
            <Marker key={`${okato}-${index}`} position={point.coordinates}>
                <Popup>{`${point.title} #${okato}-${index}`}</Popup>
            </Marker>
        )
    ).flat();
}

Points.propTypes = {
    /**
     * Массив всех точек для отображения
     */
    points: PropTypes.object,
    /**
     * Массив кодов ОКАТО выбранных АО
     */
    selected: PropTypes.array
};

export default Points;