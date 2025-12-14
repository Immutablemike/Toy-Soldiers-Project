<script lang="ts">
  let { form } = $props()
</script>

<style>
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
    border: 1px solid #ddd;
    padding: 1rem;
    border-radius: 8px;
  }
  
  h2 {
    color: #333;
    margin-top: 0;
    font-size: 1.2rem;
  }
  
  form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  input, button {
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  input {
    border-color: #ddd;
  }
  
  button {
    background-color: #007bff;
    color: white;
    border-color: #007bff;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  
  button:active {
    background-color: #003d82;
  }
  
  .message {
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 1rem;
  }
  
  .success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }
  
  .error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }
</style>

<div class="container">
  <h1>KYC Verification Demo</h1>
  <p>This demo showcases Twilio Verify integration for Know Your Customer verification.</p>

  {#if form?.message}
    <div class="message success">{form.message}</div>
  {/if}
  {#if form?.error}
    <div class="message error">{form.error}</div>
  {/if}

  <div class="form-group">
    <h2>📧 Email & Password</h2>
    <form method="POST" action="?/signin_email">
      <input name="email" placeholder="email" type="email" value={form?.email ?? ""} required>
      <input name="password" placeholder="password" type="password" required>
      <button type="submit">Login</button>
      <button type="submit" formaction="?/signup">Signup</button>
    </form>
  </div>

  <div class="form-group">
    <h2>🔗 OAuth</h2>
    <form method="POST" action="?/oauth">
      <button type="submit" name="provider" value="github">Login with GitHub</button>
    </form>
  </div>

  <div class="form-group">
    <h2>✨ Magic Link</h2>
    <form method="POST" action="?/magic">
      <input name="email" placeholder="email" type="email" required>
      <button type="submit">Send Magic Link</button>
    </form>
  </div>

  <div class="form-group">
    <h2>📱 Phone OTP (Supabase)</h2>
    <form method="POST" action="?/signin_otp">
      <input name="phone" placeholder="+1234567890" type="text" required>
      <button type="submit">Send OTP via SMS</button>
    </form>
  </div>

  <div class="form-group">
    <h2>☎️ Phone KYC Verification (Twilio)</h2>
    <form method="POST" action="?/kyc_verify_phone">
      <input name="phone" placeholder="+1234567890" type="text" required>
      <button type="submit">Start Phone Verification</button>
    </form>
  </div>

  {#if form?.verify_kyc}
    <div class="form-group">
      <h2>🔐 Enter Verification Code</h2>
      <form method="POST" action="?/kyc_confirm_phone">
        <input name="code" placeholder="6-digit code" type="text" maxlength="6" required>
        <input name="phone" type="hidden" value={form?.phone}>
        <button type="submit">Verify Code</button>
      </form>
    </div>
  {/if}

  <div class="form-group">
    <h2>👤 Anonymous</h2>
    <form method="POST" action="?/anon">
      <button type="submit">Login Anonymously</button>
    </form>
  </div>

  <div class="form-group">
    <h2>🔑 Reset Password</h2>
    <form method="POST" action="?/reset">
      <input name="email" placeholder="email" type="email" required>
      <button type="submit">Send Reset Link</button>
    </form>
  </div>
</div>
