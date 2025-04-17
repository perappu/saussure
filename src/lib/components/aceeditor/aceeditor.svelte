<script>
    // @ts-nocheck
    // just ignore this entire file
    // ace editor is such a pain that we import it in app.html from the cdn
    // like i spent hours on this it's not worth making TS happy with imports and packages and all that
    import { onMount } from "svelte";
    import { textValue } from "../texteditor/texteditor";
    import { text } from "@sveltejs/kit";
    import { settings } from "$lib/stores";

    let { contents } = $props();

    var aceEditor;

    //do it on mount so that the DOM #aceeditor loads first
    onMount(() => {
        aceEditor = ace.edit("aceeditor");
        ace.config.set("basePath", "/ace/");
        if($settings.THEME === 'dark') {
            aceEditor.setTheme("ace/theme/nord_dark");
        } else {
            aceEditor.setTheme("ace/theme/cloud9_day");
        }
    });

    //update the store every time we change the value in the ace editor
    function onchange() {
        textValue.set(aceEditor.getValue());
    }

</script>

<div id="aceeditor" style="width: 100%; min-height: 400px;" {onchange} >{$textValue}</div>