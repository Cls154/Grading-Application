<template>
  <form v-if="haveAllMembersSubmitted" class="bg-[#27272A] border border-[#3F3F46] p-5 rounded min-h-75 space-x-10">
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
              
        <EduIndividualFormResult v-if="selectedUser && Object.keys(selectedUser).length" :key="selectedUser.id" :userForm="selectedUser" :outliers="outliers"/>
      </div>

        <div class="flex flex-col justify-between">
          <h3 class="text-white font-bold flex-grow flex justify-center items-center mb-5">Overall Contributions</h3>
          <div class="flex flex-col space-y-3">
            <div v-for="userGroup in props.group.userGroup" class="inline-flex justify-between">
              <div>
                <h3 class="text-[#F4F4F5] font-bold leading-none">{{ userGroup.user.firstName + ' ' + userGroup.user.lastName }}</h3>
                <span class="text-[#F4F4F5]/50 text-sm">{{ 'up' + userGroup.userId.toString().padStart(7, '0') }}</span>
              </div>
              <input type="number" placeholder='50' class="bg-[#3F3F46] ml-5 px-3 w-18 rounded font-bold text-white placeholder:text-white/15 text-sm"/>
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


  const peerEvaluations = [];

  function setUser(user) {
    selectedUser.value = user;
  }

  const props = defineProps({
    group: Object
  })

  

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

        outliers.value = calculateOutliers(peerEvaluations);
      }

    } catch (e) {

    }
  })

  function calculateOutliers(peerEvaluations) {
    let contributions = {};

    // Collect scores for each student
    peerEvaluations.forEach(evaluation => {
        let evaluator = Object.keys(evaluation)[0];
        let scores = evaluation[evaluator];

        Object.entries(scores).forEach(([student, score]) => {
            if (!contributions[student]) {
                contributions[student] = { scores: [], evaluators: [] };
            }
            contributions[student].scores.push(score);
            contributions[student].evaluators.push(evaluator);
        });
    });

    // Process and flag outliers
    let flaggedContributions = {};

    Object.entries(contributions).forEach(([person, { scores, evaluators }]) => {
      let mean = Math.round(calculateMean(scores));
      let stdDev = Math.round(calculateStandardDeviation(scores, mean));

      let flaggedEntries = scores
        .map((score, index) => Math.abs(score - mean) > stdDev ? { evaluator: evaluators[index], score } : null)
        .filter(entry => entry !== null);

      if (flaggedEntries.length > 0) {
        flaggedContributions[person] = Object.fromEntries(flaggedEntries.map(({ evaluator, score }) => [evaluator, score]));
      }
    });

    // Transform contributions to the required format
    let transformed = {};

    Object.entries(flaggedContributions).forEach(([student, evaluations]) => {
      Object.entries(evaluations).forEach(([evaluator, score]) => {
        if (!transformed[evaluator]) {
          transformed[evaluator] = {};
        }
        transformed[evaluator][student] = score;
      });
    });

    return transformed;
  }

  function calculateMean(scores) {
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }

  function calculateStandardDeviation(scores, mean) {
    let variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    return Math.sqrt(variance);
  }

</script>