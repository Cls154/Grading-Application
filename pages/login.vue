<template>
  <div class="flex bg-black h-screen">

      <div class="bg-zinc-900 w-[516px] p-12 flex flex-col justify-center">
        <h1 class="text-white font-bold">Log in to your account</h1>
        <p class="text-zinc-300 text-sm mt-0.5">
          Don't have an account?
          <nuxt-link to="/register" class="text-[#FFAC00] font-bold underline">Sign up</nuxt-link> 
          for one.
        </p>
      

        <form @submit.prevent="submit">
          <div class="mt-6">
            <label class="text-[#F4F4F5] block text-sm mb-1">Email Address</label>
            <input v-model="email" type="email" placeholder="you@email.com" class="bg-[#27272A] w-full px-4 py-2 rounded border border-[#3F3F46] text-white placeholder:text-zinc-700 text-sm"/>
          </div>
          <div class="mt-4">
            <label class="text-[#F4F4F5] block text-sm mb-1">Password</label>
            <input v-model="password" type="password" placeholder="************" class="bg-[#27272A] w-full px-4 py-2 rounded border border-[#3F3F46] text-white placeholder:text-zinc-700 text-sm"/>
          </div>
          <div>
            <button class="w-full bg-[#FFAC00] mt-6 py-2 rounded-full font-bold">
              Log in
            </button>
          </div>
        </form>
      </div>
  </div>
</template>

<script setup>
  import Swal from 'sweetalert2';

  let email = ref('');
  let password = ref('');

  async function submit() {
    try {
      const response = await $fetch('/api/login', {
        method: 'POST',
        body: {
          email: email.value,
          password: password.value,
        }
      })

      const { isConfirmed } = await Swal.fire({
        title: 'Success',
        text: 'Logged in successfully',
        icon: 'success',
        confirmButtonText: 'Close',
      })

      if (isConfirmed) {
        navigateTo(`/${response.role}`);
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