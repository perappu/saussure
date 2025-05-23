export interface Settings {
    MEDIA_STORAGE: string;
    THEME: string;
    LANGUAGE: string;
    WYSIWYG: string;
    BACKEND: string;
    TOKEN: string;
    REPO_NAME: string;
    OWNER_NAME: string;
    BRANCH: string;
    FRONTEND: string;
    LAYOUT_DIRECTORY: string;
    BASE_LAYOUT: string;
    CHARACTER_LAYOUT: string;
    IMAGE_LAYOUT: string;
    LITERATURE_LAYOUT: string;
    CHARACTER_DIRECTORY: string;
    GALLERY_DIRECTORY: string;
    IMAGE_DIRECTORY: string;
    LITERATURE_DIRECTORY: string;
    MEDIA_PATH: string;
}

export interface Character {
    name: any;
    tags: any;
    category: any;
    fields: {
        [key: string]: any;
    };
    icon: string;
    filename: any;
    fileslug: string;
    contents: string;
    sha: any;
}

export interface Literature {
    filename: string;
    title: any;
    tags: any;
    character: string[];
    characterName: string;
    fields: {
        [key: string]: any;
    };
    contents: string;
    sha: any;
}

export interface Image {
    filename: string;
    title: string;
    tags: any;
    character: string[];
    characterName: string;
    fields: {
        [key: string]: any;
    };
    contents: string;
    base64?: string;
    sha?: string;
}
