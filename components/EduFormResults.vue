<template>
  <form @submit.prevent="submit" v-if="haveAllMembersSubmitted" class="bg-[#27272A] border border-[#3F3F46] p-5 rounded min-h-75 space-x-10">
    <h3 class="text-white font-bold">Group {{ group.id }}</h3>
    <section class="flex justify-between space-x-10">
      <div class="flex-grow">
        <div class="mt-4 flex justify-between">
          <div class="space-x-2">
            <button v-for="user in group.userGroup" type="button" class="bg-[#FFAC00] text-xs p-3 rounded-full"
              :class="{
                'bg-[#FFAC00]/25': user.id === selectedUser.id,
                'hover:bg-[#FFAC00]/50': user.id !== selectedUser.id,
              }"
              @click="setUser(user)"
            >
              {{ 'up' + user.userId.toString().padStart(7, '0') }}
            </button>
          </div>
          <button type="submit" class="bg-[#FFAC00] px-7 py-2 font-bold text-sm rounded-full mr-3">Submit</button>
        </div>
              
        <EduIndividualFormResult @updateGrade="handleOverallGradeUpdate" v-if="selectedUser && Object.keys(selectedUser).length" :key="selectedUser.id" :userForm="selectedUser" :outliers="outliers"/>
      </div>

        <div class="flex flex-col justify-between">
          <h3 class="text-white font-bold flex-grow flex justify-center items-center mb-5">Overall Contributions</h3>
          <div class="flex flex-col space-y-3">
            <div v-for="userGroup in props.group.userGroup" class="inline-flex justify-between">
              <div>
                <h3 class="text-[#F4F4F5] font-bold leading-none">{{ userGroup.user.firstName + ' ' + userGroup.user.lastName }}</h3>
                <span class="text-[#F4F4F5]/50 text-sm">{{ 'up' + userGroup.userId.toString().padStart(7, '0') }}</span>
              </div>
              <input type="number" :value="overallContributions[userGroup.userId]" class="bg-[#3F3F46] ml-5 px-3 w-18 rounded font-bold text-white placeholder:text-white/15 text-sm"/>
            </div>
          </div>
        </div>
    </section>
  </form>

  <div v-else class="p-5 bg-[#27272A] border border-[#3F3F46] rounded flex justify-between items-center">
    <h3 class="text-white font-bold">Group {{ group.id }}</h3>
    <span v-if="group.userGroup.length > 0" class="text-white">{{ `${group.userGroup.filter(ug => ug.hasSubmitted).length}/${group.userGroup.length} members submitted` }}</span>
    <span v-else="group.userGroup.length > 0" class="text-white">Group empty</span>
  </div>
</template>

<script setup>
  const selectedUser = ref({});
  const haveAllMembersSubmitted = ref(false);
  const outliers = ref({});
  const overallContributions = ref({});
  const overallGrade = ref(Number);

  const peerEvaluations = [];

  const props = defineProps({
    group: Object
  })

  function setUser(user) {
    selectedUser.value = user;
  }

  function handleOverallGradeUpdate(newGrade) {
    overallGrade.value = newGrade;
  }

  async function submit() {
    console.log(overallContributions.value);
    console.log(overallGrade.value);
  } 

  onMounted(() => {
    try {
      selectedUser.value = props.group.userGroup[0];
      haveAllMembersSubmitted.value = props.group.userGroup.length > 0 ? props.group.userGroup.every(userGroup => userGroup.hasSubmitted) : false;

      if (haveAllMembersSubmitted.value) {
        props.group.userGroup.forEach(userGroup => {
          let form = {};

          userGroup.myContribution[0].contributionForms.forEach(contribution => {
            form[contribution.targetUser.id] = contribution.targetUserContribution;
          });

          peerEvaluations.push({ [userGroup.userId]: form });
        });

        const contributions = calculateContributions(peerEvaluations);
        outliers.value = contributions.outliers;
        overallContributions.value = contributions.overallContributions;

      }

    } catch (e) {
      console.error(e);
    }
  })
</script>