<template>
    <div></div>
</template>

<script>
import { loadModules } from 'esri-loader'

export default {
    name: 'Popup',
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
            FeatureLayer
        ] = await loadModules([
            "esri/Map",
            "esri/views/MapView",
            "esri/layers/FeatureLayer"], { css: true })

        const map = new ArcGISMap({
            basemap: 'satellite'
        });

        this.view = new MapView({
            container: this.$el,
            map: map,
            center: [-118.7, 34.1],
            zoom: 12
        })

        const popupTrailheads = {
            "title": "{TRL_NAME}",
            "content": "<b>City:</b> {CITY_JUR}<br><b>Cross Street:</b> {X_STREET}<br><b>Parking:</b> {PARKING}<br><b>Elevation:</b> {ELEV_FT} ft"
        }

        const trailheads = new FeatureLayer({
            url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads_Styled/FeatureServer/0",
            outFields: ["TRL_NAME", "CITY_JUR", "X_STREET", "PARKING", "ELEV_FT"],
            popupTemplate: popupTrailheads
        });

        map.add(trailheads);

        const popupTrails = {
            title: "Trail Information",
            expressionInfos: [{
                name: "elevation-ratio",
                title: "Elevation change",
                expression: "Round((($feature.ELEV_MAX - $feature.ELEV_MIN)/($feature.LENGTH_MI)/5280)*100,2)"
            }],
            // content: function () {
            //     return "The {TRL_NAME} trail average slope per mile is: {expression/elevation-ratio}% over a total of {LENGTH_MI} miles."
            // },
            content: [{
                type: "media",
                mediaInfos: [{
                    type: "column-chart",
                    caption: "The {TRL_NAME} trail average slope per mile is: {expression/elevation-ratio}% over a total of {LENGTH_MI} miles.",
                    value: {
                        fields: ["ELEV_MIN", "ELEV_MAX"],
                        normalizeField: null,
                        tooltipField: "Min and max elevation values"
                    }
                }]
            }]
        }

        const trails = new FeatureLayer({
            url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails_Styled/FeatureServer/0",
            outFields: ["TRL_NAME", "ELEV_GAIN"],
            popupTemplate: popupTrails
        });

        map.add(trails, 0);
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