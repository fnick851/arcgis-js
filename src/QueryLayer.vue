<template>
    <div></div>
</template>

<script>
import { loadModules } from 'esri-loader'

export default {
    name: 'QueryLayer',
    data() {
        return {
            view: null
        }
    },
    async mounted() {
        // lazy load the required ArcGIS API for JavaScript modules and CSS
        const [
            Map, MapView, FeatureLayer, GraphicsLayer, Graphic
        ] = await loadModules([
            "esri/Map",
            "esri/views/MapView",
            "esri/layers/FeatureLayer",
            "esri/layers/GraphicsLayer",
            "esri/Graphic"], { css: true })

        const map = new Map({
            basemap: 'satellite'
        });

        this.view = new MapView({
            container: this.$el,
            map: map,
            center: [-118.7, 34.1],
            zoom: 12
        })

        // Reference the feature layer to query
        const featureLayer = new FeatureLayer({
            url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads_Styled/FeatureServer/0",
        });

        // Layer used to draw graphics returned
        const graphicsLayer = new GraphicsLayer();
        map.add(graphicsLayer);

        function addGraphics(result) {
            graphicsLayer.removeAll();
            result.features.forEach(function (feature) {
                const g = new Graphic({
                    geometry: feature.geometry,
                    attributes: feature.attributes,
                    symbol: {
                        type: "simple-marker",
                        color: [0, 0, 0],
                        outline: {
                            width: 2,
                            color: [0, 255, 255],
                        },
                        size: "20px"
                    },
                    popupTemplate: {
                        title: "{TRL_NAME}",
                        content: "This a {PARK_NAME} trail located in {CITY_JUR}."
                    }
                });
                graphicsLayer.add(g);
            });
        }

        function queryFeatureLayer(point, distance, spatialRelationship, sqlExpression) {
            const query = {
                geometry: point,
                distance: distance,
                spatialRelationship: spatialRelationship,
                outFields: ["*"],
                returnGeometry: true,
                where: sqlExpression
            };
            featureLayer.queryFeatures(query).then(function (result) {
                addGraphics(result, true);
            });
        }

        const sql = "TRL_NAME like '%Canyon%'";

        this.view.when(() => {
            queryFeatureLayer(this.view.center, 5000, "intersects", sql);
        });

        this.view.on("click", function (event) {
            queryFeatureLayer(event.mapPoint, 5000, "intersects", sql);
        });
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