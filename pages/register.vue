<template>
  <div class="flex bg-black h-screen">

      <div class="bg-zinc-900 w-[516px] p-12 flex flex-col justify-center">
        <h1 class="text-white">Sign up for a free account</h1>
        <p class="text-zinc-300 text-sm mt-0.5">
          Already registered? 
          <nuxt-link to="/login" class="text-[#FFAC00] font-bold underline">Log in</nuxt-link> 
          to your account
        </p>
      

        <form>
          <div class="mt-6">
            <label class="text-[#F4F4F5] block text-sm mb-1">Email Address</label>
            <input type="email" placeholder="you@email.com" class="bg-[#27272A] w-full px-4 py-2 rounded border border-[#3F3F46] text-white placeholder:text-zinc-700 text-sm"/>
          </div>
          <div class="mt-4">
            <label class="text-[#F4F4F5] block text-sm mb-1">Password</label>
            <input type="password" placeholder="************" class="bg-[#27272A] w-full px-4 py-2 rounded border border-[#3F3F46] text-white placeholder:text-zinc-700 text-sm"/>
          </div>
          <div class="mt-4">
            <label class="text-[#F4F4F5] block text-sm mb-1">Role</label>
            <select class="bg-[#27272A] w-full px-4 py-2 rounded border border-[#3F3F46] text-white text-sm">
              <option value="student">Student</option>
              <option value="educator">Educator</option>
            </select>
          </div>
          <div>
            <button class="w-full bg-[#FFAC00] mt-6 py-2 rounded-full">
              Sign Up
            </button>
          </div>
        </form>
      </div>
  </div>
</template>

<script setup>

</script>