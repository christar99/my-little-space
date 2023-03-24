const account =
	typeof window === 'undefined' ? undefined : (window.localStorage.getItem('account') as string);
export const uuid = account === null || account === undefined ? '' : JSON.parse(account).uuid;

export const fetchURL = async (url: string) => {
	try {
		const fetchResponse = await fetch(url);
		return await fetchResponse.json();
	} catch (err) {
		console.error(err);
	}
};

export const initialIcon = [
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
				name: '테마 설정',
				uuid: 'fee019d3-1196-4cb2-b82c-47d57f2b1952',
				image: '/icons/colorTheme.png',
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
];

export const colors = [
	{ code: '#000000' },
	{ code: '#1abc9c' },
	{ code: '#3498db' },
	{ code: '#0400ff' },
	{ code: '#27ae60' },
	{ code: '#8e44ad' },
	{ code: '#f1da0f' },
	{ code: '#e74c3c' },
	{ code: '#c037b5' },
	{ code: '#5c2a09' },
	{ code: '#c9cfd3' },
	{ code: '#ff0000' }
];
