<script lang="ts">
    import { invalidateAll } from "$app/navigation";
    import { fetchImageDownload, reuploadImage } from "$lib/data/images.svelte";
    import { m } from "$lib/paraglide/messages";
    import { settings } from "$lib/stores";
    import { toast } from "@zerodevx/svelte-toast";
    import { onMount } from "svelte";
    import { get, writable } from "svelte/store";

    let { image } = $props();

    let displayedImage = $state('');

    onMount( async () =>
        displayedImage = await fetchImageDownload(get(settings).MEDIA_PATH + "/" + image.filename)
    );

    const onFileSelected =(e: any)=>{
    let image = e.target.files[0];
                let reader = new FileReader();
                reader.readAsDataURL(image);
                reader.onload = e => {
                    displayedImage = e.target!.result as string
                };
    }

    async function submitThis() {
		var formData = new FormData(
			document.querySelector("#reuploadImage") as HTMLFormElement,
		);
		var result = await reuploadImage(image.filename, formData);
		//todo: give user feedback that the file has been saved
		toast.push(m.toast_edit_image(), {
			theme: {
				"--toastColor": "mintcream",
				"--toastBackground": "rgba(62, 168, 106,0.9)",
				"--toastBarBackground": "#2F855A",
			},
		});
		await invalidateAll();
	}
</script>

<div style="text-align: center; height: 250px;">
<img src="{displayedImage}" alt="Your upload" style="max-height: 250px">
</div>

<form action="javascript:void(0);" id="reuploadImage" enctype="multipart/form-data">

    <div class="form-group">
        {m.file()}:
        <input
            accept="image/png, image/jpeg, image/gif"
            id="image"
            name="image"
            type="file"
            onchange={(e)=>onFileSelected(e)}
        />
    </div>

    <div style="text-align:right; margin: 5px;">
        <button onclick={submitThis}>{m.save()}</button>
    </div>
</form>
