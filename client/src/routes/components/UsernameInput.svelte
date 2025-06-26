<script lang="ts">
	import type { UserProps } from "../../stores/roomWatch.svelte.js";
    import { v4 as uuidv4 } from 'uuid';
	import { onMount } from "svelte";
    import CircleAlert from '@lucide/svelte/icons/circle-alert';
    import TriangleAlert from '@lucide/svelte/icons/triangle-alert';
    import Loader from '@lucide/svelte/icons/loader';
    import Check from '@lucide/svelte/icons/check';
    import User from '@lucide/svelte/icons/user';

    let { 
        onSaveName,
        user = $bindable(), 
    } = $props<{ 
        onSaveName?: () => void,
        user: UserProps
    }>();
    let nameError: string = $state('');
    let isSubmitting: boolean = $state(false);
    
    onMount(() => {
        setUserProps();
    });

    const setUserProps = () => {
        user.id =  (
        typeof crypto?.randomUUID === 'function'
        ) ? crypto.randomUUID() : uuidv4();

        user.name = `User_${Date.now().toString(36)}${Math.floor(Math.random() * 100)}`;
    }

    const validateName = (name: string): { valid: boolean, error?: string } => {
        if (!name.trim()) {
            return { valid: false, error: "Nama tidak boleh kosong!" };
        }
        
        const invisibleChars = /[\u200B-\u200D\uFEFF\u00AD\u034F\u115F\u1160\u17B4\u17B5\u180E\u2000-\u200F\u2028-\u202F\u205F-\u206F\u3164\uFFA0]/g;
        if (invisibleChars.test(name)) {
            return { valid: false, error: "Nama mengandung karakter yang tidak valid" };
        }
        
        if (name.includes('  ') || name.trim().length !== name.length) {
            return { valid: false, error: "Hapus spasi di awal/akhir atau ganda" };
        }
        
        if (/[^\p{L}\p{M}\p{N}\p{P}\p{Zs}]/gu.test(name)) {
            return { valid: false, error: "Nama mengandung karakter yang tidak diizinkan" };
        }
        
        return { valid: true };
    };
    
    const saveName = async () => {
        isSubmitting = true;
        nameError = '';
        
        const validation = validateName(user.name);
        if (!validation.valid) {
            nameError = validation.error || "Nama tidak valid";
            isSubmitting = false;
            return;
        }
        
        await new Promise(resolve => setTimeout(resolve, 200));
        
        onSaveName();
        isSubmitting = false;
    };
    
    const handleBlur = () => {
        user.name = user.name.trim();
    };
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <div class="bg-white rounded-2xl shadow-2xl w-80 max-w-sm p-6 text-center space-y-4 animate-fade-in
                border border-gray-100 dark:border-gray-700 dark:bg-gray-800">
        <div class="flex justify-center">
            <User class="h-10 w-10 text-blue-500" />
        </div>
        
        <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">Masukkan Nama Anda</h2>
        
        <div class="space-y-3">
            <div class="relative">
                <input
                    type="text"
                    required
                    maxlength=15
                    placeholder="Nama..."
                    class={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-all duration-200
                        ${nameError ? 'border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50':
                        'border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400'}
                        dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500/50`}
                    bind:value={user.name}
                    onblur={handleBlur}
                    disabled={isSubmitting}
                />
                
                {#if nameError}
                    <div class="absolute right-3 top-3 text-red-500">
                        <CircleAlert class="h-5 w-5" />
                    </div>
                {/if}
            </div>
            
            {#if nameError}
                <div class="flex items-start p-3 bg-red-50 rounded-lg animate-shake dark:bg-red-900/20">
                    <TriangleAlert class="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                    <p class="text-sm text-red-600 text-left dark:text-red-400">{nameError}</p>
                </div>
            {/if}
            
            <p class="text-xs text-gray-500 text-left dark:text-gray-400">Nama akan terlihat oleh user lain (maks. 15 karakter).</p>
        </div>
        
        <div class="pt-2">
            <button 
                class="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200
                    shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                onclick={saveName}
                disabled={isSubmitting || !user.name.trim()}
            >
                {#if isSubmitting}
                    <Loader class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                    Menyimpan...
                {:else}
                    <Check class="h-4 w-4" />
                    Simpan
                {/if}
            </button>
        </div>
    </div>
</div>

<style>
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-4px); }
        40%, 80% { transform: translateX(4px); }
    }
    
    .animate-shake {
        animation: shake 0.4s ease-in-out;
    }
    
    .animate-fade-in {
        animation: fadeIn 0.3s ease-out;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
</style>