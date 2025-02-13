<template>
  <div class="flex bg-zinc-900 h-screen">
    <!-- Sidebar -->
    <div class="bg-black w-[516px] p-12 flex flex-col">
      <!-- SidebarTitle -->
      <h1 class="text-white font-bold text-lg mb-5">My Groups</h1>
      <!-- /SidebarTitle -->

      <!-- SidebarContent -->
      <p v-if="userGroups.length === 0" class="text-zinc-300 text-sm p-2 mt-3.5">
        You are not in a group. <br>
        Please assign yourself to the desired group
      </p>
      <div v-else v-for="group in userGroups">
        <div class="mt-5 p-2 rounded-lg cursor-pointer hover:bg-[#A1842C]/50">
          <h3 class="text-[#F4F4F5] text-sm font-bold truncate">{{ group.moduleName }}</h3>
          <div class="leading-none truncate text-[#C2C2C5]">
            <span class="text-[#F4F4F5] text-xs mr-4">Group {{ group.groups.id }}</span>
            <span class="text-[#C2C2C5] text-xs mr-4">{{ `${group.groups.userGroup.length}/${group.moduleGroupSize}` }} Members</span>
            <span class="text-[#C2C2C5] text-xs">Joined {{ new Date(group.groups.userGroup.find(g => g.userId === userId).updatedAt).toLocaleString('en-GB') }}</span>
          </div>
        </div>
      </div>
      <!-- /SidebarContent -->
    </div>
    <!-- /Sidebar -->

    <!-- MainPage -->
    <div class="w-full p-12 space-y-12 overflow-scroll">

      <!-- ModuleGroupAssignment -->
      <div v-for="mod in modulesData" :key="mod.id">
        <ModuleList :moduleName=mod.name :moduleGroups=mod.groups :groupCapacity=mod.groupSize />
      </div>
      <!-- /ModuleGroupAssignment -->


    </div>
    <!-- /MainPage -->

  </div>
</template>

<script setup>
  const modulesData = ref([]);
  const userId = ref(Number);


  definePageMeta({
    middleware: 'auth',
  })

  const userGroups = computed(() => {
    return modulesData.value
      .map(module => (
        {
          moduleName: module.name,
          moduleGroupSize: module.groupSize,
          groups: module.groups.find(group => group.isPartOf) || null
        }
      ))
      .filter(module => module.groups !== null);
  });
    

  onMounted(async () => {
    try {
      const response = await $fetch('/api/modules');
      modulesData.value = response.data;
      userId.value = response.user;


    } catch (error) {
      console.log(error);
    }
  })
</script>