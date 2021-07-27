<template>
  <div>
    <div id="map"></div>
  </div>
</template>

<script>
import { onMounted, ref, inject, watchEffect } from "vue";
import pharmacies from "src/assets/pharmacies.json"

export default {
  setup() {
    const store = inject("store");

    // 初始化地圖和圖層
    const map = ref(null);
    const me = ref(null);
    const group = ref(null);
    const stores = ref(null);

    // 其他變數
    const zoom = ref(8);
    const meShow = ref(true);
    const storeShow = ref(true);

    // 台北市復興南路二段148巷10號
    const lat = ref(25.028528);
    const lng = ref(121.542954);

    const initMap = () => {
      // 增加地圖
      const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: lat.value, lng: lng.value },
        zoom: zoom.value,
      });

      // 增加圖層 (用戶)
      new google.maps.Marker({
        position: { lat: lat.value, lng: lng.value },
        map,
      });

      // 增加圖層 (藥局)
      pharmacies.forEach((item) => {
        new google.maps.Marker({
          position: { lat: item.geometry.coordinates[1], lng: item.geometry.coordinates[0] },
          map,
        });
      });
    };

    onMounted(() => {
      initMap();
    });

    return {
      store,
      stores,
    };
  },
};
</script>

<style lang="scss" scoped>
#map {
  width: 100%;
  height: 100vh;
}
</style>
