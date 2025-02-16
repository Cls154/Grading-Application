<template>

  <form class="bg-[#27272A] border border-[#3F3F46] p-5 rounded min-h-75 flex space-x-10">
    <section class="flex flex-col space-y-3">
      <div v-for="userGroup in myGroup.userGroup" class="inline-flex justify-between">
        <div>
          <h3 class="text-[#F4F4F5] font-bold leading-none">{{ `${userGroup.user.firstName} ${userGroup.user.lastName}` }}</h3>
          <span class="text-[#F4F4F5]/50 text-sm">up{{ userGroup.userId }}</span>
        </div>
        <input type="number" min="0" max="100" placeholder='50' class="bg-[#3F3F46] ml-5 px-3 w-18 rounded font-bold text-white placeholder:text-white/15 text-sm"/>
      </div>
    </section>

    <section class="bg-[#3F3F46] rounded px-3 py-2 flex flex-col flex-grow">
      <h3 class="font-bold text-[#F4F4F5] mb-1">Personal Contribution Reflection</h3>
      <textarea class="text-[#F4F4F5]/50 text-sm focus:outline-none resize-none flex-grow"></textarea>
    </section>

    <section class="flex flex-col">
      <div class="flex-grow"></div>
      <button type="submit" class="bg-[#FFAC00] py-1 px-10 rounded text-black font-bold text-sm">Submit</button>
    </section>
  </form>
</template>

<script setup>
  const myGroup = ref({})

  const props = defineProps({
    groupId: Number
  })

  const { groupId } = toRefs(props);

  async function getMyGroup() {
    return await $fetch(`/api/group/${groupId.value}`);
  }

  onMounted(async () => {
    const response = await getMyGroup();
    myGroup.value = response.data;
    console.log(myGroup.value);
  })

  watch(groupId, async (newVal, oldVal) => {
    const response = await getMyGroup();
    myGroup.value = response.data;
    console.log(myGroup.value);
  })
  
</script>