import { reactive } from "vue";

const state = reactive({
  api: [],
  pharmacies: null,

  drawer: false,

  storeNo: 0,
  stores: [],

  lat: 0,
  lng: 0,

  filteredStoreNo: 0,

  selectedCity: "臺北市",
  selectedArea: "大安區",

  pharmacy: {}
});

const methods = {
  fetchAPI() {
    const api =
      "https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json";

    fetch(api)
      .then((res) => res.json())
      .then((result) => {
        state.api = result.features;
      });
  },
  filteredData() {
    let id = 0;
    return state.api.filter((item, index) => {
      return (
        item.properties.county === state.selectedCity &&
        item.properties.town === state.selectedArea
      );
    });
  },
  getStores() {
    let id = 0;
    state.api.forEach((store) => {
      state.stores.push({
        id: id++,
        name: store.properties.name,
        phone: store.properties.phone,
        address: store.properties.address,
        cunli: store.properties.cunli,
        maskAdult: store.properties.mask_adult,
        maskChild: store.properties.mask_child,
        lng: store.geometry.coordinates[0],
        lat: store.geometry.coordinates[1],
      });
    });
    state.storeNo = id;
  },
  getSelectedStores() {
    let id = 0;
    let temp = [];

    state.api.forEach((item) => {
      if (
        item.properties.county === state.selectedCity &&
        item.properties.town === state.selectedArea
      ) {
        temp.push({
          id: id++,
          name: item.properties.name,
          phone: item.properties.phone,
          address: item.properties.address,
          cunli: item.properties.cunli,
          maskAdult: item.properties.mask_adult,
          maskChild: item.properties.mask_child,
          lng: item.geometry.coordinates[0],
          lat: item.geometry.coordinates[1],
        });
      }
    });
    state.filteredStoreNo = id;
    return temp;
  },
};

const getters = {
  filteredStores() {
    return state.api.filter((item) => {
      return (
        item.properties.county === state.selectedCity &&
        item.properties.town === state.selectedArea
      );
    });
  },
};

export default {
  state,
  methods,
  getters,
};
