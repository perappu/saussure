<script lang="ts">
	let { image } = $props();
</script>

<div style="display: flex; justify-content: space-between; align-items: center;">
	<div>{image.characterName} - <a href="{process.env.BASE_PATH}/app/images/edit/{image.filename}">{image.title}</a></div> <small>{image.filename}</small>
</div>