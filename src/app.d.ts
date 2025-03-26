// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}

		interface Settings {
			THEME : string;
			LANGUAGE : string;
			WYSIWYG : string;
			BACKEND : string;
			TOKEN : string;
			REPO_NAME : string;
			OWNER_NAME : string;
			BRANCH : string = 'main';
			FRONTEND : string;
			CHARACTER_DIRECTORY: string;
			GALLERY_DIRECTORY: string;
			IMAGE_DIRECTORY: string;
			LITERATURE_DIRECTORY: string;
			MEDIA_STORAGE: string;
		}
	}
	
}

