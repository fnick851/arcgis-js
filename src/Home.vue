<template>
    <div>
        <ul>
            <li>
                <router-link to="/base">Basemap with toggles</router-link>
            </li>
            <li>
                <router-link to="/layer">Simple feature layer</router-link>
            </li>
            <li>
                <router-link to="/style-layer">Style feature layer</router-link>
            </li>
            <li>
                <router-link to="/popup">Popup</router-link>
            </li>
            <li>
                <router-link to="/query-layer-server">Query feature layer on server</router-link>
            </li>
            <li>
                <router-link to="/query-layer-client">Query feature layer on client</router-link>
            </li>
            <li>
                <router-link to="/filter-layer">Filter feature layer</router-link>
            </li>
            <li>
                <router-link to="/filter-layer2">Filter map feature</router-link>
            </li>
            <li>
                <router-link to="/arcade">Arcade expression</router-link>
            </li>
            <li>
                <router-link to="/portal-item">Portal item</router-link>
            </li>
            <li>
                <router-link to="/styled-vector">Styled vector base map</router-link>
            </li>
            <li>
                <router-link to="/web-map">Web map</router-link>
            </li>
            <li>
                <router-link to="/three-d">Add layers to 3D scene</router-link>
            </li>
            <li>
                <router-link to="/web-scene">Web scene</router-link>
            </li>
            <li>
                <router-link to="/map-coords">Show map coordinates</router-link>
            </li>
        </ul>
    </div>
</template>

export default {
    name: 'Home'
}
</script>