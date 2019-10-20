<template>
    <div></div>
</template>

<script>
import { loadModules } from 'esri-loader'

export default {
    name: 'BufferIntersect',
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
            Graphic,
            geometryEngine
        ] = await loadModules([
            "esri/Map",
            "esri/views/MapView",
            "esri/layers/FeatureLayer",
            "esri/Graphic",
            "esri/geometry/geometryEngine"
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

        const featureLayer = new FeatureLayer({
            url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails_Styled/FeatureServer/0"
        });

        map.add(featureLayer);

        let activeGraphic;
        function findNearestGraphic(event) {
            return view.hitTest(event).then(function (response) {
                let graphic;
                // Get the Trail graphics only
                if (response.results.length) {
                    graphic = response.results.filter(function (result) {
                        return (result.graphic.layer === featureLayer);
                    })[0].graphic;
                }
                // Only return new graphics are found
                if (graphic) {
                    if (!activeGraphic || (activeGraphic.attributes.OBJECTID !== graphic.attributes.OBJECTID)) {
                        return graphic;
                    } else {
                        return null;
                    }
                } else {
                    return null;
                }
            });
        }


        let bufferGraphic;
        function drawBuffer(bufferGeometry) {
            view.graphics.remove(bufferGraphic);
            bufferGraphic = new Graphic({
                geometry: bufferGeometry,
                symbol: {
                    type: "simple-fill",
                    color: "rgba(0,0,0,0)",
                    outline: {
                        color: "rgba(0,0,0,.5)",
                        width: 1
                    }
                }
            });
            view.graphics.add(bufferGraphic);
        }

        let lineGraphic;
        function drawLine(point, point2) {
            view.graphics.remove(lineGraphic);
            lineGraphic = new Graphic({
                geometry: {
                    type: "polyline",
                    paths: [
                        [point.longitude, point.latitude],
                        [point2.longitude, point2.latitude]
                    ]
                },
                symbol: {
                    type: "simple-line",
                    color: "#333",
                    width: 1
                }
            });
            view.graphics.add(lineGraphic);
        }

        let textGraphic;
        function drawText(point, distance) {
            view.graphics.remove(textGraphic);
            textGraphic = new Graphic({
                geometry: point,
                symbol: {
                    type: "text",
                    text: distance.toFixed(2) + " miles",
                    color: "black",
                    font: {
                        size: 12
                    },
                    haloColor: "white",
                    haloSize: 1
                }
            })
            view.graphics.add(textGraphic)
        }

        view.on("pointer-move", function (event) {
            findNearestGraphic(event).then(function (graphic) {
                if (graphic) {
                    const buffer = geometryEngine.densify(
                        geometryEngine.geodesicBuffer(graphic.geometry, .25, "miles"),
                        250,
                        "meters"
                    );
                    drawBuffer(buffer);
                }
            });
            if (bufferGraphic) {
                const cursorPoint = view.toMap(event);
                const intersects = geometryEngine.intersects(bufferGraphic.geometry, cursorPoint);
                const symbol = bufferGraphic.symbol.clone();
                if (intersects) {
                    symbol.color = "rgba(0,0,0,.15)"; // Highlight
                } else {
                    symbol.color = "rgba(0,0,0,0)"; // Transparent
                }
                bufferGraphic.symbol = symbol;
                const vertexResult = geometryEngine.nearestVertex(bufferGraphic.geometry, cursorPoint);
                const closestPoint = vertexResult.coordinate;
                drawLine(cursorPoint, closestPoint)
                const distance = geometryEngine.geodesicLength(lineGraphic.geometry, "miles");
                drawText(cursorPoint, distance);
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
div {
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
}
</style>