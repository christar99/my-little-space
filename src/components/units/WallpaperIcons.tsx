import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useAtom } from 'jotai';
import styled from 'styled-components';
import { addIconList, backgroundAtom, screenShotAtom, selectedIcon, startMenuToggle } from 'store';
import { executeProgram, changeZIndex } from 'store/programs';
import { backgroundType, iconType, ListObjectProps } from 'utils/type';
import { S3ListObject, S3GetObject } from 'utils/aws';
import { allCookie } from 'utils/Cookie';
import { fetchURL, uuid } from 'utils/common';
import { v4 as uuidv4 } from 'uuid';
import IconComponent from 'components/common/IconComponent';
import { _Object } from '@aws-sdk/client-s3';
import html2canvas from 'html2canvas';

export default function WallpaperIcons() {
	const [openStartMenu, setOpenStartMenu] = useAtom(startMenuToggle);
	const [icons, addNewIcon] = useAtom(addIconList);
	const [notuse, startProgram] = useAtom(executeProgram);
	const [notuse2, setSelected] = useAtom(selectedIcon);
	const [zIndex, setBigZIndex] = useAtom(changeZIndex);
	const [stanby, setStanby] = useState<boolean>(false);
	const desktopRef = useRef<HTMLDivElement>(null);
	const [background, setBackground] = useAtom(backgroundAtom);
	const [notuse3, setScreenShot] = useAtom(screenShotAtom);

	useEffect(() => {
		const savedBackground = localStorage.getItem('background');
		if (savedBackground !== null) {
			setBackground(JSON.parse(savedBackground));
		}
		getS3Objects();
		startDefaultFile();
	}, []);

	useEffect(() => {
		if (stanby) {
			const openedProgram = allCookie();
			for (let name in openedProgram) {
				const icon = icons.find((icon) => icon.uuid === name);
				if (icon !== undefined) {
					setBigZIndex();
					startProgram({ icon, zIndex });
				}
			}
		}
	}, [stanby]);

	useEffect(() => {
		getScreenshot();
	}, [background]);

	const getScreenshot = async () => {
		if (background.type === 'color' && desktopRef.current !== null) {
			const canvas = await html2canvas(desktopRef.current);
			const imageData = canvas.toDataURL('image/png');
			setScreenShot(imageData);
		}
	};

	const getS3Objects = useCallback(async () => {
		await S3ListObject(uuid);
		const s3Objects = await S3ListObject(uuid);
		const { textFile, imageFile, folders, background } = s3Objects;

		if (background !== undefined) {
			getBackgroundImage(background);
		}

		const cookies = Object.entries(allCookie());
		const folderList = await createFolders(cookies, folders);
		let textFileList: iconType[] = [];
		let imageFileList: iconType[] = [];
		if (textFile.length > 0) {
			textFileList = await createTextFile(cookies, textFile, folderList.allDocumentFile);
		}
		if (imageFileList.length > 0) {
			imageFileList = await createImageFile(cookies, imageFile, folderList.allDocumentFile);
		}

		addNewIcon([...folderList.document, ...textFileList, ...imageFileList]);
		setStanby(true);
	}, []);

	const createFolders = async (cookies: [string, unknown][], folders: _Object[]) => {
		let allDocumentFile: iconType[] = [];
		let promises = [];

		for (let folder of folders as _Object[]) {
			const url = (process.env.NEXT_PUBLIC_S3_DEFAULT_URL as string) + folder.Key;
			promises.push(fetchURL(url));
		}
		const documentFetch = await Promise.all(promises);
		promises = [];

		const document: iconType[] = [];
		folders?.forEach((folder, index) => {
			const folderName = folder.Key?.split('/')[3].split('.')[0] as string;
			const existenceFile = cookies.find((cookie) => cookie[1] === folderName);
			let documentContent = {
				name: folderName,
				uuid: existenceFile === undefined ? uuidv4() : existenceFile[0],
				image: '/icons/newFolder.png',
				type: 'document',
				from: 'desktop',
				containIcons: documentFetch[index]
			};
			document.push(documentContent);
			allDocumentFile = [...allDocumentFile, ...documentFetch[index]];
		});
		return { document, allDocumentFile };
	};

	const createTextFile = async (
		cookies: [string, unknown][],
		textFile: _Object[],
		allDocumentFile: iconType[]
	) => {
		let textFileOptions = [];
		let promises = [];
		for (let file of textFile as ListObjectProps[]) {
			promises.push(S3GetObject(file.Key));
			const fileKey = file?.Key?.split('_');
			textFileOptions.push({
				name: fileKey[3],
				fontSize: fileKey[2],
				fontStyle: fileKey[1]
			});
		}

		const textFileObject = await Promise.all(promises);
		promises = [];
		for (let object of textFileObject) {
			promises.push(object.Body?.transformToString());
		}
		const textFileContent = await Promise.all(promises);
		promises = [];

		const notepad: iconType[] = [];
		textFileOptions.forEach((option, index) => {
			const existenceFile = cookies.find((cookie) => cookie[1] === option.name);
			const txtFile = {
				name: option.name,
				uuid: existenceFile === undefined ? uuidv4() : existenceFile[0],
				image: '/icons/notepad.png',
				type: 'notepad',
				from: 'desktop',
				notepadContent: {
					content: textFileContent[index] as string,
					fontSize: Number(option.fontSize),
					fontStyle: option.fontStyle
				}
			};
			if (allDocumentFile.find((file) => file.name === txtFile.name) === undefined) {
				notepad.push(txtFile);
			}
		});
		return notepad;
	};

	const createImageFile = (
		cookies: [string, unknown][],
		imageFile: _Object[],
		allDocumentFile: iconType[]
	) => {
		const image: iconType[] = [];
		imageFile?.forEach((img) => {
			const imgKey = img?.Key?.split('/')[3] as string;
			const existenceFile = cookies.find((cookie) => cookie[1] === imgKey);
			const imgFile = {
				name: imgKey,
				uuid: existenceFile === undefined ? uuidv4() : existenceFile[0],
				image: '/icons/window_image.png',
				type: 'image',
				from: 'desktop',
				src: (process.env.NEXT_PUBLIC_S3_DEFAULT_URL as string) + img.Key
			};
			if (allDocumentFile.find((file) => file.name === imgFile.name) === undefined) {
				image.push(imgFile);
			}
		});
		return image;
	};

	const getBackgroundImage = (background?: _Object) => {
		const imgSrc = (process.env.NEXT_PUBLIC_S3_DEFAULT_URL as string) + background?.Key;
		setBackground({ type: 'image', value: imgSrc });
		setTimeout(() => {
			setScreenShot(imgSrc);
		}, 1000);
	};

	const startDefaultFile = () => {
		const cookies = Object.values(allCookie());
		icons.forEach((icon) => {
			if (cookies.includes(icon.name)) {
				setBigZIndex();
				startProgram({ icon, zIndex });
			}
		});
		const settingProgram = icons.find((icon) => icon.name === '내 컴퓨터')?.containIcons;
		settingProgram?.forEach((icon) => {
			if (cookies.includes(icon.name)) {
				setBigZIndex();
				startProgram({ icon, zIndex });
			}
		});
	};

	const handleClickIcon = () => {
		setSelected('');
		setOpenStartMenu(false);
	};

	return (
		<Desktop
			ref={desktopRef}
			background={background}
			onClick={handleClickIcon}
			data-type={'desktop'}>
			{icons.map((icon, index) => {
				return <IconComponent key={index} icon={icon} from="wallpaper" />;
			})}
		</Desktop>
	);
}

const Desktop = styled.div<{ background: backgroundType }>`
	width: 100%;
	height: calc(100% - 40px);
	padding: 50px;
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	align-content: flex-start;
	gap: 15px;
	position: absolute;
	z-index: 100;
	background: ${(props) =>
		props.background.type === 'color'
			? props.background.value
			: `url(${props.background.value})`};
	background-position: center center;
	background-repeat: no-repeat;
`;
