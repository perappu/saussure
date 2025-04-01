<script lang="ts">
	let { image } = $props();
</script>

<div style="display: flex; justify-content: space-between; align-items: center;">
<a href="{process.env.BASE_PATH}/images/edit/{image.filename + '.md'}">{image.character} - {image.title}</a> <small>{image.filename}</small>
</div>