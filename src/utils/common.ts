const account =
	typeof window === 'undefined' ? undefined : (window.localStorage.getItem('account') as string);
export const uuid = typeof account === 'undefined' ? '' : JSON.parse(account).uuid;

export const fetchURL = async (url: string) => {
	try {
		const fetchResponse = await fetch(url);
		return await fetchResponse.json();
	} catch (err) {
		console.error(err);
	}
};
