/* global ymaps3 */
ymaps3.import('@yandex/ymaps3-reactify');
import React from "react";
import ReactDOM from "react-dom";


const ymaps3Reactify = await ymaps3.import('@yandex/ymaps3-reactify');
const reactify = ymaps3Reactify.reactify.bindTo(React, ReactDOM);
const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker} = reactify.module(ymaps3);



export default function EditRoutPage(setPage, PAGES){
    return(
        <div>
            <p> PIPAO </p>
        </div>
    )
}