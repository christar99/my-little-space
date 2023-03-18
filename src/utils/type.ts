export interface iconType {
	name: string;
	value: string;
	image: string;
	type: string;
	notepadContent?: NotepadContentType;
	src?: string;
}

interface NotepadContentType {
	content: string;
	fontSize: number;
	fontStyle: string;
}

export interface programType {
	name: string;
	value: string;
	image: string;
	type: string;
	style: programStyle;
	notepadContent?: NotepadContentType;
	src?: string;
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
