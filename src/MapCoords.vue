<template>
    <div></div>
</template>

<script>
import { loadModules } from 'esri-loader'

export default {
    name: 'MapCoords',
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
            CoordinateConversion
        ] = await loadModules([
            "esri/Map",
            "esri/views/MapView",
            "esri/widgets/CoordinateConversion"], { css: true })

        const map = new Map({
            basemap: "topo-vector"
        });

        const view = new MapView({
            container: this.$el,
            map: map,
            center: [-118.80500, 34.02700],
            zoom: 13
        });

        const coordsWidget = document.createElement("div");
        coordsWidget.id = "coordsWidget";
        coordsWidget.className = "esri-widget esri-component";
        coordsWidget.style.padding = "7px 15px 5px";

        view.ui.add(coordsWidget, "bottom-right");

        function showCoordinates(pt) {
            const coords = "Lat/Lon " + pt.latitude.toFixed(3) + " " + pt.longitude.toFixed(3) +
                " | Scale 1:" + Math.round(view.scale * 1) / 1 +
                " | Zoom " + view.zoom + "<br />Default Lat/Lon " + pt.x.toFixed(3) + " " + pt.y.toFixed(3) +
                " | Scale 1:" + Math.round(view.scale * 1) / 1 +
                " | Zoom " + view.zoom;
            coordsWidget.innerHTML = coords;
        }

        view.watch("stationary", function (isStationary) {
            showCoordinates(view.center);
        });

        view.on("pointer-move", function (evt) {
            showCoordinates(view.toMap({ x: evt.x, y: evt.y }));
        });


        const coordinateConversionWidget = new CoordinateConversion({
            view: view
        });

        view.ui.add(coordinateConversionWidget, "bottom-right");
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