<script lang="ts">
    const {
      text = "Loading...",
      showSpinner = true,
      bgColor = "bg-white",
      textColor = "text-gray-800"
    } = $props<{
      text?: string;
      showSpinner?: boolean;
      bgColor?: string;
      textColor?: string;
    }>();
</script>

<div class={`fixed inset-0 ${bgColor} z-50 flex flex-col items-center justify-center gap-4`}>
  {#if showSpinner}
    <div class="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
  {/if}
  <p class={`text-lg font-medium ${textColor}`}>{text}</p>
</div>