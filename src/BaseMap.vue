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
            ArcGISMap,
            MapView,
            BasemapToggle,
            BasemapGallery
        ] = await loadModules([
            "esri/Map",
            "esri/views/MapView",
            "esri/widgets/BasemapToggle",
            "esri/widgets/BasemapGallery"], { css: true })

        const map = new ArcGISMap({
            basemap: 'satellite'
        });

        this.view = new MapView({
            container: this.$el,
            map: map,
            center: [-118, 34],
            zoom: 8
        })

        const basemapToggle = new BasemapToggle({
            view: this.view,
            nextBasemap: "dark-gray-vector"
        })

        this.view.ui.add(basemapToggle, "bottom-right")

        const basemapGallery = new BasemapGallery({
            view: this.view,
            source: {
                portal: {
                    url: "https://www.arcgis.com",
                    useVectorBasemaps: true  // Load vector tile basemaps
                }
            }
        })

        this.view.ui.add(basemapGallery, "top-right")
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