<template>
    <div class="root">
        <form class="checkbox-form">
            <div v-for="fieldName in fieldNames" :key="fieldName">
                <input
                    type="checkbox"
                    :id="fieldName"
                    :value="fieldName"
                    v-model="checkedFields"
                    @change="renderLayer()"
                />
                <label :for="fieldName">{{fieldName}}</label>
            </div>
        </form>
        <div ref="map"></div>
    </div>
</template>

<script>
import { loadModules } from 'esri-loader'

export default {
    name: 'Arcade',
    data() {
        return {
            view: null,
            map: null,
            layer: null,
            fieldNames: [],
            checkedFields: []
        }
    },
    async mounted() {
        // lazy load the required ArcGIS API for JavaScript modules and CSS
        const [
            Map,
            MapView,
            FeatureLayer,
            Legend,
            sizeRendererCreator
        ] = await loadModules([
            "esri/Map",
            "esri/views/MapView",
            "esri/layers/FeatureLayer",
            "esri/widgets/Legend",
            "esri/renderers/smartMapping/creators/size"
        ], { css: true })

        this.sizeRendererCreator = sizeRendererCreator
        this.FeatureLayer = FeatureLayer

        this.map = new Map({
            basemap: "gray",
        });

        this.view = new MapView({
            container: this.$refs.map,
            map: this.map,
            center: [-120, 45],
            zoom: 4
        })

        this.layer = new FeatureLayer({
            url: "https://services6.arcgis.com/Wwv1InPxRQv6NCzu/ArcGIS/rest/services/WIOA_Public__2_year/FeatureServer/0",
            title: "Total value of all selected layers"
        });

        this.view.ui.add(new Legend({
            view: this.view
        }), "bottom-left")

        this.constructFieldsList()
    },
    methods: {
        async constructFieldsList() {
            const layer = await new this.FeatureLayer({
                url: "https://services6.arcgis.com/Wwv1InPxRQv6NCzu/ArcGIS/rest/services/WIOA_Public__2_year/FeatureServer/0"
            }).load()
            for (let field of layer.fields) {
                this.fieldNames.push(field.name)
            }
        },
        renderLayer() {
            this.map.removeAll()
            this.constructLayer(this.checkedFields)
        },
        async constructLayer(fields) {
            let popupContent = '<ul>'
            let arcadeExpression = "return ("
            for (let field of fields) {
                arcadeExpression += `$feature.${field} +`
                popupContent += `
                    <li><strong>${field}:</strong> {${field}}</li>
                `
            }
            arcadeExpression += "0)"
            popupContent += '</ul>'

            this.layer.popupTemplate = {
                content: popupContent
            }

            // visualization based off Arcade expression
            const sizeParams = {
                layer: this.layer,
                classificationMethod: "natural-breaks",
                valueExpression: arcadeExpression,
                view: this.view
            };

            // when the promise resolves, apply the renderer to the layer
            const rendererRes = await this.sizeRendererCreator.createClassBreaksRenderer(sizeParams)
            const renderer = rendererRes.renderer
            renderer.defaultSymbol = {
                type: "simple-fill", // autocasts as new SimpleFillSymbol()
                color: "black",
                style: "backward-diagonal",
                outline: {
                    width: 0.5,
                    color: [50, 50, 50, 0.6]
                }
            }
            renderer.defaultLabel = "no data"
            const colors = ['#edf8fb',
                '#b2e2e2',
                '#66c2a4',
                '#2ca25f',
                '#006d2c']
            for (let i = 0; i < renderer.classBreakInfos.length; i++) {
                renderer.classBreakInfos[i].symbol = {
                    type: "simple-fill",  // autocasts as new SimpleFillSymbol()
                    color: colors[i],
                    style: "solid",
                    outline: {  // autocasts as new SimpleLineSymbol()
                        color: "grey",
                        width: 1
                    }
                };
            }

            this.layer.renderer = renderer
            this.map.add(this.layer)
        }
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
.root,
.root >>> .esri-view {
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
}
form {
    position: fixed;
    top: 10px;
    right: 10px;
    display: inline-block;
    z-index: 10;
    background-color: white;
    padding: 5px;
    max-height: 400px;
    overflow: scroll;
    box-shadow: grey 1px 1px 3px 0px;
}
.root >>> ul {
    list-style: none;
}
</style>