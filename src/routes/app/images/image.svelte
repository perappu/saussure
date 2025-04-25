<script lang="ts">
    import { fetchMedia } from "$lib/data/media.svelte";
    import { settings } from "$lib/stores";
    import { onMount } from "svelte";
    import { get } from "svelte/store";

	let { image } = $props();

	let src = $state('');

	onMount(async () => {
		src = await fetchMedia(get(settings).MEDIA_PATH + '/' + image.filename);
	});

</script>

<div style="text-align: center; padding: 10px; width: 25%; max-width: 200px; border-radius: 5px; background-color: var(--background); margin: 5px;">
	<a href="{process.env.BASE_PATH}/app/images/edit/{image.filename}"><img src={src} style="max-width: 100%; max-height: 200px;" alt={image.title} /></a>
	<div>{image.characterName}</div>
	<div><a href="{process.env.BASE_PATH}/app/images/edit/{image.filename}">{image.title ? image.title : '(no title)'}</a></div> 
	<small style="word-break: break-all;">{image.filename}</small>
</div>