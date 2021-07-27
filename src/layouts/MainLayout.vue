<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-cyan-8">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleDrawer"
        />

        <q-toolbar-title @click="router.push('/mypage')"
          >口罩地圖</q-toolbar-title
        >
      </q-toolbar>
    </q-header>

    <q-drawer
      style="overflow: hidden"
      v-model="store.state.drawer"
      show-if-above
      :breakpoint="400"
    >
      <q-img
        class="absolute-top"
        src="https://cdn.quasar.dev/img/material.png"
        style="height: 160px"
      ></q-img>

      <div class="user-select">
        <div class="city-select">
          <select
            v-model="store.state.selectedCity"
            class="bg-teal-2"
            @change="setSelectedArea"
          >
            <option
              v-for="(city, idx) in cities"
              :value="city.CityName"
              :key="idx"
            >
              {{ city.CityName }}
            </option>
          </select>
          <svg
            class="icon-arrow"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>

        <div class="area-select">
          <select v-model="store.state.selectedArea" class="bg-teal-2" @change="updateMap">
            <option
              v-for="(area, idx) in filteredArea"
              :value="area.AreaName"
              :key="idx"
            >
              {{ area.AreaName }}
            </option>
          </select>
          <svg
            class="icon-arrow"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
      </div>
      <q-scroll-area class="area">
        <!-- <div v-if="store.state.filteredStoreNo"> -->
        <div v-if="store.methods.getSelectedStores()">
          <div class="text-h5 text-center">
            找到 {{ store.state.filteredStoreNo }} 家藥局
          </div>

          <q-card
            class="my-card text-white"
            v-for="(store, idx) in store.methods.getSelectedStores()"
            :key="idx"
          >
            <q-card-section>
              <div class="text-h6 text-cyan-8 store-name" @click="getStore(store)">
                {{ store.name }}
              </div>
              <div class="text-subtitle2 text-primary">
                {{ store.address }} ({{ store.cunli }})
              </div>
              <div class="text-subtitle2 text-primary q-mt-sm">
                {{ store.phone }}
              </div>
            </q-card-section>

            <q-card-actions class="btn-group">
              <span
                class="mask-amount q-py-xs rounded-borders"
                :style="{
                  background: store.maskAdult === 0 ? 'grey' : '#0097a7',
                }"
                >成人 {{ store.maskAdult }}</span
              >
              <span
                class="mask-amount q-py-xs rounded-borders"
                :style="{
                  background: store.maskChild === 0 ? 'grey' : '#0097a7',
                }"
                >兒童 {{ store.maskChild }}</span
              >
            </q-card-actions>
          </q-card>
        </div>
        <div v-else class="text-h5 text-center">這個區域現在沒有資料</div>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, onMounted, inject, computed, watch, watchEffect } from "vue";
import cities from "src/assets/cityName.json";
import { useRouter } from "vue-router";

export default {
  setup() {
    const store = inject("store");

    const router = useRouter();

    const drawer = ref(false);
    const data = ref([]);

    const getStore = (item) => {
      // store.state.name = item.name
      // store.state.lat = item.lat
      // store.state.lng = item.lng
      store.state.pharmacy = item
      console.log('pharmcy | store: ', store.state.pharmacy)

      store.state.drawer = false
      console.log('drawer state: ', store.state.drawer)
    }

    const setSelectedArea = () => {
      store.state.selectedArea = filteredArea.value[0].AreaName;
    };

    const filteredStores = computed(() => {
      return store.state.api.filter((item) => {
        return (
          item.properties.county === store.state.selectedCity &&
          item.properties.town === store.state.selectedArea
        );
      });
    });

    const filteredArea = computed(() => {
      let area = [];
      cities.forEach((city) => {
        if (city.CityName === store.state.selectedCity) {
          area = city.AreaList;
        }
      });

      return area;

      // return cities.filter(item => {
      //   return item.CityName === store.state.selectedCity && item.AreaList.filter(area => {
      //     return area.AreaName === store.state.setSelectedArea
      //   })
      // })
    });

    const toggleDrawer = () => {
      store.state.drawer = !store.state.drawer;
    };

    const updateMap = () => {
      // console.log('map updated')
      console.log(
        `layout: ${store.state.selectedCity}${store.state.selectedArea}, 共有${store.state.filteredStoreNo}家藥局`
      );
    }

    onMounted(() => {
      console.log('filtered area: ', filteredArea)
    });

    return {
      store,
      router,

      drawer,
      cities,
      data,

      filteredArea,
      filteredStores,

      setSelectedArea,
      toggleDrawer,
      getStore,
      updateMap,
    };
  },
};
</script>

<style lang="scss" scoped>
.area {
  height: calc(100% - 60px);
  // border: 1px solid green;
  padding-top: 0;
  border-right: 1px solid #ddd;
  display: flex;
  justify-content: center;
  padding-top: 1rem;
}
.city-select,
.area-select {
  margin: 1rem 5%;
  position: relative;

  .icon-arrow {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 18px;
    right: 12px;
    color: rgba(0, 0, 0, 0.6);
  }

  select {
    appearance: none;
    background: rgba(0, 0, 0, 0.05);
    // background: white;
    border: none;
    padding: 12px;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.6);
    height: 56px;
    width: 100%;
    border-radius: 4px;

    &:focus {
      outline: none;
    }
  }
}
.store-name {
  cursor: pointer;
}
</style>
