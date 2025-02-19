<template>
    <h3 class="text-white font-bold text-lg mb-3">{{ moduleName }}</h3>
    <div v-for="group in moduleGroups" :key="group.id" class="p-2 space-y-2">

      <div class="py-1.5 px-5 text-sm bg-[#27272A] border border-[#3F3F46] rounded flex justify-between items-center">
        <span class="text-white font-bold">Group {{ group.id }}</span>
        <span class="text-white">{{ `${group.userGroup.length}/${groupCapacity}` }} Capacity</span>

        <div v-if="isAnyGroupPartOf">
          <button v-if="group.isPartOf"
            @click="allocateUser(group, 'DELETE')" 
            class="bg-[#FFAC00] text-black font-bold py-1.5 px-8 rounded-full cursor-pointer">
            Leave Group
          </button>
          <button v-else
            class="bg-[#FFAC00]/35 text-black font-bold py-1.5 px-10 rounded-full"
            :class="{
              'px-16' : group.userGroup.length === groupCapacity,
            }">
            {{ group.userGroup.length === groupCapacity ? 'Full' : 'Assign Me' }}
          </button>
        </div>

        <div v-else>
          <button
            @click="allocateUser(group, 'POST')"
            :disabled="group.userGroup.length === groupCapacity"
            class="text-black font-bold py-1.5 px-10 rounded-full"
            :class="{
              'bg-[#FFAC00]/35 cursor-default px-16' : group.userGroup.length === groupCapacity,
              'bg-[#FFAC00] cursor-pointer' : group.userGroup.length !== groupCapacity
            }">
            {{ group.userGroup.length === groupCapacity ? 'Full' : 'Assign Me' }}
          </button>
        </div>
      </div>
    </div>
</template>

<script setup>
  import Swal from 'sweetalert2';

  const props = defineProps({
    moduleName: String,
    moduleGroups: Array,
    groupCapacity: Number,
  })

  const isAnyGroupPartOf = computed(() => {
    return props.moduleGroups.some(group => group.isPartOf);
  })

  async function allocateUser(group, method) {
    try {
      const response = await $fetch('/api/usergroup', {
        method: method,
        credentials: 'include',
        body: {
          groupId: group.id
        }
      })

      if (response.status === 'Success') {
        const { isConfirmed } = await Swal.fire({
          title: 'Success',
          text: `Successfully ${method === 'POST' ? 'JOINED' : 'LEFT'} group: ${group.id}`,
          icon: 'success',
          confirmButtonText: 'Close',
        })

        if (isConfirmed) {
          window.location.reload();
        }
      }
    } catch (e) {
      Swal.fire({
        title: 'Error',
        text: e.response?._data?.message,
        icon: 'error',
        confirmButtonText: 'Close',
      }) 
    }
  }
</script>