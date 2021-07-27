<template>
  <q-page>
    <q-btn @click="login">Login</q-btn>
    <q-btn @click="logout">Logout</q-btn>
    <div id="map"></div>
  </q-page>
</template>

<script>
import { onMounted, ref } from "vue";
import { fireDB } from "src/boot/firebase";
import firebase from "firebase/app";

export default {
  setup() {
    const lat = ref(null);
    const lng = ref(null);
    const map = ref(null);
    const marker = ref(null);
    const markers = ref([]);
    const ninjas = ref([])

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
          // geolocation: {
          //   lat: 0,
          //   lng: 0,
          // },
          online: false,
        });
        // .update({
        //   geolocation: firebase.firestore.FieldValue.delete(),
        //   online: firebase.firestore.FieldValue.delete(),
        // });
    };

    onMounted(() => {
      getAllNinjasGeolocation();
    });

    const initMap = () => {
      const container = L.DomUtil.get("map");
      if (container != null) {
        container._leaflet_id = null;
      }

      map.value = L.map("map", {
        center: [lat.value, lng.value],
        zoom: 3,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>         contributors',
      }).addTo(map.value);
    };

    const getAllNinjasGeolocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          lat.value = pos.coords.latitude;
          lng.value = pos.coords.longitude;

          initMap();

          fireDB
            .collection("ninjas")
            // .where("online", "==", true)
            .onSnapshot((snap) => {
              console.log("snap: ", snap);

              snap.docs.forEach(doc => {
                ninjas.value.push({ ...doc.data() })
              })

              // snap.docs.map((doc) => {
              ninjas.value.forEach(ninja => {
                if (ninja.online) {
                  // console.log(`${ninja.alias} is online`)

                  marker.value = L.marker([
                    ninja.geolocation.lat,
                    ninja.geolocation.lng,
                  ])
                    .addTo(map.value)
                    .bindPopup(ninja.alias)
                    .openPopup();
                } else {
                  // console.log(`${ninja.alias} is offline`)
                }
              });
            });
        });
      } else {
        console.log("Your browser does not support geolocation !");
      }
    };

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
