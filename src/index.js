import Vue from "vue"
import VueRouter from "vue-router"
import App from "./App"
import Home from "./Home"
import BaseMap from "./BaseMap"
import SimpleLayer from "./SimpleLayer"
import StyleLayer from "./StyleLayer"
import QueryLayer from "./QueryLayer"
import QueryLayerClient from "./QueryLayerClient"
import Popup from "./Popup"

Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        { path: "/", component: Home },
        { path: "/base", component: BaseMap },
        { path: "/layer", component: SimpleLayer },
        { path: "/style-layer", component: StyleLayer },
        { path: "/query-layer-server", component: QueryLayer },
        { path: "/query-layer-client", component: QueryLayerClient },
        { path: "/popup", component: Popup }
    ]
})

new Vue({
    el: "#app",
    router,
    render: h => h(App)
})
