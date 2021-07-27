<template>
  <div>
    <q-btn @click="Goto" label="Go" />
    <q-btn @click="getUserLocation" label="您的位置" />
    <div id="map" :style="{ left: store.state.drawer ? '150px' : '0px' }"></div>
  </div>
</template>

<script>
import { onMounted, ref, inject, watch, watchEffect, computed } from "vue";

export default {
  setup() {
    const store = inject("store");

    /* 初始化地圖和圖層 */
    const map = ref(null);
    const me = ref(null);
    const group = ref(null);
    const stores = ref(null);
    const pharmacy = ref(null);

    /* 初始畫圖標 */
    const red = ref(null);
    const green = ref(null);
    const grey = ref(null);
    const icon = ref(null);

    /* 其他變數 */
    const zoom = ref(11);

    /* 台北市復興南路二段148巷10號 */
    // const lat = ref(25.028528);
    // const lng = ref(121.542954);
    const lat = ref(0);
    const lng = ref(0);

    const getUserLocation = () => {
      navigator.geolocation.getCurrentPosition((pos) => {
        lat.value = pos.coords.latitude;
        lng.value = pos.coords.longitude;

        console.log("user location: ", lat.value, lng.value);
        map.value.setZoom(15);
        map.value.panTo([lat.value, lng.value]);
        L.marker([lat.value, lng.value], { icon: red.value })
          .addTo(map.value)
          .bindPopup("您在這裡")
          .openPopup();
      });
    };

    /* 方法 */
    const Goto = () => {
      console.log("get pharmcy in map: ", store.state.pharmacy);

      // removeAllMarkers();

      map.value.setZoom(18);
      map.value.panTo([store.state.pharmacy.lat, store.state.pharmacy.lng]);

      pharmacy.value = L.marker([
        store.state.pharmacy.lat,
        store.state.pharmacy.lng,
      ])
        .addTo(map.value)
        .bindPopup(
          `
            <q-card-section>
              <div class="text-h6 text-cyan-8">
                ${store.state.pharmacy.name}
              </div>
              <div class="text-primary">
                ${store.state.pharmacy.address} (${store.state.pharmacy.cunli})
              </div>
              <div class="text-primary q-mt-sm">
                ${store.state.pharmacy.phone}
              </div>
            </q-card-section>

            <div class="q-mt-md flex justify-around q-py-sm rounded-borders">
              <span class="text-cyan-8 text-h6">成人 ${store.state.pharmacy.maskAdult}</span>
              <span class="text-cyan-8 text-h6">兒童 ${store.state.pharmacy.maskChild}</span>
            </div>

          `
        )
        .openPopup();
    };

    const initMap = () => {
      navigator.geolocation.getCurrentPosition((pos) => {
        lat.value = pos.coords.latitude;
        lng.value = pos.coords.longitude;

        map.value = L.map("map", {
          center: [lat.value, lng.value],
          zoom: zoom.value,
          maxZoom: 18,
        });
      });

      setIcon();

      me.value = L.marker([lat.value, lng.value], { icon: red.value })
        .addTo(map.value)
        .bindPopup("您的位置")
        .openPopup();

      group.value = L.markerClusterGroup();
      addStores();
      map.value.addLayer(group.value);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>         contributors',
        maxZoom: 18,
      }).addTo(map.value);
    };

    // 增加圖層 (我們可以過濾出想要的藥局, 包塊全省藥局, 城市藥局或區域藥局)
    const addStores = () => {
      store.state.api.map((item) => {
        if (
          item.properties.mask_adult <= 200 ||
          item.properties.mask_child <= 200
        ) {
          icon.value = grey.value;
        } else {
          icon.value = green.value;
        }
        // 濾出區域藥局
        if (
          item.properties.county === store.state.selectedCity &&
          item.properties.town === store.state.selectedArea
        ) {
          // return (stores.value = (L.marker(
          return L.marker(
            [item.geometry.coordinates[1], item.geometry.coordinates[0]],
            { icon: icon.value }
          )
            .addTo(map.value)
            .bindPopup(
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
            );
        }
      });
      // .forEach((item) => group.value.addLayer(item));
    };

    const setIcon = () => {
      red.value = new L.Icon({
        iconUrl: "/marker/marker-icon-2x-red.png",
        shadowUrl: "/marker/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      green.value = new L.Icon({
        iconUrl: "/marker/marker-icon-2x-green.png",
        shadowUrl: "/marker/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      grey.value = new L.Icon({
        iconUrl: "/marker/marker-icon-2x-grey.png",
        shadowUrl: "marker/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
    };

    const removeAllMarkers = () => {
      map.value.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.value.removeLayer(layer);
        }
      });
    };

    const updateMap = () => {
      removeAllMarkers();
      addAreaStores();
    };

    watchEffect(() => {
      store.methods.getSelectedStores();
      console.log(
        `map: ${store.state.selectedCity}${store.state.selectedArea}, 共有${store.state.filteredStoreNo}家藥局`
      );

      // Goto()

      // updateMap()
      // removeAllMarkers();
      // map.value.removeLayer(areaStores.value)

      // console.log("map: ", map.value);

      console.log("watch pharmacy in map: ", store.state.pharmacy);
    });

    onMounted(() => {
      getUserLocation();
      initMap();
    });

    return {
      store,

      Goto,
      getUserLocation,
    };
  },
};
</script>

<style lang="scss" scoped>
#map {
  position: fixed;
  top: 100px;
  width: 100%;
  height: 100vh;
}
.leaflet-popup-content-wrapper {
  width: 250px;
}
</style>
