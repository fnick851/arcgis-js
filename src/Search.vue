<template>
    <div></div>
</template>

<script>
import { loadModules } from 'esri-loader'

export default {
    name: 'Search',
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
            Search,
            FeatureLayer
        ] = await loadModules([
            "esri/Map",
            "esri/views/MapView",
            "esri/widgets/Search",
            "esri/layers/FeatureLayer"
        ], { css: true })

        const map = new Map({
            basemap: 'satellite'
        });

        const view = new MapView({
            container: this.$el,
            map: map,
            center: [-118.7, 34.1],
            zoom: 12
        })

        // Search widget
        const search = new Search({
            view: view
        });

        view.ui.add(search, "top-right");

        // Add the layer to the map
        const trailsLayer = new FeatureLayer({
            url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0",
        });

        map.add(trailsLayer); // Optionally add layer to map

        // Add the trailheads as a search source
        search.sources.push({
            layer: trailsLayer,
            searchFields: ["TRL_NAME"],
            displayField: "TRL_NAME",
            exactMatch: false,
            outFields: ["TRL_NAME", "PARK_NAME"],
            resultGraphicEnabled: true,
            name: "Trailheads",
            placeholder: "Example: Medea Creek Trail",
        });

        view.on("click", function (evt) {
            search.clear();
            view.popup.clear();
            if (search.activeSource) { // active world geocode service on UI for this to work
                const geocoder = search.activeSource.locator;
                const params = {
                    location: evt.mapPoint
                };
                geocoder.locationToAddress(params)
                    .then(function (response) { // Show the address found
                        const address = response.address;
                        showPopup(address, evt.mapPoint);
                    }, function (err) { // Show no address found
                        showPopup("No address found.", evt.mapPoint);
                    });
            }
        });

        function showPopup(address, pt) {
            view.popup.open({
                title: + Math.round(pt.longitude * 100000) / 100000 + "," + Math.round(pt.latitude * 100000) / 100000,
                content: address,
                location: pt
            });
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
div {
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
}
</style>