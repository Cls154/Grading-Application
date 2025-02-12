<template>
  <div class="flex bg-zinc-900 h-screen">

      <div class="bg-black w-[516px] p-12 flex flex-col">
        <h1 class="text-white font-bold text-lg">My Groups</h1>
        <p class="text-zinc-300 text-sm p-2 mt-3.5">
          You are not in a group. <br>
          Please assign yourself to the desired group
        </p>

        <div class="mt-5 p-2 rounded-lg cursor-pointer hover:bg-[#A1842C]/50">
          <h3 class="text-[#F4F4F5] text-sm font-bold truncate">Software Engineering Theory and Practice</h3>
          <div class="leading-none truncate text-[#C2C2C5]">
            <span class="text-[#F4F4F5] text-xs mr-4">Group 2</span>
            <span class="text-[#C2C2C5] text-xs">5/6 Members</span>
          </div>
        </div>

        <div class="mt-5 p-2 rounded-lg cursor-pointer hover:bg-[#A1842C]/50">
          <h3 class="text-[#F4F4F5] text-sm font-bold truncate">Database Principles</h3>
          <div class="leading-none truncate text-[#C2C2C5]">
            <span class="text-[#F4F4F5] text-xs mr-4">Group 7</span>
            <span class="text-[#C2C2C5] text-xs">2/3 Members</span>
          </div>
        </div>
      

        <!-- <form @submit.prevent="submit">
          <div class="mt-6">
            <label class="text-[#F4F4F5] block text-sm mb-1">Email Address</label>
            <input v-model="email" type="email" placeholder="you@email.com" class="bg-[#27272A] w-full px-4 py-2 rounded border border-[#3F3F46] text-white placeholder:text-zinc-700 text-sm"/>
          </div>
          <div class="mt-4">
            <label class="text-[#F4F4F5] block text-sm mb-1">Password</label>
            <input v-model="password" type="password" placeholder="************" class="bg-[#27272A] w-full px-4 py-2 rounded border border-[#3F3F46] text-white placeholder:text-zinc-700 text-sm"/>
          </div>
          <div>
            <button class="w-full bg-[#FFAC00] mt-6 py-2 rounded-full font-bold">
              Log in
            </button>
          </div>
        </form> -->
      </div>

      <div class="w-full p-12 space-y-12 overflow-scroll">
        <div v-for="mod in modulesData" :key="mod.id">
          <ModuleList :moduleName=mod.name :moduleGroups=mod.groups :groupCapacity=mod.groupSize />
        </div>
      </div>
  </div>
</template>

<script setup>
  const modulesData = ref([]);


  definePageMeta({
    middleware: 'auth',
  })

  onMounted(async () => {
    try {
      const response = await $fetch('/api/modules');
      modulesData.value = response.data;
      console.log(modulesData.value);
    } catch (error) {
      console.log(error);
    }
  })
</script>