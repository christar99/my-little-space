import { atom } from 'jotai';
import { backgroundType } from 'utils/type';

export const needAccount = atom<string | null>(null);
export const startMenuToggle = atom<boolean>(false);

const selected = atom<string>('');
export const selectedIcon = atom(
	(get) => get(selected),
	(get, set, name: string) => {
		set(selected, name);
	}
);

const background = atom<backgroundType>({
	type: 'color',
	value: '#000000'
});
export const backgroundAtom = atom(
	(get) => get(background),
	(get, set, result: backgroundType) => {
		set(background, result);
	}
);

const screenShot = atom<string>('');
export const screenShotAtom = atom(
	(get) => get(screenShot),
	(get, set, src: string) => {
		set(screenShot, src);
	}
);

const darkMode = atom<boolean>(false);
export const setDarkModeAtom = atom(
	(get) => get(darkMode),
	(get, set, mode: boolean) => {
		set(darkMode, mode);
	}
);
