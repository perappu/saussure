<script lang="ts">
    var { index, key = "", value = "", onchange = null } = $props();
</script>

<div class="form-group" id="field{index}">
    <div class="field">
        <input name="key{index}" autocomplete="off" value={key} {onchange} />
        <input name="value{index}" autocomplete="off" value={value} {onchange} />
        <button onclick={() => document.getElementById("field" + index)?.remove()}>x</button>
    </div>
</div>