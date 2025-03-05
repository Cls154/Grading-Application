import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginPage from '../pages/login.vue';
import Swal from 'sweetalert2';

// Mock the `$fetch` function globally
vi.stubGlobal('$fetch', vi.fn());

describe('Login Page', () => {
  let wrapper;

  beforeEach(() => {
    vi.restoreAllMocks(); // Reset mocks before each test

    // Mock Swal.fire to simulate user confirmation
    vi.spyOn(Swal, 'fire').mockResolvedValue({ isConfirmed: true });

    // Mount the component
    wrapper = mount(LoginPage);
  });

  it('renders the login form correctly', () => {
    expect(wrapper.find('h1').text()).toBe('Log in to your account');
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    expect(wrapper.find('button').text()).toBe('Log in');
  });

  it('updates email and password when typing', async () => {
    const emailInput = wrapper.find('input[type="email"]');
    const passwordInput = wrapper.find('input[type="password"]');

    await emailInput.setValue('test@example.com');
    await passwordInput.setValue('password123');

    expect(emailInput.element.value).toBe('test@example.com');
    expect(passwordInput.element.value).toBe('password123');
  });

  it('submits the form and navigates on successful login', async () => {
    const mockNavigateTo = vi.fn();
    vi.stubGlobal('navigateTo', mockNavigateTo);

    // Mock successful login response from $fetch
    vi.stubGlobal('$fetch', vi.fn().mockResolvedValue({ role: 'educator' }));

    await wrapper.find('input[type="email"]').setValue('test@example.com');
    await wrapper.find('input[type="password"]').setValue('password123');
    await wrapper.find('form').trigger('submit.prevent');

    // Ensure $fetch was called with the correct parameters
    expect($fetch).toHaveBeenCalledWith('/api/login', expect.objectContaining({
      method: 'POST',
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    }));

    // Ensure the navigation is called correctly
    expect(mockNavigateTo).toHaveBeenCalledWith('/educator');
  });

  it('shows an error message on failed login', async () => {
    // Mock failed login response
    vi.stubGlobal('$fetch', vi.fn().mockRejectedValue({
      response: { _data: { message: 'Invalid credentials' } }
    }));

    // Simulate filling out the form and submitting it
    await wrapper.find('input[type="email"]').setValue('wrong@example.com');
    await wrapper.find('input[type="password"]').setValue('wrongpassword');
    await wrapper.find('form').trigger('submit.prevent');

    // Ensure $fetch was called
    expect($fetch).toHaveBeenCalledWith('/api/login', expect.any(Object));

    // Check that the error message is shown
    expect(Swal.fire).toHaveBeenCalledWith({
      title: 'Error',
      text: 'Invalid credentials',
      icon: 'error',
      confirmButtonText: 'Close',
    });
  });
});