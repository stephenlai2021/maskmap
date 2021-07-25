import { ref, onMounted, watchEffect } from 'vue'

const useFetch = url => {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(null)

  const fetchData = async () => {
    loading.value = true;

    try {
      const res = await fetch(url);
      const json = await res.json();

      data.value = json.features;
      loading.value = false;
    } catch (error) {
      error.value = error;
      loading.value = false;
    }
  };

  watchEffect(() => {
  // onMounted(() => {
    fetchData()
  })

  return {
    data,
    error,
    loading
  }
}

export default useFetch