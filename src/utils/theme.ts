import { DefaultTheme } from 'styled-components';
export const lightTheme: DefaultTheme = {
	program: {
		topBarColor: '#EEE',
		topBarButtonHover: '#D4D4D4',
		borderColor: '#000',
		backgroundColor: '#DEE4EE',
		textColor: '#000',
		textHover: '#A1A1A1'
	},
	startMenu: {
		menuContainer: '#DEE4EE',
		startMenuButton: '#B2B2B2',
		buttonImage: '#000',
		startMenuHover: 'skyblue',
		searchInput: '#fff',
		searchInputText: '#111',
		runningProgram: '#E1E1E1',
		runningTop: '#D2D2D2',
		runningHover: '#D4D4D4',
		runningTopHover: '#C6C6C6',
		confirmButton: '#B2B2B2',
		sideMenuHover: '#B2B2B2'
	}
};

export const darkTheme: DefaultTheme = {
	program: {
		topBarColor: '#000',
		topBarButtonHover: '#2B2B2B',
		borderColor: 'rgba(255, 255, 255, 0.5)',
		backgroundColor: '#2B2B2B',
		textColor: '#fff',
		textHover: '#666'
	},
	startMenu: {
		menuContainer: '#222',
		startMenuButton: '#111',
		buttonImage: '#FFF',
		startMenuHover: 'skyblue',
		searchInput: '#666;',
		searchInputText: '#FFF;',
		runningProgram: '#444',
		runningTop: 'inherit',
		runningHover: '#333',
		runningTopHover: '#555',
		confirmButton: '#ddd',
		sideMenuHover: '#2D2D2D'
	}
};

export const theme = {
	lightTheme,
	darkTheme
};
