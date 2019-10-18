<template>
    <div></div>
</template>

<script>
import { loadModules } from 'esri-loader'

export default {
    name: 'FilterLayerPolygon',
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
            center: [-120, 45],
            zoom: 4
        })

        const featureLayer = new FeatureLayer({
            url: "https://services6.arcgis.com/Wwv1InPxRQv6NCzu/ArcGIS/rest/services/WIOA_Public__2_year/FeatureServer/0",
            outFields: ["*"], // Return all fields so it can be queried client-side
            popupTemplate: {  // Enable a popup
                title: "Population", // Show attribute value
                content: "{Population}"  // Display in pop-up
            }
        });

        map.add(featureLayer);

        const sqlExpressions = ["Population > 300000"];

        // server side filter
        const selectFilterServer = document.createElement("select");
        selectFilterServer.setAttribute("class", "esri-widget esri-select");
        selectFilterServer.setAttribute("id", "server-select");
        const selectFilterServerLabel = document.createElement("label");
        selectFilterServerLabel.innerHTML = 'Server side filter:'
        selectFilterServerLabel.setAttribute("for", "server-select");
        const defaultOption = document.createElement("option");
        defaultOption.setAttribute('selected', 'selected')
        defaultOption.value = '';
        defaultOption.innerHTML = '';
        selectFilterServer.appendChild(defaultOption);
        sqlExpressions.forEach(function (sql) {
            const option = document.createElement("option");
            option.value = sql;
            option.innerHTML = sql;
            selectFilterServer.appendChild(option);
        });
        function setFeatureLayerFilter(expression) {
            console.log('expression', expression)
            featureLayer.definitionExpression = expression;
        }
        selectFilterServer.addEventListener('change', function (event) {
            console.log(event.target.value)
            setFeatureLayerFilter(event.target.value);
        });
        this.view.ui.add(selectFilterServerLabel, "top-right");
        this.view.ui.add(selectFilterServer, "top-right");


        let highlight;
        const vm = this
        vm.view.whenLayerView(featureLayer).then(function (featureLayerView) {
            vm.view.on("pointer-move", function (event) {
                vm.view.hitTest(event).then(function (response) {
                    // Only return features for the feature layer
                    var feature = response.results.filter(function (result) {
                        return result.graphic.layer === featureLayer;
                    })[0].graphic;
                    if (highlight) {
                        highlight.remove();
                    }
                    // Highlight feature
                    highlight = featureLayerView.highlight(feature);
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

div >>> select {
    width: 275px;
    font-family: Avenir Next W00;
    font-size: 1em;
}

div >>> label {
    padding: 10px;
    background-color: gainsboro;
    border-radius: 2px;
    font-family: Avenir Next W00;
    font-size: 1em;
}
</style>