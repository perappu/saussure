<script lang="ts">
    import { invalidateAll } from '$app/navigation';
    import { toastConfig } from '$lib/config';
    import { fetchMedia, uploadMedia } from '$lib/data/media.svelte';
    import { m } from '$lib/paraglide/messages';
    import { settings } from '$lib/stores';
    import { toast } from '@zerodevx/svelte-toast';
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';

    let { filename, path, height = 200 } = $props();

    let displayedImage = $state('');

    onMount(
        async () =>
            (displayedImage = await fetchMedia(
                get(settings).MEDIA_PATH +
                    '/' +
                    (path ? path + '/' : '') +
                    filename
            ))
    );

    const onFileSelected = (e: any) => {
        let image = e.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = (e) => {
            displayedImage = e.target!.result as string;
        };
    };
</script>

<div style="text-align: center; height: {height}px; margin: 10px;">
    <img
        src={displayedImage}
        alt="Your upload"
        style="max-height: {height}px"
    />
</div>

<div class="form-group">
    <input
        accept="image/png, image/jpeg, image/gif"
        id="image"
        name="image"
        type="file"
        onchange={(e) => onFileSelected(e)}
    />
</div>
