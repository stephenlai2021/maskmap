<template>
  <div>
    <p v-if="loading">loading...</p>
    <p v-if="error">there are errors occurred</p>
    <pre v-if="data">{{ data }}</pre>
    <!-- <pre v-if="store.state.api">{{ store.state.api }}</pre> -->

    <!-- <p>{{ filteredStores }}</p> -->

    <!-- <pre>
      {{
        data.filter((item) => {
          return (
            item.properties.county === store.state.selectedCity &&
            item.properties.town === store.state.selectedArea
          )
        })
      }}
    </pre> -->
  </div>
</template>

<script>
import useFetch from "../composables/useFetch";
import { computed, inject, onMounted } from "vue";

export default {
  setup() {
    const { data, error, loading } = useFetch(
      "https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json"
    );

    const store = inject("store");

    onMounted(() => {
      store.methods.fetchAPI()
      // console.log("api data: ", data);
      // console.log("selected city: ", store.state.selectedCity);
    });

    const filteredStores = computed(() => {
      // return data.filter(item => {
      //   return (
      //      item.properties.county === store.state.selectedCity && item.properties.town === store.state.selectedArea
      //   )
      // })
    });

    return {
      store,

      data,
      error,
      loading,

      filteredStores,
    };
  },
};
</script>

<style lang="scss" scoped></style>
