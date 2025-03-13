<template>
  <div class="flex space-x-10 mt-4">
    <div class="flex flex-col space-y-3">
        <div v-for="user in contributionForms" class="inline-flex justify-between">
          <div>
            <h3 class="text-[#F4F4F5] font-bold leading-none">{{ user.targetUser.firstName + ' ' + user.targetUser.lastName }}</h3>
            <span class="text-[#F4F4F5]/50 text-sm">{{ 'up' + user.targetUserId.toString().padStart(7, '0') }}</span>
          </div>
          <input type="number" :value="user.targetUserContribution" class="bg-[#3F3F46] ml-5 px-3 w-18 rounded font-bold text-white placeholder:text-white/15 text-sm" disabled/>
        </div>
    </div>

    <div class="bg-[#3F3F46] rounded px-3 py-2 flex flex-col flex-grow">
      <h3 class="font-bold text-[#F4F4F5] mb-1">Personal Contribution Reflection</h3>
      <textarea class="text-[#F4F4F5]/50 text-sm focus:outline-none resize-none flex-grow" disabled>{{ contributionText }}</textarea>
    </div>

    <div class="flex flex-col-reverse">
      <div class="inline-flex py-4">
        <h3 class="text-white font-bold p-1">Overall Grade: </h3>
        <input type="number" class="bg-[#FFFFFF] ml-5 px-3 w-18 rounded font-bold text-black placeholder:text-white/15 text-sm"/>
      </div>
    </div>
  </div>
</template>

<script setup>
  const contributionText = ref("");
  const contributionForms = ref([]);

  const props = defineProps({
    userForm: Object
  })

  onMounted(() => {
    try {
      // console.log(props.userForm);
      if (props.userForm.hasSubmitted) {
        contributionText.value = props.userForm.myContribution[0].myUserReflection;
        contributionForms.value = props.userForm.myContribution[0].contributionForms;
        console.log(contributionText.value);
        console.log(contributionForms.value);
      }
      
    } catch (e) {
      
    }
  })

</script>