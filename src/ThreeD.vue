<template>
    <div></div>
</template>

<script>
import { loadModules } from 'esri-loader'

export default {
    name: 'ThreeD',
    data() {
        return {
            view: null
        }
    },
    async mounted() {
        // lazy load the required ArcGIS API for JavaScript modules and CSS
        const [
            Map,
            SceneView,
            FeatureLayer,
        ] = await loadModules([
            "esri/Map",
            "esri/views/SceneView",
            "esri/layers/FeatureLayer",
        ], { css: true })

        const map = new Map({
            basemap: "topo-vector",
            ground: "world-elevation"
        });

        const view = new SceneView({
            container: this.$el,
            map: map,
            camera: {
                position: {
                    x: -118.808,
                    y: 33.961,
                    z: 2000 // meters
                },
                tilt: 75
            }
        });

        // Trailheads point feature layer
        const featureLayer = new FeatureLayer({
            url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0"
        });

        map.add(featureLayer);

        // Trails feature layer (lines)
        const trailsLayer = new FeatureLayer({
            url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0",
            definitionExpression: "ELEV_GAIN < 250",

            renderer: {
                type: "simple",
                symbol: {
                    type: "simple-line",
                    color: "green",
                    width: "3px"
                }
            },

            outFields: ["TRL_NAME", "ELEV_GAIN"],

            popupTemplate: {  // Enable a popup
                title: "{TRL_NAME}", // Show attribute value
                content: "The trail elevation gain is {ELEV_GAIN} ft."  // Display text in pop-up
            }
        });


        map.add(trailsLayer, 0);

        // Parks and open spaces (polygons)
        const parksLayer = new FeatureLayer({
            url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Parks_and_Open_Space/FeatureServer/0"
        });

        map.add(parksLayer, 0);
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