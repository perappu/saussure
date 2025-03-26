<script lang="ts">
	import { Tipex } from "@friendofsvelte/tipex";
	import { Editor } from "@tiptap/core";
	import "@friendofsvelte/tipex/styles/Tipex.css";
	import "@friendofsvelte/tipex/styles/ProseMirror.css";
	import "@friendofsvelte/tipex/styles/Controls.css";
	import "@friendofsvelte/tipex/styles/EditLink.css";
	import "@friendofsvelte/tipex/styles/CodeBlock.css";
	import "./texteditor.css";
	import { prettify } from "htmlfy";
    import { textValue } from "./texteditor";
    import { settings } from "$lib/config";
    import Aceeditor from "../aceeditor/aceeditor.svelte";
    import { m } from "$lib/paraglide/messages";

	let { contents, selectedTab } = $props();

	let tiptapEditor: Editor | undefined = $state();

	textValue.set(contents);

	//tab handling
	const changeTab = (tabValue: any) => () => {
		if(tabValue === "ace") {
			textValue.set(prettify(tiptapEditor?.getHTML() ?? contents));
		} else {
			tiptapEditor?.commands.setContent($textValue);
		}
		selectedTab = tabValue;
	};

	function onupdate() {
		textValue.set(prettify(tiptapEditor?.getHTML() ?? contents));
	}
</script>

{#if $settings.WYSIWYG === 'enabled'}
<div class="tabs">
	<button
		class={selectedTab === "ace" ? "active" : ""}
		onclick={changeTab("tiptap")}>wysiwyg</button
	>
	<button
		class={selectedTab === "tiptap" ? "active" : ""}
		onclick={changeTab("ace")}>{m.code()}</button
	>
</div>
{/if}

{#if $settings.WYSIWYG === 'disabled' || selectedTab === "ace"}
	<Aceeditor contents={$textValue}/>
{:else}
	<Tipex body={$textValue} focal controls floating bind:tipex={tiptapEditor} {onupdate}/>
{/if}
