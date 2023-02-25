import { atom } from 'jotai';
import { iconType } from 'common/type';

export const startMenuToggle = atom<boolean>(false);
export const iconList = atom<iconType[]>([
	{ name: '내 컴퓨터', image: '/icons/my_pc.png', type: 'document' },
	{ name: '휴지통', image: '/icons/trash_can.png', type: 'trash_can' }
]);
