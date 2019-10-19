<template>
    <div></div>
</template>

<script>
import { loadModules } from 'esri-loader'

export default {
    name: 'PortalItem',
    data() {
        return {
            view: null
        }
    },
    async mounted() {
        // lazy load the required ArcGIS API for JavaScript modules and CSS
        const [
            ArcGISMap,
            MapView,
            Layer
        ] = await loadModules([
            "esri/Map",
            "esri/views/MapView",
            "esri/layers/Layer"], { css: true })

        const map = new ArcGISMap({
            basemap: 'satellite'
        });

        this.view = new MapView({
            container: this.$el,
            map: map,
            center: [-118.7, 34.1],
            zoom: 12
        })

        function addLayer(layerItemPromise, index) {
            return layerItemPromise.then(function (layer) {
                layer.when(function () {
                    if (layer.title === "Trails_Styled_Popups") {
                        layer.definitionExpression = "ELEV_GAIN < 250";
                    }
                });
                map.add(layer, index);
            });
        }

        const trailheadsPortalItem = Layer.fromPortalItem({
            portalItem: {
                id: "33fc2fa407ab40f9add12fe38d5801f5"
            }
        });

        // Trails
        const trailsPortalItem = Layer.fromPortalItem({
            portalItem: {
                id: "52a162056a2d48409fc3b3cbb672e7da"
            }
        });

        // Parks
        const parksPortalItem = Layer.fromPortalItem({
            portalItem: {
                id: "83cf97eea04e4a699689c250dd07b975"
            }
        });


        addLayer(trailheadsPortalItem, 2)
            .then(addLayer(trailsPortalItem, 1))
            .then(addLayer(parksPortalItem, 0));

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