import { atom } from 'jotai';
import { iconType } from 'utils/type';

export const needAccount = atom<string | null>(null);
export const startMenuToggle = atom<boolean>(false);
const iconListAtom = atom<iconType[]>([
	{
		name: '내 컴퓨터',
		uuid: '6505522c-77c7-4fc7-ac88-34a6f6eb00c1',
		image: '/icons/my_pc.png',
		type: 'document',
		from: 'desktop',
		containIcons: [
			{
				name: '배경화면 설정',
				uuid: 'fee019d3-1196-4cb2-b82c-47d57f2b1952',
				image: '/icons/background_image.png',
				type: 'setting',
				from: '내 컴퓨터'
			},
			{
				name: '배 설정',
				uuid: 'fee019d3-1196-4cb2-b82c-47d57f2b1952',
				image: '/icons/background_image.png',
				type: 'setting',
				from: '내 컴퓨터'
			},
			{
				name: '배면 설정',
				uuid: 'fee019d3-1196-4cb2-b82c-47d57f2b1952',
				image: '/icons/background_image.png',
				type: 'setting',
				from: '내 컴퓨터'
			},
			{
				name: '배경화',
				uuid: 'fee019d3-1196-4cb2-b82c-47d57f2b1952',
				image: '/icons/background_image.png',
				type: 'setting',
				from: '내 컴퓨터'
			}
		]
	},
	{
		name: '휴지통',
		uuid: '7394bc11-4439-425d-a1d2-6b3ea0777e0f',
		image: '/icons/trash_can.png',
		type: 'trash_can',
		from: 'desktop'
	},
	{
		name: '메모장',
		uuid: 'ba5b2cb2-e1d2-4d8f-bd36-68c594111a1b',
		image: '/icons/notepad.png',
		type: 'notepad',
		from: 'desktop'
	},
	{
		name: '그림판',
		uuid: 'e9b6901c-4227-4eff-a841-f748dc7b3358',
		image: '/icons/paint.png',
		type: 'paint',
		from: 'desktop'
	}
]);

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
