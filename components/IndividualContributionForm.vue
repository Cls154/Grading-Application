<template>

  <form @submit.prevent="submit" class="bg-[#27272A] border border-[#3F3F46] p-5 rounded min-h-75 flex space-x-10">
    <section class="flex flex-col space-y-3">
      <div v-for="userGroup in myGroup.userGroup" class="inline-flex justify-between">
        <div>
          <h3 class="text-[#F4F4F5] font-bold leading-none">{{ `${userGroup.user.firstName} ${userGroup.user.lastName}` }}</h3>
          <span class="text-[#F4F4F5]/50 text-sm">up{{ userGroup.userId }}</span>
        </div>
        <input v-model="contributions[userGroup.userId]" type="number" placeholder='50' class="bg-[#3F3F46] ml-5 px-3 w-18 rounded font-bold text-white placeholder:text-white/15 text-sm"/>
      </div>
    </section>

    <section class="bg-[#3F3F46] rounded px-3 py-2 flex flex-col flex-grow">
      <h3 class="font-bold text-[#F4F4F5] mb-1">Personal Contribution Reflection</h3>
      <textarea v-model="personalReflection" class="text-[#F4F4F5]/50 text-sm focus:outline-none resize-none flex-grow"></textarea>
    </section>

    <section class="flex flex-col">
      <div class="flex-grow"></div>
      <button type="submit" class="bg-[#FFAC00] py-1 px-10 rounded text-black font-bold text-sm">Submit</button>
    </section>
  </form>
</template>

<script setup>
  import Swal from 'sweetalert2';

  const myGroup = ref({});
  const contributionsInput = ref({});

  const contributions = ref({});
  const personalReflection = ref('');

  const props = defineProps({
    groupId: Number
  })

  const { groupId } = toRefs(props);

  async function submit() {
    
  }

  onMounted(async () => {
    try {
      const response = await $fetch(`/api/group/${groupId.value}`);
      myGroup.value = response.group;
      contributionsInput.value = response.contributionForm;

      personalReflection.value = contributionsInput.value.myUserReflection;

      contributionsInput.value.contributionForms.forEach(form => {
        contributions.value[form.targetUserId] = form.targetUserContribution;
      })

    } catch (error) {
      console.error(error);
    }
  })

</script>