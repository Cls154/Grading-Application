export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.client)
    return;

  try {
    const response = await $fetch('/api/verify', { 
      headers: {
        ...useRequestHeaders(),
        'x-api-key': process.env.API_KEY
      }
    });

    if (!response.valid) {
      if (to.path !== '/login') {
        return navigateTo('/login');
      }
      return;
    }

    if (response.user.role === 'student' && to.path !== '/student') {
      return navigateTo('/student');
    } else if (response.user.role === 'educator' && to.path !== '/educator') {
      return navigateTo('/educator');
    }

  } catch (e) {
    console.log(e);
    if (to.path !== '/login') {
      return navigateTo('/login');
    }
  }
})