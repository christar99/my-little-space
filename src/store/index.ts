import { atom } from 'jotai';
import { iconType } from 'utils/type';
import { v4 as uuidv4 } from 'uuid';

export const needAccount = atom<string | null>(null);
export const startMenuToggle = atom<boolean>(false);
const iconListAtom = atom<iconType[]>([
	{
		name: '내 컴퓨터',
		uuid: '6505522c-77c7-4fc7-ac88-34a6f6eb00c1',
		image: '/icons/my_pc.png',
		type: 'document'
	},
	{
		name: '휴지통',
		uuid: '7394bc11-4439-425d-a1d2-6b3ea0777e0f',
		image: '/icons/trash_can.png',
		type: 'trash_can'
	},
	{
		name: '메모장',
		uuid: 'ba5b2cb2-e1d2-4d8f-bd36-68c594111a1b',
		image: '/icons/notepad.png',
		type: 'notepad'
	},
	{
		name: '그림판',
		uuid: 'e9b6901c-4227-4eff-a841-f748dc7b3358',
		image: '/icons/paint.png',
		type: 'paint'
	}
]);

export const iconList = atom(
	(get) => get(iconListAtom),
	(get, set, newIcon: iconType[]) => {
		set(iconListAtom, [...get(iconListAtom), ...newIcon]);
	}
);

export const deleteProgramAtom = atom(null, (get, set, selectIcon: iconType) => {
	set(
		iconListAtom,
		get(iconListAtom).filter((icon) => {
			return icon.name !== selectIcon.name;
		})
	);
});
