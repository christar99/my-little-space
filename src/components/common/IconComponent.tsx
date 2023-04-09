import React, { useMemo, MouseEvent } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { useAtom } from 'jotai';
import {
	accountAtom,
	backgroundAtom,
	selectedIcon,
	setDarkModeAtom,
	setResolutionAtom,
	startMenuToggle
} from 'store';
import { addIconList, deleteProgramAtom, modifyProgramAtom } from 'store/icons';
import { changeZIndex, executeProgram, exitProgram } from 'store/programs';
import { allCookie, removeCookie, setCookie } from 'utils/Cookie';
import { iconType } from 'utils/type';
import { S3DeleteObject, S3PutObject } from 'utils/aws';

interface IconCompoentnProps {
	icon: iconType;
	from: string;
}

export default function IconComponent({ icon, from }: IconCompoentnProps) {
	const [account] = useAtom(accountAtom);
	const [selected, setSelected] = useAtom(selectedIcon);
	const [notUse, setOpenStartMenu] = useAtom(startMenuToggle);
	const [zIndex, setBigZIndex] = useAtom(changeZIndex);
	const [programList, startProgram] = useAtom(executeProgram);
	const [notUse2, closeProgram] = useAtom(exitProgram);
	const [iconList, deleteProgram] = useAtom(deleteProgramAtom);
	const [notus4, addNewIcon] = useAtom(addIconList);
	const [notUse3, modifyProgram] = useAtom(modifyProgramAtom);
	const [background] = useAtom(backgroundAtom);
	const [darkMode] = useAtom(setDarkModeAtom);
	const [resolution] = useAtom(setResolutionAtom);

	const handleClickIcon = (e: MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		setSelected(icon.name);
		setOpenStartMenu(false);
	};

	const handleOpenProgram = () => {
		setSelected('');
		setBigZIndex();
		if (!allCookie().hasOwnProperty(icon.uuid)) {
			setCookie(icon.uuid, icon.name);
			startProgram({ icon, zIndex });
		}
	};
	const dragProgram = (e: MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		const destination = document.elementFromPoint(e.clientX, e.clientY);
		const folderName = destination?.getAttribute('data-name') as string;
		const dataType = destination?.getAttribute('data-type');
		const folderIcon = iconList.find((item) => item.name === folderName) as iconType;

		if (dataType === 'trash') {
			handleDeleteProgram();
		} else if (dataType === 'document') {
			moveToDocument(folderName, folderIcon);
		} else if (dataType === '바탕화면' && folderIcon === undefined) {
			moveToDeskTop();
		}
	};

	const handleDeleteProgram = () => {
		if (
			['내 컴퓨터', '휴지통', '메모장', '그림판', '배경화면 설정', '테마 설정'].includes(
				icon.name
			)
		) {
			alert('기본프로그램은 삭제못해요!');
			return;
		}
		if (confirm('이 파일을 완전히 삭제할래요?')) {
			const deleteKey = [];
			if (icon.type === 'document') {
				icon?.containIcons?.forEach((containIcon) => {
					deleteKey.push(deleteDetail(containIcon));
				});
			}
			deleteKey.push(deleteDetail(icon));
			S3DeleteObject(deleteKey);
			alert('삭제했어요!');
		}
	};

	const deleteDetail = (iconObj: iconType) => {
		let deleteIconName = '';
		if (iconObj.type === 'document') {
			deleteIconName = iconObj.name + '.json';
		} else if (iconObj.type === 'notepad') {
			deleteIconName = `_${iconObj.notepadContent?.fontStyle}_${iconObj.notepadContent?.fontSize}_${iconObj.name}`;
		} else {
			deleteIconName = iconObj.name;
		}
		const selectProgram = programList.find((program) => program.name === iconObj.name);
		if (selectProgram !== undefined) {
			removeCookie(iconObj.uuid);
			closeProgram(selectProgram);
		}
		const key = { Key: `users/${account?.uuid}/${iconObj.type}/${deleteIconName}` };
		deleteProgram(iconObj);

		return key;
	};

	const moveToDocument = (folderName: string, folderIcon: iconType) => {
		if (icon.type === 'document') {
			alert('폴더는 다른 폴더 안으로 이동 못해요');
			return;
		}
		if (folderName === '내 컴퓨터') {
			return;
		}
		if (
			['내 컴퓨터', '휴지통', '메모장', '그림판', '배경화면 설정', '테마 설정'].includes(
				icon.name
			)
		) {
			alert('기본 프로그램은 폴더에 못넣어요!');
			return;
		}
		let cloneFolder = structuredClone(folderIcon);
		if (cloneFolder.containIcons === undefined) {
			cloneFolder.containIcons = [];
		}

		let cloneIcon = structuredClone(icon);
		cloneIcon = {
			...cloneIcon,
			from: cloneFolder.name
		};
		cloneFolder.containIcons.push(cloneIcon);

		const containIconStr = JSON.stringify(cloneFolder.containIcons);
		const bytes = new TextEncoder().encode(containIconStr);
		const cloneFolderName = cloneFolder.name;

		const uploadKey = `${account?.uuid}/document/${cloneFolderName}.json`;
		const file = new Blob([bytes], {
			type: 'application/json'
		});

		S3PutObject(file, uploadKey, 'application/json');

		modifyProgram(cloneIcon);
		modifyProgram(cloneFolder);
		deleteProgram(icon);
	};

	const moveToDeskTop = () => {
		if (icon.from === '바탕화면') {
			return;
		}
		const folderObj = iconList.find((program) => program.name === icon.from);
		const cloneFolder = structuredClone(folderObj) as iconType;
		if (cloneFolder?.containIcons !== undefined) {
			cloneFolder.containIcons = cloneFolder?.containIcons?.filter((program) => {
				return program.name !== icon.name;
			});
			if (cloneFolder.containIcons.length === 0) {
				delete cloneFolder.containIcons;
			}
		}
		let cloneIcon = structuredClone(icon);
		modifyProgram(cloneFolder);
		addNewIcon([
			{
				...cloneIcon,
				from: '바탕화면'
			}
		]);
	};

	const backgroundLight = useMemo(() => {
		if (from === 'wallpaper') {
			return (
				!['#f1da0f', '#c9cfd3'].includes(background.value) && background.type !== 'image'
			);
		} else {
			return darkMode;
		}
	}, [from, darkMode, background]);

	return (
		<>
			<Icon
				selected={selected === icon.name}
				onClick={(e) => handleClickIcon(e)}
				onDoubleClick={handleOpenProgram}
				draggable={true}
				onDragEnd={(e) => dragProgram(e)}
				resolution={resolution}>
				<Image
					src={icon.image}
					width={resolution * 30}
					height={resolution * 30}
					alt={icon.name}
					data-name={icon.name}
					data-type={icon.type}
					priority={true}
				/>
				<IconName backgroundLight={backgroundLight} resolution={resolution}>
					{icon.name}
				</IconName>
			</Icon>
		</>
	);
}

const Icon = styled.div<{ selected: boolean; resolution: number }>`
	width: ${(props) => props.resolution * 40 + 'px'};
	height: ${(props) => props.resolution * 50 + 'px'};
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	gap: ${(props) => props.resolution * 2 + 'px'};
	background: ${(props) => (props.selected ? '#8ba3d6' : 'none')};
	border: ${(props) => (props.selected ? '1px dashed purple' : 'none')};
	user-select: none;
	z-index: 101;
`;

const IconName = styled.span<{ backgroundLight: boolean; resolution: number }>`
	width: ${(props) => props.resolution * 40 + 'px'};
	min-height: ${(props) => props.resolution * 7 + 5 + 'px'};
	display: flex;
	justify-content: center;
	text-align: center;
	font-size: ${(props) => props.resolution * 0.75 + 'rem'};
	color: ${(props) => (props.backgroundLight ? '#fff' : '#000')};
	overflow: hidden;
	text-overflow: ellipsis;
	word-break: break-all;
`;
