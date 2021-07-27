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

export default {
  setup() {
    const lat = ref(null);
    const lng = ref(null);
    const ninjas = ref(null);

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
      // .update({
      //   geolocation: firebase.firestore.FieldValue.delete(),
      //   online: firebase.firestore.FieldValue.delete(),
      // });
    };

    onMounted(() => {
      getAllNinjasGeolocation();
    });

    const getAllNinjasGeolocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          lat.value = pos.coords.latitude;
          lng.value = pos.coords.longitude;
          
          fireDB
            .collection("ninjas")
            .where("online", "==", true)
            .onSnapshot((snap) => {
              ninjas.value = snap.docs.map((doc) => {
                return { ...doc.data() };
              });
              console.log("ninjas location: ", ninjas.value);
              console.log("one time snap: ", snap);

              const map = new google.maps.Map(document.getElementById("map"), {
                zoom: 3,
                center: { lat: lat.value, lng: lng.value },
                mapTypeControl: false,
              });

              ninjas.value.forEach((ninja) => {
                const marker = new google.maps.Marker({
                  position: {
                    lat: ninja.geolocation.lat,
                    lng: ninja.geolocation.lng,
                  },
                  map,
                });

                const infowindow = new google.maps.InfoWindow({
                  content: ninja.alias,
                  maxWidth: 200,
                });

                marker.addListener("click", () => {
                  infowindow.open(map, marker);
                });
              });
            });

          fireDB.collection("ninjas").onSnapshot((snap) => {
            snap.docChanges().forEach((change) => {
              if (change.type === "added" || change.type === "modified") {
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
      .where("online", "==", true)
      .onSnapshot((snap) => {
        console.log("snap: ", snap);
        ninjas.value = snap.docs.map((doc) => {
          return { ...doc.data() };
        });
        console.log("ninjas location: ", ninjas.value);
        console.log("snap: ", snap);

        const map = new google.maps.Map(document.getElementById("map"), {
          zoom: 3,
          center: { lat: lat.value, lng: lng.value },
          mapTypeControl: false,
        });

        ninjas.value.forEach((ninja) => {
          const marker = new google.maps.Marker({
            position: {
              lat: ninja.geolocation.lat,
              lng: ninja.geolocation.lng,
            },
            map,
          });

          const infowindow = new google.maps.InfoWindow({
            content: ninja.alias,
            maxWidth: 200,
          });

          marker.addListener("click", () => {
            infowindow.open(map, marker);
          });
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
  width: 100%;
  height: 100vh;
}
</style>
