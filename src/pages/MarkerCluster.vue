<template>
  <div>
    <!-- <q-btn @click="toggleLocation" label="remove me" />
    <q-btn @click="removeStores" label="remove stores" /> -->
    <div id="map" :style="{ left: store.state.drawer ? '150px' : '0px' }"></div>
  </div>
</template>

<script>
import { onMounted, ref, inject, watchEffect } from "vue";

export default {
  setup() {
    const store = inject("store");

    // map related
    const map = ref(null);
    const me = ref(null);
    const group = ref(null);
    const stores = ref(null);
    const icon = ref(null);

    // icon
    const red = ref(null);
    const green = ref(null);
    const grey = ref(null);

    const zoom = ref(8);
    const meShow = ref(true);
    const storeShow = ref(true);

    // 台北市復興南路二段148巷10號
    const lat = ref(25.028528);
    const lng = ref(121.542954);

    const toggleLocation = () => {
      meShow.value = !meShow.value;

      if (meShow.value) map.value.addLayer(me.value);
      if (!meShow.value) map.value.removeLayer(me.value);
    };

    const removeStores = () => {
      storeShow.value = !storeShow.value;

      if (storeShow.value) map.value.addLayer(group.value);
      if (!storeShow.value) map.value.removeLayer(group.value);
    };

    const initMap = () => {
      // 增加地圖
      // 第一種 L.map('mapid', { center: [lat, lng], zoom })
      // 第二種 L.map('mapid').setView([lat, lng], zoom )

      map.value = L.map(document.getElementById("map")).setView(
        [lat.value, lng.value],
        zoom.value
      );

      // 紅色圖標
      red.value = new L.Icon({
        iconUrl: "/marker/marker-icon-2x-red.png",
        shadowUrl: "/marker/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      // 綠色圖標
      green.value = new L.Icon({
        iconUrl: "/marker/marker-icon-2x-green.png",
        shadowUrl: "/marker/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      // 灰色圖標
      grey.value = new L.Icon({
        iconUrl: "/marker/marker-icon-2x-grey.png",
        shadowUrl: "marker/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      // 增加用戶位置
      me.value = L.marker(
        [lat.value, lng.value],
        // new L.LatLng(lat.value, lng.value), 
        { icon: red }
      )
        .bindPopup("您的位置")
        // .openPopup();

      // 把圖標加入地圖
      map.value.addLayer(me.value);

      /* 載入 OpenStreetMap 圖資 */
      const osm = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>         contributors',
          maxZoom: 18,
        }
      );
      // 把圖資加入地圖
      map.value.addLayer(osm);

      // 增加一個群組
      group.value = L.markerClusterGroup();

      getAPI();
      // getStores();

      // 把群組加入地圖
      map.value.addLayer(group.value);
    };

    const getAPI = () => {
      let icon = null;
      store.state.api
        .map((item) => {
          if (
            item.properties.mask_adult <= 200 ||
            item.properties.mask_child <= 200
          ) {
            icon = grey.value;
          } else {
            icon = green.value;
          }
          return (
            // 把圖標加入群組
            // return group.value.addLayer(
            (stores.value = L.marker(
              new L.LatLng(
                item.geometry.coordinates[1],
                item.geometry.coordinates[0]
              ),
              { icon }
            ).bindPopup(
              `                 
                <q-card-section>
                  <div class="text-h6 text-cyan-8">
                    ${item.properties.name}
                  </div>
                  <div class="text-subtitle2 text-primary">
                    ${item.properties.address} (${item.properties.cunli})
                  </div>
                  <div class="text-subtitle2 text-primary q-mt-sm">
                    ${item.properties.phone}
                  </div>
                </q-card-section>

                <div class="q-mt-md flex justify-around q-py-sm rounded-borders">
                  <span class="text-cyan-8 text-h6">成人 ${item.properties.mask_adult}</span>
                  <span class="text-cyan-8 text-h6">兒童 ${item.properties.mask_child}</span>
                </div>
                
              `
            ))
          );
        })
        .forEach((item) => {
          return group.value.addLayer(item);
        });
    };

    const getStores = () => {
      let icon = null;
      store.state.stores
        .map((item) => {
          if (item.maskAdult <= 200 || item.maskChild <= 200) {
            icon = grey.value;
          } else {
            icon = green.value;
          }
          return (
            // 把圖標加入群組
            // return group.value.addLayer(
            (stores.value = L.marker(new L.LatLng(item.lat, item.lng), {
              icon,
            }).bindPopup(
              `                 
                <q-card-section>
                  <div class="text-h6 text-cyan-8">
                    ${item.name}
                  </div>
                  <div class="text-subtitle2 text-primary">
                    ${item.address} (${item.cunli})
                  </div>
                  <div class="text-subtitle2 text-primary q-mt-sm">
                    ${item.phone}
                  </div>
                </q-card-section>

                <div class="q-mt-md flex justify-around q-py-sm rounded-borders">
                  <span class="text-cyan-8 text-h6">成人 ${item.maskAdult}</span>
                  <span class="text-cyan-8 text-h6">兒童 ${item.maskChild}</span>
                </div>
                
              `
            ))
          );
        })
        // 把圖標加入群組
        .forEach((item) => {
          return group.value.addLayer(item);
        });
    };

    watchEffect(() => {
      console.log(`
        <- page ->
        store: ${store.state.name},
        lat: ${store.state.lat},
        lng: ${store.state.lng}
      `);

      // map.value.panTo([store.state.lat, store.state.lng])
    });

    onMounted(() => {
      store.methods.getStores();
      initMap();
    });

    return {
      store,

      toggleLocation,
      removeStores,
    };
  },
};
</script>

<style lang="scss" scoped>
#map {
  position: fixed;
  top: 50px;
  width: 100%;
  height: 100vh;
}
</style>
