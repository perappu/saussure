<script lang="ts">
	let { character } = $props();
</script>

<div style="display: flex; justify-content: space-between; align-items: center;">
<a href="/characters/edit/{character.filename}">{character.name}</a> <small>{character.filename}</small>
</div>