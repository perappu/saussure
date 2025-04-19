<script lang="ts">
	let { literature } = $props();
</script>

<div style="display: flex; justify-content: space-between; align-items: center;">
<a href="{process.env.BASE_PATH}/app/literatures/edit/{literature.filename}">{literature.title}</a> <small>{literature.filename}</small>
</div>