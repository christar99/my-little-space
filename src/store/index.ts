import { atom } from 'jotai';
import { initialIcon } from 'utils/common';
import { iconType } from 'utils/type';

export const needAccount = atom<string | null>(null);
export const startMenuToggle = atom<boolean>(false);
const iconListAtom = atom<iconType[]>(initialIcon);

export const addIconList = atom(
	(get) => get(iconListAtom),
	(get, set, newIcon: iconType[]) => {
		set(iconListAtom, [...get(iconListAtom), ...newIcon]);
	}
);

export const deleteProgramAtom = atom(
	(get) => get(iconListAtom),
	(get, set, selectIcon: iconType) => {
		set(iconListAtom, (iconListAtom) =>
			iconListAtom.filter((icon) => icon.name !== selectIcon.name)
		);
	}
);

export const modifyProgramAtom = atom(
	(get) => get(iconListAtom),
	(get, set, modifyIcon: iconType) => {
		const exceptModified = get(iconListAtom).filter((icon) => icon.uuid !== modifyIcon.uuid);
		set(iconListAtom, [...exceptModified, modifyIcon]);
	}
);

const selected = atom<string>('');
export const selectedIcon = atom(
	(get) => get(selected),
	(get, set, name: string) => {
		set(selected, name);
	}
);
