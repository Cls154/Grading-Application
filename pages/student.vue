<template>
  <h1>student page</h1>
</template>

<script setup>
  let modules;


  definePageMeta({
    middleware: 'auth',
  })

  onMounted(async () => {
    modules = await $fetch('/api/modules');
    console.log(modules);
  })
</script>