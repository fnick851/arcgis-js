<template>
    <div></div>
</template>

<script>
import { loadModules } from 'esri-loader'

export default {
    name: 'StyleLayer',
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

        const trailheadsRenderer = {
            type: "simple",
            symbol: {
                type: "picture-marker",
                url: "http://static.arcgis.com/images/Symbols/NPS/npsPictograph_0231b.png",
                width: "18px",
                height: "18px"
            }
        }

        const trailheadsLabels = {
            symbol: {
                type: "text",
                color: "#FFFFFF",
                haloColor: "#5E8D74",
                haloSize: "2px",
                font: {
                    size: "12px",
                    family: "Noto Sans",
                    style: "italic",
                    weight: "normal"
                }
            },
            labelPlacement: "above-center",
            labelExpressionInfo: {
                expression: "$feature.TRL_NAME"
            }
        };

        const trailheadsLayer = new FeatureLayer({
            url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0",
            renderer: trailheadsRenderer,
            labelingInfo: [trailheadsLabels]
        });

        map.add(trailheadsLayer);

        const trailsRenderer = {
            type: "simple",
            symbol: {
                color: "#BA55D3",
                type: "simple-line",
                style: "solid"
            },
            visualVariables: [
                {
                    type: "size",
                    field: "ELEV_GAIN",
                    minDataValue: 0,
                    maxDataValue: 5000,
                    minSize: "1px",
                    maxSize: "50px"
                }
            ]
        };

        // Trails feature layer (lines)
        const trailsLayer = new FeatureLayer({
            url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0",
            definitionExpression: "ELEV_GAIN < 500",
            renderer: trailsRenderer,
            opacity: .75,
            outFields: ["TRL_NAME", "ELEV_GAIN"],
            popupTemplate: {  // Enable a popup
                title: "{TRL_NAME}", // Show attribute value
                content: "The trail elevation gain is {ELEV_GAIN} ft."  // Display text in pop-up
            }
        });

        map.add(trailsLayer, 0);

        const bikeTrailsRenderer = {
            type: "simple",
            symbol: {
                type: "simple-line",
                style: "short-dot",
                color: "#FF91FF",
                width: "1px"
            }
        };

        const bikeTrails = new FeatureLayer({
            url:
                "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0",
            renderer: bikeTrailsRenderer,
            definitionExpression: "USE_BIKE = 'YES'"
        });

        map.add(bikeTrails, 1);

        function createFillSymbol(value, color) {
            return {
                value: value,
                symbol: {
                    color: color,
                    type: "simple-fill",
                    style: "solid",
                    outline: {
                        style: "none"
                    }
                },
                label: value
            };
        }

        const openSpacesRenderer = {
            type: "unique-value",
            field: "TYPE",
            uniqueValueInfos: [
                createFillSymbol("Natural Areas", "#9E559C"),
                createFillSymbol("Regional Open Space", "#A7C636"),
                createFillSymbol("Local Park", "#149ECE"),
                createFillSymbol("Regional Recreation Park", "#ED5151")
            ]
        };

        // Parks and open spaces (polygons)
        const parksLayer = new FeatureLayer({
            url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Parks_and_Open_Space/FeatureServer/0",
            renderer: openSpacesRenderer,
            opacity: 0.20
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