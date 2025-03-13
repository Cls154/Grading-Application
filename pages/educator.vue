<template>
  <main class="flex bg-zinc-900 h-screen">
    <!-- Sidebar -->
    <section class="bg-black w-[516px] p-12 relative flex flex-col">
      <h3 class="text-white font-bold text-lg">My Modules</h3>

      <div v-for="mod in moduleGroups">
        <div class="mt-5 p-2 rounded-lg" 
          :class="{
            'bg-[#A1842C]': mod.moduleId === selectedModule.moduleId,
            'hover:bg-[#A1842C]/50': mod.moduleId !== selectedModule.moduleId,
          }"
          @click="setModule(mod)"
        >
          <h3 class="text-[#F4F4F5] text-sm font-bold truncate p-2">{{ mod.moduleName }}</h3>
        </div>
      </div>

      <button @click="logout" class="text-zinc-400 hover:text-white text-sm font-bold absolute bottom-0 right-0 px-8 py-4 cursor-pointer">Logout</button>
    </section>
    <!-- /Sidebar -->

    <!-- MainPage -->
    <section class="w-full p-12 space-y-12 overflow-scroll">

      <div v-for="group in selectedGroups">
        <EduFormResults :group="group"/>
      </div>

    </section>
    <!-- /MainPage -->

  </main>
</template>

<script setup>

  const selectedModule = ref({});
  const selectedGroups = ref({});
  const formData = ref([]);

  function setModule(module) {
    selectedModule.value = module;
    selectedGroups.value = moduleGroups.value.find(mod => mod.moduleName === selectedModule.value.moduleName).moduleGroups;
  }

  function logout() {
    const jwtCookie = useCookie('userJWT');
    jwtCookie.value = null;
    navigateTo('/login');
  }


  definePageMeta({
    middleware: 'auth',
  })

  const moduleGroups = computed(() => {
    return formData.value
      .map(form => ({
        moduleId: form.module.id,
        moduleName: form.module.name,
        moduleGroups: form.module.groups,
      }))
  })
  
    

  onMounted(async () => {
    try {
      const response = await $fetch('/api/studentforms');
      formData.value = response.data;
      if (moduleGroups.value.length > 0)
        setModule(moduleGroups.value[0]);

    } catch (error) {
      console.log(error);
    }
  })
</script>