<template>
  <router-view />
</template>
<script>
import useFetch from "./composables/useFetch";
import { provide, onMounted, ref } from "vue";
import store from "./store";

export default {
  setup() {
    provide("store", store);
    
    const api =
      "https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json";

    const fetchAPI = () => {
      fetch(api)
        .then((res) => res.json())
        .then((result) => {
          store.state.api = result.features;
        });
    };

    onMounted(() => {      
      fetchAPI()
    });
  },
};
</script>

<style lang="scss"></style>
