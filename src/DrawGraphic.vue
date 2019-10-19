<template>
    <div></div>
</template>

<script>
import { loadModules } from 'esri-loader'

export default {
    name: 'DrawGraphic',
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
            GraphicsLayer,
            Sketch
        ] = await loadModules([
            "esri/Map",
            "esri/views/MapView",
            "esri/layers/GraphicsLayer",
            "esri/widgets/Sketch",], { css: true })

        const map = new Map({
            basemap: "topo-vector"
        });

        const view = new MapView({
            container: this.$el,
            map: map,
            center: [-118.80500, 34.02700],
            zoom: 13
        });

        const graphicsLayer = new GraphicsLayer();

        map.add(graphicsLayer)

        const sketch = new Sketch({
            view: view,
            layer: graphicsLayer
        });

        //*** Red stroke, 1px wide ***//
        const stroke = {
            color: [255, 0, 0],
            width: 1
        }

        //*** White fill color with 50% transparency ***//
        const fillColor = [255, 255, 255, .5];

        //*** Override all of the default symbol colors and sizes ***//
        const pointSymbol = sketch.viewModel.pointSymbol;
        pointSymbol.color = fillColor;
        pointSymbol.outline = stroke;
        pointSymbol.size = 8;

        const polylineSymbol = sketch.viewModel.polylineSymbol;
        polylineSymbol.color = stroke.color;
        polylineSymbol.width = stroke.width;

        const polygonSymbol = sketch.viewModel.polygonSymbol;
        polygonSymbol.color = fillColor;
        polygonSymbol.outline = stroke;

        sketch.on("create", function (event) {
            if (event.state === "complete") {
                const attributes = {
                    name: "My Graphic",
                    type: event.graphic.geometry.type
                }
                event.graphic.attributes = attributes;

                const popupTemplate = {
                    title: "{name}",
                    content: "I am a {type}."
                }
                event.graphic.popupTemplate = popupTemplate;
            }
        });

        view.ui.add(sketch, "top-right");

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