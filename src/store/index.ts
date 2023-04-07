import { atom } from 'jotai';
import { accountProps, backgroundType, fontStyleProps } from 'utils/type';

export const accountAtom = atom<accountProps>({ name: '', uuid: '' });
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

const resolution = atom<number>(2);
export const setResolutionAtom = atom(
	(get) => get(resolution),
	(get, set, value: number) => {
		set(resolution, value);
	}
);

const fontStyle = atom<fontStyleProps>({ name: '고딕', value: ['Nanum Gothic', 'sans-serif'] });
export const setFontStyleAtom = atom(
	(get) => get(fontStyle),
	(get, set, font: fontStyleProps) => {
		set(fontStyle, font);
	}
);
