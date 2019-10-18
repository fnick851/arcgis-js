import Vue from "vue"
import VueRouter from "vue-router"
import App from "./App"
import Home from "./Home"
import BaseMap from "./BaseMap"
import SimpleLayer from "./SimpleLayer"
import StyleLayer from "./StyleLayer"
import Popup from "./Popup"
import QueryLayer from "./QueryLayer"
import QueryLayerClient from "./QueryLayerClient"
import FilterLayer from "./FilterLayer"

Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        { path: "/", component: Home },
        { path: "/base", component: BaseMap },
        { path: "/layer", component: SimpleLayer },
        { path: "/style-layer", component: StyleLayer },
        { path: "/popup", component: Popup },
        { path: "/query-layer-server", component: QueryLayer },
        { path: "/query-layer-client", component: QueryLayerClient },
        { path: "/filter-layer", component: FilterLayer }
    ]
})

new Vue({
    el: "#app",
    router,
    render: h => h(App)
})
