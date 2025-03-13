<template>
  <form class="bg-[#27272A] border border-[#3F3F46] p-5 rounded min-h-75 space-x-10">
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
              
              <EduIndividualFormResult v-if="selectedUser && Object.keys(selectedUser).length" :key="selectedUser.id" :userForm="selectedUser"/>
            </div>

              <div class="flex flex-col justify-between">
                <h3 class="text-white font-bold flex-grow flex justify-center items-center mb-5">Overall Contributions</h3>
                <div class="flex flex-col space-y-3">
                  <div class="inline-flex justify-between">
                    <div>
                      <h3 class="text-[#F4F4F5] font-bold leading-none">Jim Jim</h3>
                      <span class="text-[#F4F4F5]/50 text-sm">upXXXXXX1</span>
                    </div>
                    <input type="number" placeholder='50' class="bg-[#3F3F46] ml-5 px-3 w-18 rounded font-bold text-white placeholder:text-white/15 text-sm"/>
                  </div>
            
                  <div class="inline-flex justify-between">
                    <div>
                      <h3 class="text-[#F4F4F5] font-bold leading-none">Jim Jim</h3>
                      <span class="text-[#F4F4F5]/50 text-sm">upXXXXXX1</span>
                    </div>
                    <input type="number" placeholder='50' class="bg-[#3F3F46] ml-5 px-3 w-18 rounded font-bold text-white placeholder:text-white/15 text-sm"/>
                  </div>
            
                  <div class="inline-flex justify-between">
                    <div>
                      <h3 class="text-[#F4F4F5] font-bold leading-none">Jim Jim</h3>
                      <span class="text-[#F4F4F5]/50 text-sm">upXXXXXX1</span>
                    </div>
                    <input type="number" placeholder='50' class="bg-[#3F3F46] ml-5 px-3 w-18 rounded font-bold text-white placeholder:text-white/15 text-sm"/>
                  </div>
            
                  <div class="inline-flex justify-between">
                    <div>
                      <h3 class="text-[#F4F4F5] font-bold leading-none">Jim Jim</h3>
                      <span class="text-[#F4F4F5]/50 text-sm">upXXXXXX1</span>
                    </div>
                    <input type="number" placeholder='50' class="bg-[#3F3F46] ml-5 px-3 w-18 rounded font-bold text-white placeholder:text-white/15 text-sm"/>
                  </div>
            
                  <div class="inline-flex justify-between">
                    <div>
                      <h3 class="text-[#F4F4F5] font-bold leading-none">Jim Jim</h3>
                      <span class="text-[#F4F4F5]/50 text-sm">upXXXXXX1</span>
                    </div>
                    <input type="number" placeholder='50' class="bg-[#3F3F46] ml-5 px-3 w-18 rounded font-bold text-white placeholder:text-white/15 text-sm"/>
                  </div>
            
                  <div class="inline-flex justify-between">
                    <div>
                      <h3 class="text-[#F4F4F5] font-bold leading-none">Jim Jim</h3>
                      <span class="text-[#F4F4F5]/50 text-sm">upXXXXXX1</span>
                    </div>
                    <input type="number" placeholder='50' class="bg-[#3F3F46] ml-5 px-3 w-18 rounded font-bold text-white placeholder:text-white/15 text-sm"/>
                  </div>
                </div>
              </div>
          </section>
        </form>
</template>

<script setup>
  const selectedUser = ref({});

  function setUser(user) {
    selectedUser.value = user;
    console.log(selectedUser.value);
  }

  const props = defineProps({
    group: Object
  })

  onMounted(() => {
    try {
      selectedUser.value = props.group.userGroup[0];
      console.log(props.group);
    } catch (e) {

    }
  })
</script>