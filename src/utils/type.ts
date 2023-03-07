export interface iconType {
	name: string;
	value: string;
	image: string;
	type: string;
}

export interface programType {
	name: string;
	value: string;
	image: string;
	type: string;
	style: programStyle;
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
