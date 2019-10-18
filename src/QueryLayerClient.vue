<template>
    <div></div>
</template>

<script>
import { loadModules } from 'esri-loader'

export default {
    name: 'QueryLayerClient',
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
            url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0",
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

        const queryFeatureLayerView = (point, distance, spatialRelationship, sqlExpression) => {
            // Add the layer if it is missing
            if (!map.findLayerById(featureLayer.id)) {
                featureLayer.outFields = ["*"];
                map.add(featureLayer, 0);
            }
            // Set up the query
            var query = {
                geometry: point,
                distance: distance,
                spatialRelationship: spatialRelationship,
                outFields: ["*"],
                returnGeometry: true,
                where: sqlExpression
            };
            // Wait for the layerview to be ready and then query features
            this.view.whenLayerView(featureLayer).then(function (featureLayerView) {
                if (featureLayerView.updating) {
                    const handle = featureLayerView.watch("updating", function (isUpdating) {
                        if (!isUpdating) {
                            // Execute the query
                            featureLayerView.queryFeatures(query).then(function (result) {
                                addGraphics(result)
                            });
                            handle.remove();
                        }
                    });
                } else {
                    // Execute the query
                    featureLayerView.queryFeatures(query).then(function (result) {
                        addGraphics(result);
                    });
                }
            });
        }

        this.view.when(() => {
            queryFeatureLayerView(this.view.center, 1500, "intersects");
        });

        this.view.on("click", function (event) {
            queryFeatureLayerView(event.mapPoint, 1500, "intersects");
        });

        const vm = this
        vm.view.when(function () {
            vm.view.whenLayerView(featureLayer).then(function (featureLayerView) {
                vm.view.on("pointer-move", function (event) {
                    vm.view.hitTest(event).then(function (response) {
                        // Only return features for the feature layer
                        var feature = response.results.filter(function (result) {
                            return result.graphic.layer === featureLayer;
                        })[0].graphic;
                        if (feature) {
                            // Show popup for new features only
                            if (!vm.view.popup.features.length || vm.view.popup.features.length && (vm.view.popup.features[0].attributes.FID !== feature.attributes.FID)) {
                                vm.view.popup.open({
                                    title: feature.attributes.TRL_NAME,
                                    content: "This a " + feature.attributes.PARK_NAME + " trail located in " + feature.attributes.CITY_JUR + ".",
                                    location: feature.geometry
                                });
                            }
                        }
                    });
                });
            });
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