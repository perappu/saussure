<div class="loader">
</div>

<style>
.loader {
  border: 16px solid var(--background-alt); /* Light grey */
  border-top: 16px solid var(--button-base); /* Blue */
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
  margin: auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>