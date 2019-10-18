<template>
    <div></div>
</template>

<script>
import { loadModules } from 'esri-loader'

export default {
    name: 'Arcade',
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
            FeatureLayer,
            Legend
        ] = await loadModules([
            "esri/Map",
            "esri/views/MapView",
            "esri/layers/FeatureLayer",
            "esri/widgets/Legend"
        ], { css: true })

        const less35 = {
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            color: "#fffcd4",
            style: "solid",
            outline: {
                width: 0.2,
                color: [255, 255, 255, 0.5]
            }
        };

        const less50 = {
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            color: "#b1cdc2",
            style: "solid",
            outline: {
                width: 0.2,
                color: [255, 255, 255, 0.5]
            }
        };

        const more50 = {
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            color: "#38627a",
            style: "solid",
            outline: {
                width: 0.2,
                color: [255, 255, 255, 0.5]
            }
        };

        const more75 = {
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            color: "#0d2644",
            style: "solid",
            outline: {
                width: 0.2,
                color: [255, 255, 255, 0.5]
            }
        };

        const arcadeExpression = `
            var associate_degree = $feature.Associate_s_degree;
            var master_degree = $feature.Master_s_degree;
            var total = associate_degree + master_degree
            return total
        `

        const renderer = {
            type: "class-breaks", // autocasts as new ClassBreaksRenderer()
            // field: "Public__4_year_or_above",
            // normalizationField: "EDUCBASECY",
            valueExpression: arcadeExpression,
            // valueExpressionTitle: 'Sum of associate and master degrees',
            // legendOptions: {
            //     title: "associate plus master degrees"
            // },
            defaultSymbol: {
                type: "simple-fill", // autocasts as new SimpleFillSymbol()
                color: "black",
                style: "backward-diagonal",
                outline: {
                    width: 0.5,
                    color: [50, 50, 50, 0.6]
                }
            },
            defaultLabel: "no data",
            classBreakInfos: [
                {
                    minValue: 0,
                    maxValue: 1000,
                    symbol: less35,
                    label: "0 1000"
                },
                {
                    minValue: 1001,
                    maxValue: 3000,
                    symbol: less50,
                    label: "1001 3000"
                },
                {
                    minValue: 3001,
                    maxValue: 6000,
                    symbol: more50,
                    label: "3001 6000"
                },
                {
                    minValue: 6001,
                    maxValue: 80000,
                    symbol: more75,
                    label: "6001 80000"
                }
            ]
        };

        const featureLayer = new FeatureLayer({
            url:
                "https://services6.arcgis.com/Wwv1InPxRQv6NCzu/ArcGIS/rest/services/WIOA_Public__2_year/FeatureServer/0",
            title: "associate plus master degrees",
            renderer: renderer,
            popupTemplate: {
                // autocast as esri/PopupTemplate
                title: "Fields",
                expressionInfos: {
                    name: "sum-arcade",
                    title: "sum of multiple fields",
                    expression: arcadeExpression
                },
                content:
                    [
                        {
                            type: "text",
                            text:
                                "Master: {Master_s_degree}, Associate: {Associate_s_degree}, Arcade: {expression/sum-arcade}"
                        }
                    ]
            },
            opacity: 0.7
        });

        const map = new Map({
            basemap: "gray",
            layers: [featureLayer]
        });

        this.view = new MapView({
            container: this.$el,
            map: map,
            center: [-120, 40],
            zoom: 4
        })

        const legend = new Legend({
            view: this.view
        });

        this.view.ui.add(legend, "bottom-left");
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