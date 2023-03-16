import { atom } from 'jotai';
import { iconType } from 'utils/type';

export const needAccount = atom<string | null>(null);
export const startMenuToggle = atom<boolean>(false);
const iconListAtom = atom<iconType[]>([
	{ name: '내 컴퓨터', value: 'my-computer', image: '/icons/my_pc.png', type: 'document' },
	{ name: '휴지통', value: 'trash-can', image: '/icons/trash_can.png', type: 'trash_can' },
	{ name: '메모장', value: 'notepad', image: '/icons/notepad.png', type: 'notepad' },
	{ name: '그림판', value: 'paint', image: '/icons/paint.png', type: 'paint' }
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
