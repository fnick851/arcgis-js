<template>
    <div></div>
</template>

<script>
import { loadModules } from 'esri-loader'

export default {
    name: 'WebScene',
    data() {
        return {
            view: null
        }
    },
    async mounted() {
        // lazy load the required ArcGIS API for JavaScript modules and CSS
        const [
            WebScene,
            SceneView,
            Legend,
        ] = await loadModules([
            "esri/WebScene",
            "esri/views/SceneView",
            "esri/widgets/Legend",
        ], { css: true })

        const webscene = new WebScene({
            portalItem: {
                id: "579f97b2f3b94d4a8e48a5f140a6639b"
            }
        });

        const view = new SceneView({
            container: this.$el,
            map: webscene
        });

        const legend = new Legend({
            view: view
        })
        view.ui.add(legend, "top-right");
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