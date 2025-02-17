<template>
  <main class="flex bg-zinc-900 h-screen">
    <!-- Sidebar -->
    <section class="bg-black w-[516px] p-12 flex flex-col">
      <!-- SidebarTitle -->
      <div class="flex items-center justify-between mb-5">
        <button @click="setPage('group')" class="text-white font-bold text-lg" :class="
          {
            'border-b-2 border-[#A1842C]': selectedPage === 'group',
            'hover:border-b-2 border-[#A1842C]/50': selectedPage !== 'group',
          }"
        >My Groups</button>
        <button @click="setPage('contribution')" class="text-white font-bold text-lg" :class="
          {
            'border-b-2 border-[#A1842C]': selectedPage === 'contribution',
            'hover:border-b-2 border-[#A1842C]/50': selectedPage !== 'contribution',
          }"
        >My Contributions</button>
      </div>
      <!-- /SidebarTitle -->

      <!-- SidebarContent -->
      <div v-if="selectedPage === 'group'">
        <p v-if="userGroups.length === 0" class="text-zinc-300 text-sm p-2 mt-3.5">
          You are not in a group. <br>
          Please assign yourself to a group
        </p>
        <div v-else v-for="group in userGroups">
          <div class="mt-5 p-2 rounded-lg">
            <h3 class="text-[#F4F4F5] text-sm font-bold truncate">{{ group.moduleName }}</h3>
            <div class="leading-none truncate text-[#C2C2C5]">
              <span class="text-[#F4F4F5] text-xs mr-4">Group {{ group.myGroup.id }}</span>
              <span class="text-[#C2C2C5] text-xs mr-4">{{ `${group.myGroup.userGroup.length}/${group.moduleGroupSize}` }} Members</span>
              <span class="text-[#C2C2C5] text-xs">Joined {{ new Date(group.myGroup.userGroup.find(g => g.userId === userId).updatedAt).toLocaleString('en-GB') }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="selectedPage === 'contribution'" v-for="group in userGroups">
        {{ console.log(group) }} // need to modify database to include hasSubmittedContributionForm to display who has and hasnt peer evaluated
      </div>

      <!-- NEEDS TO BE WORKED ON -->
      <div v-else>
        THIS PAGE DOES NOT EXSIST
      </div>

      <!-- /SidebarContent -->
    </section>
    <!-- /Sidebar -->

    <!-- MainPage -->
    <section class="w-full p-12 space-y-12 overflow-scroll">

      <!-- ModuleGroupAssignment -->
      <div v-if="selectedPage === 'group'" v-for="mod in modulesData" :key="mod.id">
        <ModuleList :moduleName=mod.name :moduleGroups=mod.groups :groupCapacity=mod.groupSize />
      </div>
      <!-- /ModuleGroupAssignment -->

      <!-- IndividualContributionForm -->
      <div v-else-if="selectedPage === 'contribution'" v-for="group in userGroups">
        <div class="text-white font-bold text-lg mb-3 space-x-10">
          <span>{{ group.moduleName }}</span>
          <span>{{ `Group: ${group.myGroup.id}` }}</span>
          <span>Contribution Form</span>
        </div>
        <IndividualContributionForm :groupId=group.myGroup.id />
      </div>
      <!-- /IndividualContributionForm -->

      <!-- NEEDS TO BE WORKED ON -->
      <div v-else>
        THIS PAGE DOES NOT EXSIST
      </div>

    </section>
    <!-- /MainPage -->

  </main>
</template>

<script setup>
  const selectedPage = ref('group');

  const modulesData = ref([]);
  const userId = ref(Number);

  function setPage(page) {
    selectedPage.value = page;
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
      .filter(module => module.myGroup !== null);
  });
    

  onMounted(async () => {
    try {
      const response = await $fetch('/api/modules');
      modulesData.value = response.data;
      userId.value = response.user;

      console.log(selectedPage.value)
    } catch (error) {
      console.log(error);
    }
  })
</script>