<template>
    <h3 class="text-white font-bold text-lg mb-3">{{ moduleName }}</h3>
    <div v-for="group in moduleGroups" :key="group.id" class="p-2 space-y-2">

      <div class="py-1.5 px-5 text-sm bg-[#27272A] border border-[#3F3F46] rounded flex justify-between items-center">
        <span class="text-white font-bold">Group {{ group.id }}</span>
        <span class="text-white">{{ `${group.userGroup.length}/${groupCapacity}` }} Capacity</span>

        <div v-if="isAnyGroupPartOf">
          <button v-if="group.isPartOf"
            @click="removeUser(group.id)" 
            class="bg-[#FFAC00] text-black font-bold py-1.5 px-8 rounded-full cursor-pointer">
            Leave Group
          </button>
          <button v-else
            class="bg-[#FFAC00]/35 text-black font-bold py-1.5 px-10 rounded-full">
            Assign Me
          </button>
        </div>

        <div v-else>
          <button
            @click="assignUser(group.id)" 
            class="bg-[#FFAC00] text-black font-bold py-1.5 px-10 rounded-full cursor-pointer">
            Assign Me
          </button>
        </div>
      </div>
    </div>
</template>

<script setup>
  const props = defineProps({
    moduleName: String,
    moduleGroups: Array,
    groupCapacity: Number,
  })

  const isAnyGroupPartOf = computed(() => {
    return props.moduleGroups.some(group => group.isPartOf);
  })

  async function assignUser(groupId) {
    const response = await $fetch('/api/usergroup', {
      method: 'POST',
      credentials: 'include',
      body: {
        groupId: groupId
      }
    })
    console.log(response);

    window.location.reload();
  }

  async function removeUser(groupId) {
    const response = await $fetch('/api/usergroup', {
      method: 'DELETE',
      credentials: 'include',
      body: {
        groupId: groupId
      }
    })
    console.log(response);

    window.location.reload();
  }
</script>