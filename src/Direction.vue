<template>
    <div class="full-wh">
        <div class="full-wh" ref="map"></div>
    </div>
</template>

<script>
import { loadModules } from 'esri-loader'

export default {
    name: 'Direction',
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
            Directions,
            SimpleMarkerSymbol
        ] = await loadModules([
            "esri/Map",
            "esri/views/MapView",
            "esri/widgets/Directions",
            "esri/symbols/SimpleMarkerSymbol"
        ], { css: true })

        const map = new Map({
            basemap: "streets-navigation-vector"
        });

        const view = new MapView({
            container: this.$refs.map,
            map: map,
            center: [-118.24532, 34.05398],
            zoom: 12,
            padding: {
                right: 320
            }
        })

        const directions = new Directions({
            view: view
        });

        function createStopSymbol(color, size) {
            return new SimpleMarkerSymbol({
                style: "simple-marker",
                size: size,
                outline: {
                    width: "2px",
                    color: "white"
                },
                color: color
            });
        }

        // Stop symbols
        directions.stopSymbols.first = createStopSymbol("green", "14px");
        directions.stopSymbols.middle = createStopSymbol("black", "10px");
        directions.stopSymbols.last = createStopSymbol("red", "14px");

        // Route symbol
        directions.routeSymbol.width = "2";
        directions.routeSymbol.color = [0, 0, 0, 0.75];
        directions.routeSymbol.style = "short-dot";

        view.ui.add(directions, "top-right");
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