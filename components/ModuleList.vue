<template>
    <h3 class="text-white font-bold text-lg mb-3">{{ moduleName }}</h3>
    <div v-for="group in moduleGroups" :key="group.id" class="p-2 space-y-2">

      <div class="py-1.5 px-5 text-sm bg-[#27272A] border border-[#3F3F46] rounded flex justify-between items-center">
        <span class="text-white font-bold">Group {{ group.id }}</span>
        <span class="text-white">{{ `${group._count.userGroup}/${groupCapacity}` }} Capacity</span>
        <!-- need to add this functionality -->
        <button class="bg-[#FFAC00] text-[#4B360A] font-bold py-1.5 px-10 rounded-full cursor-pointer">Assign me</button>
      </div>

    </div>
</template>

<script setup>
  const props = defineProps({
    moduleName: String,
    moduleGroups: Array,
    groupCapacity: Number,
  })

  onMounted(() => {
    console.log(props.groupCapacity);
  })
</script>