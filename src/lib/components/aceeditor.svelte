<script>
// @ts-nocheck
// this is because it has a crisis over ace-builds and i don't know why

    import * as ace from "ace-builds/src-min/ace";
    import * as dark from "ace-builds/src-min/theme-nord_dark";
    import * as light from "ace-builds/src-min/theme-cloud9_day";
    import { onMount } from "svelte";
    import { textValue } from "./texteditor";
    import { settings } from "$lib/settings/index.svelte";

    let { contents } = $props();

    var aceEditor;
    var text = $textValue;

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

    function onchange() {
        textValue.set(aceEditor.getValue());
    }

</script>

<div id="aceeditor" style="width: 100%; min-height: 400px;" {onchange}>{text}</div>