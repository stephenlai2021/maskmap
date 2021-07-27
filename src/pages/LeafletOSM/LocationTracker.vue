<template>
  <q-page>
    <q-btn @click="login">Login</q-btn>
    <q-btn @click="logout">Logout</q-btn>
    <div id="map"></div>
  </q-page>
</template>

<script>
import { onMounted, ref, inject } from "vue";
import { fireDB } from "src/boot/firebase";
import firebase from "firebase/app";

export default {
  setup() {
    // geometry
    const lat = ref(null);
    const lng = ref(null);

    // map & layer
    const map = ref(null);
    const marker = ref(null);

    const login = () => {
      fireDB
        .collection("ninjas")
        .doc("cat-the-ninja")
        .update({
          geolocation: {
            lat: 25.0290193,
            lng: 121.5413707,
          },
          online: true,
        });
    };

    const logout = () => {
      fireDB
        .collection("ninjas")
        .doc("cat-the-ninja")
        .update({
          online: false,
        });
        // 刪除欄位: geolocation, online 
        // .update({
        //   geolocation: firebase.firestore.FieldValue.delete(),
        //   online: firebase.firestore.FieldValue.delete(),
        // });
    };

    const initMap = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          lat.value = pos.coords.latitude;
          lng.value = pos.coords.longitude;

          map.value = L.map("map", {
            center: [lat.value, lng.value],
            zoom: 3,
          });

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
              '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>         contributors',
          }).addTo(map.value);

          fireDB
            .collection("ninjas")
            .where("online", "==", true)
            .onSnapshot((snap) => {
              console.log("snap | init: ", snap);

              removeAllMarkers();

              snap.docs.map((doc) => {
                marker.value = L.marker([
                  doc.data().geolocation.lat,
                  doc.data().geolocation.lng,
                ])
                  .addTo(map.value)
                  .bindPopup(doc.data().alias)
                  // .openPopup();
              });
            });
        });
      } else {
        console.log("Your browser does not support geolocation !");
      }
    };

    const removeAllMarkers = () => {
      map.value.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.value.removeLayer(layer);
        }
      });
    };    

    onMounted(() => {
      initMap();
    });

    return {
      login,
      logout,
    };
  },
};
</script>

<style lang="scss" scoped>
#map {
  position: fixed;
  top: 86px;
  width: 100%;
  height: 100vh;
}
</style>
