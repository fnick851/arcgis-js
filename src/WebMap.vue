<template>
    <div></div>
</template>

<script>
import { loadModules } from 'esri-loader'

export default {
    name: 'SimpleLayer',
    data() {
        return {
            view: null
        }
    },
    async mounted() {
        // lazy load the required ArcGIS API for JavaScript modules and CSS
        const [
            WebMap,
            MapView,
            Legend,
            ScaleBar,
        ] = await loadModules([
            "esri/WebMap",
            "esri/views/MapView",
            "esri/widgets/Legend",
            "esri/widgets/ScaleBar",], { css: true })

        const map = new WebMap({
            portalItem: {
                id: "41281c51f9de45edaf1c8ed44bb10e30"
            }
        });

        const view = new MapView({
            container: this.$el,
            map: map,
        })

        const legend = new Legend({
            view: view
        });
        view.ui.add(legend, "top-right");

        const scalebar = new ScaleBar({
            view: view
        });
        view.ui.add(scalebar, "bottom-left");
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