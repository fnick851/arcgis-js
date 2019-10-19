<template>
    <div></div>
</template>

<script>
import { loadModules } from 'esri-loader'

export default {
    name: 'BaseMap',
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
            BaseMap,
            VectorTileLayer,
            TileLayer
        ] = await loadModules([
            "esri/Map",
            "esri/views/MapView",
            "esri/Basemap",
            "esri/layers/VectorTileLayer",
            "esri/layers/TileLayer"], { css: true })

        this.basemap = new BaseMap({
            baseLayers: [
                new TileLayer({ // add terrain to the base map
                    portalItem: {
                        id: "1b243539f4514b6ba35e7d995890db1d" // World Hillshade
                    }
                }),

                new VectorTileLayer({
                    portalItem: {
                        id: "d2ff12395aeb45998c1b154e25d680e5" // Forest and Parks Canvas
                    },
                    opacity: 0.5
                })
            ]
        });

        this.map = new Map({
            basemap: this.basemap
        });

        this.view = new MapView({
            container: this.$el,
            map: this.map,
            center: [-118.80543, 34.02700],
            zoom: 3
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