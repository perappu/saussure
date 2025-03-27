export interface Settings {
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
    MEDIA_STORAGE: string;
};

export interface Character {
    name: any;
    tags: any;
    category: any;
    fields: {
        [key: string]: any;
    };
    filename: any;
    contents: string;
    sha: any;
};