<template>
  <div class="mypage">
    <!-- <q-scroll-area class="area"> -->
    <!-- <pre>{{
      store.state.api.filter((item) => {
        return (
          item.properties.county === store.state.selectedCity &&
          item.properties.town === store.state.selectedArea
        );
      })
    }}</pre> -->

    <!-- <pre>{{ store.methods.filteredData() }}</pre> -->

    <!-- <pre>{{ store.methods.getSelectedStores() }}</pre> -->

    <!-- <pre>{{ cities }}</pre> -->

    <!-- <pre
      >{{
        cities.filter((item) => {
          return (
            item.CityName === store.state.selectedCity &&
            item.AreaList.filter((area) => {
              return area.AreaName === store.state.selectedArea;
            })
          );
        })
      }}
    </pre> -->

    <!-- <pre>{{ store.state.api }}</pre> -->

    <!-- <pre>找到 {{ store.state.storeNo }} 家藥局</pre>
    <pre>{{ store.state.stores }}</pre> -->

    <!-- <pre
      >{{ store.state.selectedCity }}{{ store.state.selectedArea }} 共有 {{
        store.state.filteredStoreNo
      }} 家藥局</pre
    > -->

    <pre>{{ store.methods.getSelectedStores() }}</pre> 

    <!-- <div id="map" :style="{'left': store.state.drawer ? '150px' : '0px'}"></div> -->
    <!-- </q-scroll-area> -->
  </div>
</template>

<script>
import { onMounted, ref, computed, watch, watchEffect, inject } from "vue";
import cities from "src/assets/cityName.json";

export default {
  setup(props, context) {
    const store = inject("store");

    const lat = ref(0);
    const lng = ref(0);

    const map = ref(null);
    const zoom = ref(14);

    const updateMap = () => {

      // 標示區域內所有藥局位置
      store.methods.getSelectedStores().forEach((item) => {
        L.marker(new L.LatLng(item.lat, item.lng))
          .addTo(map.value)
          .bindPopup(item.name)
          .openPopup();
      });
    };

    const initMap = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          (lat.value = pos.coords.latitude), (lng.value = pos.coords.longitude);
          console.log(`經度: ${lat.value}, 緯度: ${lng.value}`);

          // 設置地圖中心點 (用戶位置)
          map.value = L.map(document.getElementById("map")).setView(
            [lat.value, lng.value],
            zoom.value
          );

          // 設置客製化圖標
          const myIcon = new L.Icon({
            iconUrl:
              "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
            shadowUrl:
              "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          });

          // 標示地圖中心點
          L.marker([lat.value, lng.value], { icon: myIcon })
            .addTo(map.value)
            .bindPopup("您的位置")
            .openPopup();

          // let markers = L.markerClusterGroup();

          // store.methods.filteredStores().map((item) => {
          //     return L.marker(new L.LatLng(item.lat, item.lng)).bindPopup(
          //       `<p>經度: ${item.lng}</p><p>緯度: ${item.lat}</p>`
          //     );
          //   })
          //   .forEach((item) => {
          //     return markers.addLayer(item);
          //   });

          // 標示區域內所有藥局位置
          store.methods.getSelectedStores().map((item) => {
            L.marker(new L.LatLng(item.lat, item.lng))
              .addTo(map.value)
              .bindPopup(
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
              )
              .openPopup();
          });

          // map.value.addLayer(markers);

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
              '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>         contributors',
          }).addTo(map.value);
        });
      }
    };

    watchEffect(() => {
      if (store.state.drawer) console.log("drawer is opened | watch effect");
      if (!store.state.drawer) console.log("drawer is closed | watch effect");

      console.log("zoom level: ", zoom.value);
      // updateMap();
    });

    onMounted(() => {
      // initMap();
    });

    return {
      store,
      cities,
    };
  },
};
</script>

<style lang="scss" scoped>
.area {
  height: calc(100% - 60px);
}
#map {
  position: fixed;
  top: 50px;
  // left: 300px;
  width: 100%;
  // width: calc(100% - 300px);
  height: 100vh;
}
</style>
