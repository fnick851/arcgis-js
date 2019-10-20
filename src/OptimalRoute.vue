<template>
    <div class="full-wh">
        <div class="full-wh" ref="map"></div>
    </div>
</template>

<script>
import { loadModules } from 'esri-loader'

export default {
    name: 'OptimalRoute',
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
            RouteTask,
            RouteParameters,
            FeatureSet,
            Graphic
        ] = await loadModules([
            "esri/Map",
            "esri/views/MapView",
            "esri/tasks/RouteTask",
            "esri/tasks/support/RouteParameters",
            "esri/tasks/support/FeatureSet",
            "esri/Graphic"
        ], { css: true })

        const map = new Map({
            basemap: "streets-navigation-vector"
        });

        const view = new MapView({
            container: this.$refs.map,
            map: map,
            center: [-118.24532, 34.05398],
            zoom: 12
        })

        const routeTask = new RouteTask({
            url: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World"
        });

        function addGraphic(type, point) {
            const graphic = new Graphic({
                symbol: {
                    type: "simple-marker",
                    color: (type === "start") ? "white" : "black",
                    size: "8px"
                },
                geometry: point
            });
            view.graphics.add(graphic);
        }

        function getRoute() {
            // Setup the route parameters
            const routeParams = new RouteParameters({
                stops: new FeatureSet({
                    features: view.graphics.toArray() // Pass the array of graphics
                }),
                returnDirections: true
            });
            // Get the route
            routeTask.solve(routeParams).then(function (data) {
                // Display the route
                data.routeResults.forEach(function (result) {
                    result.route.symbol = {
                        type: "simple-line",
                        color: [5, 150, 255],
                        width: 3
                    };
                    view.graphics.add(result.route);
                });

                // Display the directions
                const directions = document.createElement("ol");
                directions.classList = "esri-widget esri-widget--panel esri-directions__scroller";
                directions.style.marginTop = 0;
                directions.style.padding = "30px";

                // Show the directions
                const features = data.routeResults[0].directions.features;
                features.forEach(function (result, i) {
                    const direction = document.createElement("li");
                    direction.innerHTML = result.attributes.text + " (" + result.attributes.length.toFixed(2) + " miles)";
                    directions.appendChild(direction);
                });

                // Add directions to the view
                view.ui.empty("top-right");
                view.ui.add(directions, "top-right");
            });
        }

        view.on("click", function (event) {
            if (view.graphics.length === 0) {
                addGraphic("start", event.mapPoint);
            } else if (view.graphics.length === 1) {
                addGraphic("finish", event.mapPoint);
                getRoute();
            } else {
                view.graphics.removeAll();
                addGraphic("start", event.mapPoint);
            }
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
.full-wh {
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
}

.full-wh >>> .esri-view .esri-directions {
    position: fixed;
    right: 15px;
}
.full-wh >>> .esri-view .esri-component.esri-attribution {
    position: fixed;
}
</style>