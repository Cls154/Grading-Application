<template>
  <div class="relative">
    <div v-if="hasSubmitted" class="absolute inset-0 bg-black/50 z-10 rounded flex items-center justify-center">
      <span class="text-white font-bold text-lg">Awaiting Grade...</span>
    </div>

    <form @submit.prevent="submit" class="bg-[#27272A] border border-[#3F3F46] p-5 rounded min-h-75 flex space-x-10">
      <section class="flex flex-col space-y-3">
        <div v-for="userGroup in myGroup.userGroup" class="inline-flex justify-between">
          <div>
            <h3 class="text-[#F4F4F5] font-bold leading-none">{{ `${userGroup.user.firstName} ${userGroup.user.lastName}` }}</h3>
            <span class="text-[#F4F4F5]/50 text-sm">up{{ userGroup.userId }}</span>
          </div>
          <input v-model="contributions[userGroup.userId]" @input="debouncedFn" :disabled="hasSubmitted" type="number" placeholder='50' class="bg-[#3F3F46] ml-5 px-3 w-18 rounded font-bold text-white placeholder:text-white/15 text-sm"/>
        </div>
      </section>

      <section class="bg-[#3F3F46] rounded px-3 py-2 flex flex-col flex-grow">
        <h3 class="font-bold text-[#F4F4F5] mb-1">Personal Contribution Reflection</h3>
        <textarea v-model="personalReflection" @input="debouncedFn" :disabled="hasSubmitted" class="text-[#F4F4F5]/50 text-sm focus:outline-none resize-none flex-grow"></textarea>
      </section>

      <section class="flex flex-col">
        <div class="flex-grow"></div>
        <button type="submit" class="bg-[#FFAC00] py-1 px-10 rounded text-black font-bold text-sm">Submit</button>
      </section>
    </form>
  </div>
</template>

<script setup>
  import Swal from 'sweetalert2';

  const hasSubmitted = ref(false);
  const myGroup = ref({});
  const myUserGroup = ref({});
  const contributionsInput = ref({});
  const contributions = ref({});
  const personalReflection = ref('');

  const props = defineProps({
    groupId: Number
  })

  const { groupId } = toRefs(props);

  async function submit() {
    try {
      const { isConfirmed } = await Swal.fire({
        title: 'Are you sure?',
        text: 'Once submitted, you cannot change your contribution!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Submit!',
        cancelButtonText: 'No, Cancel',
        reverseButtons: true,
      })

      if (isConfirmed) {
        hasSubmitted.value = true;
        const status = await updateContributionForm();
        if (status === 'Success') {
          await $fetch(`/api/usergroup/${myUserGroup.value.id}`, {
            method: 'PATCH'
          });
          Swal.fire({
            title: 'Submitted!',
            text: 'Successfully submitted contribution form!',
            icon: 'success',
            confirmButtonText: 'Close',
          })
        }
      }
    } catch (e) {
      Swal.fire({
        title: 'Error!',
        text: error.response?._data?.message,
        icon: 'error',
        confirmButtonText: 'Close',
      })
    }
    
  }

  const debouncedFn = useDebounceFn(async () => {
    await updateContributionForm()
  }, 1000);

  async function updateContributionForm() {
    try {
      const response = await $fetch(`/api/contributionform/${contributionsInput.value.id}`, {
        method: 'PATCH',
        body: {
          personalReflection: personalReflection.value,
          contributions: contributions.value,
        }
      });

      return response.status;
    } catch (e) {
      console.error(e);
      return;
    }
  }

  onMounted(async () => {
    try {
      const response = await $fetch(`/api/group/${groupId.value}`);
      myGroup.value = response.group;
      contributionsInput.value = response.contributionForm;
      myUserGroup.value = response.userGroup;
      hasSubmitted.value = myUserGroup.value.hasSubmitted;

      personalReflection.value = contributionsInput.value.myUserReflection;

      contributionsInput.value.contributionForms.forEach(form => {
        contributions.value[form.targetUserId] = form.targetUserContribution;
      })

    } catch (error) {
      console.error(error);
    }
  })

</script>