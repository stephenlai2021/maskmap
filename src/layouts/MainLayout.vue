<template>
  <!-- <q-layout view="hHh lpR fFf"> -->
  <q-layout view="lHh lpr lff">
    <q-header elevated class="">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          <img src="/mask.png" alt="" style="width: 40px; height: 40px; margin-top: 5px">
        </q-toolbar-title>

        <q-btn
          flat
          dense
          round
          icon="person"
          side="left"
          @click="toggleRightDrawer"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      style="overflow: hidden"
      v-model="store.state.rightDrawer"
      side="right"
      :breakpoint="400"
      bordered
    >
      <q-img
        class="absolute-top"
        src="https://cdn.quasar.dev/img/material.png"
        style="height: 150px"
      >
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img
              src="/me.png"
            />
          </q-avatar>
          <div class="text-weight-bold">stephenlai2015</div>
          <div class="">@gmail.com</div>
        </div>
      </q-img>
    </q-drawer>

    <q-drawer
      style="overflow: hidden"
      v-model="store.state.leftDrawer"
      :breakpoint="400"
    >
      <q-img
        class="absolute-top"
        src="https://cdn.quasar.dev/img/material.png"
        style="height: 125px"
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
          <select
            v-model="store.state.selectedArea"
            class="bg-teal-2"
            @change="updateMap"
          >
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

        <!-- <q-input
          class="search bg-teal-2"
          outlined
          borderless
          placeholder="請輸入藥局名稱"
          v-model="search"
        >
          <template v-slot:append>
            <span class="material-icons search-icon">search</span>
          </template>
        </q-input> -->
        <div
          class="q-field__control relative-position row no-wrap search"
          tabindex="-1"
        >
          <div
            class="
              q-field__control-container
              col
              relative-position
              row
              no-wrap
              q-anchor--skip
              bg-teal-2
            "
          >
            <input
              class="q-field__native q-placeholder bg-teal-2 search-box"
              tabindex="0"
              placeholder="請輸入藥局名稱"
              id="f_09bbdf2b-41ae-4220-99a8-f326e23de05d"
              type="text"
              ref="searchBox"
            />
          </div>
          <div
            class="q-field__append q-field__marginal row bg-teal-2 no-wrap items-center"
          >
            <span @click="getFocus" class="material-icons search-icon bg-teal-2" data-v-18ca20c2=""
              >search</span
            >
          </div>
        </div>
      </div>

      <q-scroll-area class="area">
        <div v-if="filteredStores.length">
          <div class="text-h5 text-center">
            找到 {{ filteredStores.length }} 家藥局
          </div>
          <q-card
            class="my-card text-white"
            v-for="(item, idx) in filteredStores"
            :key="idx"
          >
            <q-card-section>
              <div
                class="text-h6 text-cyan-8 store-name"
                @click="getStore(item)"
              >
                {{ item.properties.name }}
              </div>
              <div class="text-subtitle2 text-primary">
                {{ item.properties.address }} ({{ item.properties.cunli }})
              </div>
              <div class="text-subtitle2 text-primary q-mt-sm">
                {{ item.properties.phone }}
              </div>
            </q-card-section>

            <q-card-actions class="btn-group">
              <span
                class="mask-amount q-py-xs rounded-borders"
                :style="{
                  background:
                    item.properties.mask_adult === 0 ? 'grey' : '#0097a7',
                }"
                >成人 {{ item.properties.mask_adult }}</span
              >
              <span
                class="mask-amount q-py-xs rounded-borders"
                :style="{
                  background:
                    item.properties.mask_child === 0 ? 'grey' : '#0097a7',
                }"
                >兒童 {{ item.properties.mask_child }}</span
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
    const search = ref("");

    const searchBox = ref(null)

    const getStore = (item) => {
      store.state.lat = item.geometry.coordinates[1];
      store.state.lng = item.geometry.coordinates[0];

      store.state.leftDrawer = false;

      store.state.pharmacy = item;

      console.log("您選擇了: ", item.properties.name);
      console.log("緯度: ", store.state.lat);
      console.log("經度", store.state.lng);
    };

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
    });

    const toggleLeftDrawer = () => {
      store.state.leftDrawer = !store.state.leftDrawer;
    };

    const toggleRightDrawer = () => {
      store.state.rightDrawer = !store.state.rightDrawer;
    };

    const getFocus = () => {
      // document.getElementsByClassName('search-box').focus()
      // searchBox.value.focus()
    }

    onMounted(() => {
      // getUserLocation()
    });

    return {
      store,
      router,

      drawer,
      cities,
      data,
      search,

      filteredArea,
      filteredStores,

      setSelectedArea,
      toggleLeftDrawer,
      toggleRightDrawer,
      getStore,
      getFocus,
    };
  },
};
</script>

<style lang="scss" scoped>
.area {
  height: calc(100vh - 125px);
  // border: 1px solid red;
  margin-top: 15px;
  padding-top: 1rem;
  border-right: 1px solid #ddd;
  display: flex;
  justify-content: center;
}
.search {
  position: relative;
  margin: 0 5%;
  font-size: 15px;
  border-radius: 4px;
  border: none;
  // appearance: none;

  // height: 45px;
}
.city-select,
.area-select {
  width: 40%;
  display: inline-block;
  margin: 1rem 5%;
  position: relative;

  .icon-arrow {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 9px;
    right: 12px;
    color: rgba(0, 0, 0, 0.6);
  }

  select {
    appearance: none;
    background: rgba(0, 0, 0, 0.05);
    border: none;
    padding: 8px 12px;
    font-size: 15px;
    color: rgba(0, 0, 0, 0.6);
    // height: 46px;
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
.search-icon {
  // border: 1px solid red;
  position: absolute;
  right: 10px;
}
.about {
  width: 35px;
  height: 35px;
  opacity: 0.7;
  cursor: pointer;
}
.q-field__control-container {
  padding-left: 12px;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}
.q-field__append {
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}
.q-field__control,
.q-field__append,
.q-field__native {
  // border: 1px solid red;
  height: 38px;
}
.q-header {
  background: #212121;
}
</style>
