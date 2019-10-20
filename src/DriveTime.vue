<template>
    <div class="full-wh">
        <div class="full-wh" ref="map"></div>
    </div>
</template>

<script>
import { loadModules } from 'esri-loader'

export default {
    name: 'DriveTime',
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
            ServiceAreaTask,
            ServiceAreaParams,
            FeatureSet,
            Graphic
        ] = await loadModules([
            "esri/Map",
            "esri/views/MapView",
            "esri/tasks/ServiceAreaTask",
            "esri/tasks/support/ServiceAreaParameters",
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
            zoom: 11
        })

        const serviceAreaTask = new ServiceAreaTask({
            url: "https://route.arcgis.com/arcgis/rest/services/World/ServiceAreas/NAServer/ServiceArea_World/solveServiceArea"
        });

        function createGraphic(point) {
            // Remove any existing graphics
            view.graphics.removeAll();
            // Create a and add the point
            const graphic = new Graphic({
                geometry: point,
                symbol: {
                    type: "simple-marker",
                    color: "white",
                    size: 8
                }
            });
            view.graphics.add(graphic);
            return graphic;
        }

        function createServiceAreaParams(locationGraphic, driveTimeCutoffs, outSpatialReference) {
            // Create one or more locations (facilities) to solve for
            const featureSet = new FeatureSet({
                features: [locationGraphic]
            });
            // Set all of the input parameters for the service
            const taskParameters = new ServiceAreaParams({
                facilities: featureSet, // Location(s) to start from
                defaultBreaks: driveTimeCutoffs, // One or more drive time cutoff values
                outSpatialReference: outSpatialReference // Spatial reference to match the view
            });
            return taskParameters;
        }

        function executeServiceAreaTask(serviceAreaParams) {
            return serviceAreaTask.solve(serviceAreaParams)
                .then(function (result) {
                    if (result.serviceAreaPolygons.length) {
                        // Draw each service area polygon
                        result.serviceAreaPolygons.forEach(function (graphic) {
                            graphic.symbol = {
                                type: "simple-fill",
                                color: "rgba(255,50,50,.25)"
                            }
                            view.graphics.add(graphic, 0);
                        });
                    }
                }, function (error) {
                    console.log(error);
                });
        }

        view.on("click", function (event) {
            const locationGraphic = createGraphic(event.mapPoint);
            const driveTimeCutoffs = [5, 10, 15]; // Minutes (default)
            const serviceAreaParams = createServiceAreaParams(locationGraphic, driveTimeCutoffs, view.spatialReference);
            executeServiceAreaTask(serviceAreaParams);
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