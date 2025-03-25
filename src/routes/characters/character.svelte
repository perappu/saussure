<script lang="ts">
	let { character } = $props();
</script>

<a href="/characters/edit/{character.filename}">{character.name} <small>{character.filename}</small></a>