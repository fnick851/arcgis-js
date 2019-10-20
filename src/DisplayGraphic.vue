<template>
    <div></div>
</template>

<script>
import { loadModules } from 'esri-loader'

export default {
    name: 'DisplayGraphic',
    data() {
        return {
            view: null
        }
    },
    async mounted() {
        // lazy load the required ArcGIS API for JavaScript modules and CSS
        const [
            Map,
            MapView,
            Graphic,
        ] = await loadModules([
            "esri/Map",
            "esri/views/MapView",
            "esri/Graphic",], { css: true })

        const map = new Map({
            basemap: "topo-vector"
        });

        const view = new MapView({
            container: this.$el,
            map: map,
            center: [-118.25, 34.15],
            zoom: 13
        });

        const point = {
            type: "point",
            longitude: -118.29507,
            latitude: 34.13501
        };

        const simpleMarkerSymbol = {
            type: "simple-marker",
            color: [226, 119, 40],  // orange
            outline: {
                color: [255, 255, 255], // white
                width: 1
            }
        };

        const attributes = {
            Name: "I am a point",
            Park: "Griffith Park",
            City: "Los Angeles"
        };

        const popupTemplate = {
            title: "{Name}",
            content: "I live in <b>{Park}</b> in the city of <b>{City}</b>."
        };

        const pointGraphic = new Graphic({
            geometry: point,
            symbol: simpleMarkerSymbol,
            attributes: attributes,
            popupTemplate: popupTemplate
        });

        view.graphics.add(pointGraphic);

        const pictureGraphic = new Graphic({
            geometry: {
                type: "point",
                x: -118.31,
                y: 34.182
            },
            symbol: {
                type: "picture-marker",
                url: "https://developers.arcgis.com/labs/images/bluepin.png",
                width: "14px",
                height: "26px"
            }
        });

        view.graphics.add(pictureGraphic);

        const simpleLineSymbol = {
            type: "simple-line",
            color: [226, 119, 40], // orange
            width: 2
        };

        const polyline = {
            type: 'polyline',
            paths: [
                [-118.29026, 34.1816],
                [-118.26451, 34.09664]
            ]
        }

        const polylineGraphic = new Graphic({
            geometry: polyline,
            symbol: simpleLineSymbol
        })

        view.graphics.add(polylineGraphic);

        const polygon = {
            type: "polygon",
            rings: [
                [-118.27653, 34.15121],
                [-118.2446, 34.15462],
                [-118.22915, 34.14439],
                [-118.23327, 34.12279],
                [-118.25318, 34.10972],
                [-118.26486, 34.11625],
                [-118.27653, 34.15121]
            ]
        };

        const simpleFillSymbol = {
            type: "simple-fill",
            color: [227, 139, 79, 0.8],  // orange, opacity 80%
            outline: {
                color: [255, 255, 255],
                width: 1
            }
        };

        const polygonGraphic = new Graphic({
            geometry: polygon,
            symbol: simpleFillSymbol
        });

        view.graphics.add(polygonGraphic);
    },
    beforeDestroy() {
        if (this.view) {
            // destroy the map view
            this.view.container = null
        }
    }
}

</script>

<style scoped>
div {
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
}
</style>