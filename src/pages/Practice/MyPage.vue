<template>
  <div class="mypage">
    <!-- watch & watchEffect Demo -->
    <!-- <input type="text" v-model="search">
    <button @click="handleClick">stop watching</button>
    <p>search term - {{ search }}</p>
    <div v-for="name in matchingNames" :key="name">{{ name }}</div> -->

    <!-- Using props in setup function -->

    <!-- <pre>{{ store.state.apiData }}</pre> -->
    <pre>{{ store.state.stores }}</pre>

  </div>
</template>

<script>
import { ref, computed, watch, watchEffect, inject } from 'vue'

export default {
  setup (props, context) {
    const store = inject('store')

    const search = ref('')
    const names = ref(['mario', 'yoshi', 'luigi', 'toad', 'browser', 'koopa', 'peach'])

    const posts = ref([
      { title: 'welcome to the blog', body: 'Lorem ipsum', id: 1 },
      { title: 'top 5 CSS tips', body: 'Lorem ipsum', id: 2 },
    ])

    const matchingNames = computed(() => {
      return names.value.filter(name => name.includes(search.value))
    })

    const handleClick = () => {
      stopWatch()
      stopEffect()
    }

    const stopWatch = watch(search, () => {
      console.log('watch function ran', search.value)
    })

    const stopEffect = watchEffect(() => {
      console.log('watch effect function ran', search.value)
    })

    return {
      store,

      // watch & watchEffect Demo
      search,
      matchingNames,
      handleClick,

      // using props in setup function
      posts
    }
  }
}
</script>

<style lang="scss" scoped>

</style>