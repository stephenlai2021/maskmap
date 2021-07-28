import { reactive } from "vue";

const state = reactive({
  api: [],
  pharmacies: null,

  drawer: false,

  storeNo: 0,
  stores: [],

  lat: 0,
  lng: 0,

  selectedStores: [],
  filteredStoreNo: 0,

  selectedCity: "臺北市",
  selectedArea: "大安區",

  pharmacy: null
});

export default {
  state
};
