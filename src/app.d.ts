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
			'THEME' : string;
			'BACKEND' : string;
			'TOKEN' : string;
			'REPO_NAME' : string;
			'BRANCH' : string = 'main';
		}
	}
	
}

