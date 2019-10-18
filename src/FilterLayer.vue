<template>
    <div></div>
</template>

<script>
import { loadModules } from 'esri-loader'

export default {
    name: 'FilterLayer',
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

        const featureLayer = new FeatureLayer({
            url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails_Styled/FeatureServer/0",
            outFields: ["*"], // Return all fields so it can be queried client-side
            popupTemplate: {  // Enable a popup
                title: "{TRL_NAME}", // Show attribute value
                content: "The trail elevation gain is {ELEV_GAIN} ft."  // Display in pop-up
            }
        });

        map.add(featureLayer);

        const sqlExpressions = ["TRL_ID = 0", "TRL_ID > 0", "USE_BIKE = 'Yes'", "USE_BIKE = 'No'", "ELEV_GAIN < 1000", "ELEV_GAIN > 1000", "TRL_NAME = 'California Coastal Trail'"];

        // server side filter
        const selectFilterServer = document.createElement("select");
        selectFilterServer.setAttribute("class", "esri-widget esri-select");
        selectFilterServer.setAttribute("id", "server-select");
        const selectFilterServerLabel = document.createElement("label");
        selectFilterServerLabel.innerHTML = 'Server side filter:'
        selectFilterServerLabel.setAttribute("for", "server-select");
        sqlExpressions.forEach(function (sql) {
            const option = document.createElement("option");
            option.value = sql;
            option.innerHTML = sql;
            selectFilterServer.appendChild(option);
        });
        function setFeatureLayerFilter(expression) {
            featureLayer.definitionExpression = expression;
        }
        selectFilterServer.addEventListener('change', function (event) {
            setFeatureLayerFilter(event.target.value);
        });
        this.view.ui.add(selectFilterServerLabel, "top-right");
        this.view.ui.add(selectFilterServer, "top-right");

        // client side filter
        const selectFilterClient = document.createElement("select");
        selectFilterClient.setAttribute("class", "esri-widget esri-select");
        selectFilterClient.setAttribute("id", "client-select");
        const selectFilterClientLabel = document.createElement("label");
        selectFilterClientLabel.innerHTML = 'Client side filter (with opacity effect on excluded):'
        selectFilterClientLabel.setAttribute("for", "client-select");
        sqlExpressions.forEach(function (sql) {
            const option = document.createElement("option");
            option.value = sql;
            option.innerHTML = sql;
            selectFilterClient.appendChild(option);
        });
        const setFeatureLayerViewFilter = (expression) => {
            this.view.whenLayerView(featureLayer).then(function (featureLayerView) {
                featureLayerView.effect = {
                    filter: {
                        where: expression
                    },
                    excludedEffect: "opacity(30%)"
                }
            });
        }
        selectFilterClient.addEventListener('change', function (event) {
            setFeatureLayerViewFilter(event.target.value);
        });
        this.view.ui.add(selectFilterClientLabel, "top-right");
        this.view.ui.add(selectFilterClient, "top-right");


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