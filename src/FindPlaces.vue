<template>
    <div></div>
</template>

<script>
import { loadModules } from 'esri-loader'

export default {
    name: 'FindPlaces',
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
            Locator,
            Graphic
        ] = await loadModules([
            "esri/Map",
            "esri/views/MapView",
            "esri/tasks/Locator",
            "esri/Graphic"
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

        const places = ["Coffee shop", "Gas station", "Food", "Hotel", "Neighborhood", "Parks and Outdoors", "American Food, Chinese Food, Mexican Food"];

        const select = document.createElement("select", "");
        select.setAttribute("class", "esri-widget esri-select");
        select.setAttribute("style", "width: 175px; font-family: Avenir Next W00; font-size: 1em");
        places.forEach(function (p) {
            const option = document.createElement("option");
            option.value = p;
            option.innerHTML = p;
            select.appendChild(option);
        });

        view.ui.add(select, "top-right");

        const locator = new Locator({
            url: "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
        });

        // Find places and add them to the map
        function findPlaces(category, pt) {
            locator.addressToLocations({
                location: pt,
                categories: [category],
                maxLocations: 25,
                outFields: ["Place_addr", "PlaceName"]
            })
                .then(function (results) {
                    // Clear the map
                    view.popup.close();
                    view.graphics.removeAll();
                    // Add graphics
                    results.forEach(function (result) {
                        view.graphics.add(
                            new Graphic({
                                attributes: result.attributes,
                                geometry: result.location,
                                symbol: {
                                    type: "simple-marker",
                                    color: "#000000",
                                    size: "12px",
                                    outline: {
                                        color: "#ffffff",
                                        width: "2px"
                                    }

                                },
                                popupTemplate: {
                                    title: "{PlaceName}",
                                    content: "{Place_addr}"
                                }
                            }));
                    });
                });
        }

        // Search for places in center of map when the app loads
        findPlaces(select.value, view.center);

        // Listen for category changes and find places
        select.addEventListener('change', function (event) {
            findPlaces(event.target.value, view.center);
        });

        // Listen for mouse clicks and find places
        view.on("click", function (event) {
            view.hitTest(event.screenPoint)
                .then(function (response) {
                    if (response.results.length < 2) { // If graphic is not clicked, find places
                        findPlaces(select.options[select.selectedIndex].text, event.mapPoint);
                    }
                })
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
</style>