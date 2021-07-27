<template>
  <q-page>
    <pre>{{ store.methods.getSelectedStores() }}</pre>

    <div id="map"></div>
  </q-page>
</template>

<script>
import { inject, onMounted, ref, watchEffect } from "vue";
import cityInfo from "src/assets/cityName.json";

export default {
  setup() {
    const store = inject("store");

    const lat = ref(null);
    const lng = ref(null);
    const map = ref(null);
    const marker = ref(null);

    const initMap = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          lat.value = pos.coords.latitude;
          lng.value = pos.coords.longitude;

          const container = L.DomUtil.get("map");
          if (container != null) {
            container._leaflet_id = null;
          }

          map.value = L.map("map", {
            center: [lat.value, lng.value],
            zoom: 5,
          });

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
              '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>         contributors',
          }).addTo(map.value);

          // store.state.pharmacies.forEach((store) => {
          marker.value = L.marker([
            lat.value,
            lng.value,
            // store.lat, store.lng
          ])
            .addTo(map.value)
            .bindPopup("您的位置")
            .openPopup();
          // });
        });
      }
    };

    const removeAllMarkers = () => {
      map.value.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.value.removeLayer(layer);
        }
      });
    };

    const updateMap = () => {
      // map.value.eachLayer(layer => {
      //   if (layer instanceof L.marker) {
      //     map.value.removeLayer(layer)
      //   }
      // })
      // removeAllMarkers()

      store.methods.getSelectedStores().forEach((store) => {
        marker.value = L.marker([store.lat, store.lng])
          .addTo(map.value)
          .bindPopup(store.name)
          .openPopup();
      });
    };

    watchEffect(() => {
      updateMap();
    });

    onMounted(() => {
      console.log("藥局資料: ", store.methods.getSelectedStores());
      initMap();
    });

    return {
      store,
      cityInfo,
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
