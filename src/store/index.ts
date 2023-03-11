import { atom } from 'jotai';
import { iconType } from 'utils/type';

export const needAccount = atom<boolean>(false);
export const startMenuToggle = atom<boolean>(false);
export const iconList = atom<iconType[]>([
	{ name: '내 컴퓨터', value: 'my-computer', image: '/icons/my_pc.png', type: 'document' },
	{ name: '휴지통', value: 'trash-can', image: '/icons/trash_can.png', type: 'trash_can' },
	{ name: '메모장', value: 'notepad', image: '/icons/notepad.png', type: 'notepad' }
]);
