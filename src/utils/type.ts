declare module 'styled-components' {
	export interface DefaultTheme {
		program: {
			topBarColor: string;
			topBarButtonHover: string;
			borderColor: string;
			backgroundColor: string;
			textColor: string;
			textHover: string;
		};
		startMenu: {
			menuContainer: string;
			startMenuButton: string;
			buttonImage: string;
			startMenuHover: string;
			searchInput: string;
			searchInputText: string;
			runningProgram: string;
			runningTop: string;
			runningHover: string;
			runningTopHover: string;
			confirmButton: string;
			sideMenuHover: string;
		};
	}
}

export interface iconType {
	name: string;
	uuid: string;
	image: string;
	type: string;
	from: string;
	notepadContent?: NotepadContentType;
	src?: string;
	containIcons?: iconType[];
}

interface NotepadContentType {
	content: string;
	fontSize: number;
	fontStyle: string;
}

export interface programType {
	name: string;
	uuid: string;
	image: string;
	type: string;
	style: programStyle;
	notepadContent?: NotepadContentType;
	src?: string;
	containIcons?: iconType[];
}

export interface programStyle {
	width: number;
	height: number;
	top: number;
	left: number;
	zIndex: number;
	minimization: boolean;
	maximization: boolean;
}

export interface memorizedProgramStyle {
	name: string;
	width: number;
	height: number;
	top: number;
	left: number;
	zIndex: number;
}

export interface ListObjectProps {
	ChecksumAlgorithm?: string;
	ETag: string;
	Key: string;
	LastModified: Date;
	Owner?: string;
	Size: number;
	StorageClass: String;
}

export interface backgroundType {
	type: string;
	value: string;
}

export interface fontStyleProps {
	name: string;
	value: string[];
}
