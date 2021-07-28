<template>
  <div>
    <q-icon
      name="img:/icons/gps.png"
      class="location"
      @click="getUserLocation"
    />
    <div id="map" :style="{ left: store.state.drawer ? '150px' : '0px' }"></div>
  </div>
</template>

<script>
import { ref, watch, inject, onMounted, onUpdated } from "vue";

export default {
  props: ["item"],
  setup(props) {
    const store = inject("store");

    console.log("passed data: ", props.item);

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
    const zoom = ref(7);
    const zoomControl = ref(null);

    /* 台北市復興南路二段148巷10號 */
    // const lat = ref(25.028528);
    // const lng = ref(121.542954);
    const lat = ref(0);
    const lng = ref(0);

    const getUserLocation = () => {
      console.log("user location: ", lat.value, lng.value);

      map.value.setZoom(12);
      map.value.flyTo([lat.value, lng.value]);
    };

    const Goto = () => {
      map.value.setZoom(18);
      // map.value.panTo([store.state.pharmacy.lat, store.state.pharmacy.lng]);
      map.value.panTo([
        store.state.pharmacy.geometry.coordinates[1],
        store.state.pharmacy.geometry.coordinates[0],
      ]);

      pharmacy.value = L.marker([
        store.state.pharmacy.geometry.coordinates[1],
        store.statepharmacy.geometry.coordinates[0],
      ])
        .addTo(map.value)
        .bindPopup(
          `
            <q-card-section>
              <div class="text-h6 text-cyan-8">
                ${store.state.pharmacy.properties.name}
              </div>
              <div class="text-primary">
                ${store.state.pharmacy.properties.address} (${store.state.pharmacy.properties.cunli})
              </div>
              <div class="text-primary q-mt-sm">
                ${store.state.pharmacy.properties.phone}
              </div>
            </q-card-section>

            <div class="q-mt-md flex justify-around q-py-sm rounded-borders">
              <span class="text-cyan-8 text-h6">成人 ${store.state.pharmacy.properties.mask_adult}</span>
              <span class="text-cyan-8 text-h6">兒童 ${store.state.pharmacy.properties.mask_child}</span>
            </div>

          `
        )
        .openPopup();
    };

    const setControl = () => {
      zoomControl.value = L.control
        .zoom({
          position: "topright",
        })
        .addTo(map.value);
    };

    const initMap = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          lat.value = pos.coords.latitude;
          lng.value = pos.coords.longitude;

          map.value = L.map("map", {
            center: [lat.value, lng.value],
            zoom: zoom.value,
            maxZoom: 18,
            zoomControl: false,
          });

          setControl();
          setIcon();

          me.value = L.marker([lat.value, lng.value], { icon: red.value })
            .addTo(map.value)
            .bindPopup("您的位置")
            .openPopup();

          addStores();

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
              '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>         contributors',
            maxZoom: 18,
          }).addTo(map.value);
        });
      }
    };

    // 增加圖層 (我們可以過濾出想要的藥局, 包塊全省藥局, 城市藥局或區域藥局)
    const addStores = () => {
      group.value = L.markerClusterGroup();

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
          // return (stores.value = group.value.addLayer(L.marker(
          return group.value.addLayer(
            (stores.value = L.marker(
              // return L.marker(
              [item.geometry.coordinates[1], item.geometry.coordinates[0]],
              { icon: icon.value }
            )
              // .addTo(map.value)
              .openPopup()
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
              ))
          );
        }
      });
      map.value.addLayer(group.value);
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
      // removeAllMarkers();
      map.value.removeLayer(group.value);
      map.value.addLayer(me.value);
      addStores();
    };

    // watch(() => store.state.selectedArea, (newVal, oldVal) => {
    watch(
      () => [store.state.selectedCity, store.state.selectedArea],
      ([newA, newB], [oldA, oldB]) => {
        console.log(`您選擇了: ${newA}${newB}`);

        updateMap();
      }
    );

    watch(
      () => [store.state.lat, store.state.lng],
      ([newA, newB], [oldA, oldB]) => {
        console.log("新座標: ", newA, newB);

        updateMap();

        map.value.setZoom(18);
        map.value.flyTo([store.state.lat, store.state.lng]);
      }
    );

    onMounted(() => {
      initMap();
    });

    onUpdated(() => {});

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
  top: 50px;
  width: 100%;
  height: 100vh;
}
.location {
  // border: 1px solid red;
  width: 30px;
  height: 30px;
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 200;
  cursor: pointer;
}
</style>
