<script lang="ts">
    import { fade, scale } from 'svelte/transition';
    import type { PopUpProps } from '../../../types/globalTypes.js';
    import type { Snippet } from 'svelte';

    let { popUp, children } = $props<{ popUp: PopUpProps, children : Snippet }>();

    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-2xl'
    };

    const closePopup = () => {
        if (popUp.closable) {
            dispatchEvent(new CustomEvent('close'));
            popUp.onClose();
        }
    }

    const handleKeydown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            closePopup();
        }
    }

    $effect(() => {
        document.body.classList.toggle('overflow-hidden', popUp.visible);
    })
</script>

{#if popUp.visible}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    role="dialog"
    tabindex="0"
    onkeydown={handleKeydown}
    onclick={(e) => e.target === e.currentTarget && closePopup()}
    transition:fade>

    <div
      class={`relative w-full p-6 rounded-2xl shadow-xl bg-white dark:bg-zinc-900 text-black dark:text-white ${sizes[popUp.size as keyof typeof sizes]}`}
      transition:scale={{ duration: 150 }}>

      {#if popUp.closable}
        <button
          class="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
          aria-label="Tutup"
          onclick={closePopup}>
          &times;
        </button>
      {/if}

      {@render children()}
    </div>
  </div>
{/if}
