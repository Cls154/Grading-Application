<template>
  <div class="flex bg-zinc-900 h-screen">
    <!-- Sidebar -->
    <div class="bg-black w-[516px] p-12 flex flex-col">
      <!-- SidebarTitle -->
      <div class="flex items-center justify-between mb-5">
        <h1 class="text-white font-bold text-lg">My Groups</h1>
        <button class="text-[#DA9914] text-xs font-bold space-x-2 cursor-pointer" :class="
          {
            'inline-flex items-center' : typeof selectedGroup.id === 'number',
            'hidden' : typeof selectedGroup.id !== 'number'
          }" @click="selectedGroup = {}">
          <LeftArrow class="w-4 h-4"/>
          <span>Back</span>
        </button>
      </div>
      <!-- /SidebarTitle -->

      <!-- SidebarContent -->
      <p v-if="userGroups.length === 0" class="text-zinc-300 text-sm p-2 mt-3.5">
        You are not in a group. <br>
        Please assign yourself to the desired group
      </p>
      <div v-else v-for="group in userGroups">
        <div class="mt-5 p-2 rounded-lg cursor-pointer" :class="
          { 
            'bg-[#A1842C]': group.myGroup.id === selectedGroup.id,
            'hover:bg-[#A1842C]/50' : group.myGroup.id !== selectedGroup.id,
          }" @click="setGroup(group)">
          <h3 class="text-[#F4F4F5] text-sm font-bold truncate">{{ group.moduleName }}</h3>
          <div class="leading-none truncate text-[#C2C2C5]">
            <span class="text-[#F4F4F5] text-xs mr-4">Group {{ group.myGroup.id }}</span>
            <span class="text-[#C2C2C5] text-xs mr-4">{{ `${group.myGroup.userGroup.length}/${group.moduleGroupSize}` }} Members</span>
            <span class="text-[#C2C2C5] text-xs">Joined {{ new Date(group.myGroup.userGroup.find(g => g.userId === userId).updatedAt).toLocaleString('en-GB') }}</span>
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
  const selectedGroup = ref({});
  const modulesData = ref([]);
  const userId = ref(Number);

  function setGroup(group) {
    selectedGroup.value = group.myGroup;
  }

  definePageMeta({
    middleware: 'auth',
  })

  const userGroups = computed(() => {
    return modulesData.value
      .map(module => (
        {
          moduleName: module.name,
          moduleGroupSize: module.groupSize,
          myGroup: module.groups.find(group => group.isPartOf) || null
        }
      ))
      .filter(module => module.groups !== null);
  });
    

  onMounted(async () => {
    try {
      const response = await $fetch('/api/modules');
      modulesData.value = response.data;
      userId.value = response.user;

      console.log(selectedGroup);
    } catch (error) {
      console.log(error);
    }
  })
</script>