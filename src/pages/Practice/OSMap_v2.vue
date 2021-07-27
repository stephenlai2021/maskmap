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
    const markers = ref(null);

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

      // map.value = L.map(document.getElementById("map"), {
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

          fireDB
            .collection("ninjas")
            .where("online", "==", true)
            .onSnapshot((snap) => {
              console.log("snap: ", snap);

              initMap();

              snap.docs.map((doc) => {
                markers.value = L.marker([
                  doc.data().geolocation.lat,
                  doc.data().geolocation.lng,
                ])
                  .addTo(map.value)
                  .bindPopup(doc.data().alias)
                  .openPopup();
              });
            });

          fireDB.collection("ninjas").onSnapshot((snap) => {
            snap.docChanges().forEach((change) => {
              if (change.type === "modified") {
                updateMap();
              }
            });
          });
        });
      } else {
        console.log("Your browser does not support geolocation !");
      }
    };

    const updateMap = fireDB
      .collection("ninjas")
      .where("online", "==", false)
      .onSnapshot((snap) => {
        console.log("snap: ", snap);

        snap.docs.map((doc) => {
          markers.value = L.marker([
            doc.data().geolocation.lat,
            doc.data().geolocation.lng,
          ])
            .addTo(map.value)
            .bindPopup(doc.data().alias)
            .openPopup();
        });

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
