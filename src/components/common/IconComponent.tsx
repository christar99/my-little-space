import React, { MouseEvent } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { useAtom } from 'jotai';
import { deleteProgramAtom, modifyProgramAtom, selectedIcon, startMenuToggle } from 'store';
import { changeZIndex, executeProgram, exitProgram } from 'store/programs';
import { allCookie, removeCookie, setCookie } from 'utils/Cookie';
import { iconType } from 'utils/type';
import { S3DeleteObject, S3PutObject } from 'utils/aws';
import { uuid } from 'utils/common';

interface IconCompoentnProps {
	icon: iconType;
	from: string;
}

export default function IconComponent({ icon, from }: IconCompoentnProps) {
	const [selected, setSelected] = useAtom(selectedIcon);
	const [notUse, setOpenStartMenu] = useAtom(startMenuToggle);
	const [zIndex, setBigZIndex] = useAtom(changeZIndex);
	const [programList, startProgram] = useAtom(executeProgram);
	const [notUse2, closeProgram] = useAtom(exitProgram);
	const [iconList, deleteProgram] = useAtom(deleteProgramAtom);
	const [notUse3, modifyProgram] = useAtom(modifyProgramAtom);

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
		const destination = document.elementFromPoint(e.clientX, e.clientY);
		if (destination?.getAttribute('data-type') === 'trash_can') {
			handleDeleteProgram();
		} else if (destination?.getAttribute('data-type') === 'document') {
			moveToDocument(destination);
		} else if (
			destination?.getAttribute('data-type') === 'desktop' &&
			iconList.find((program) => program.name === icon.name) === undefined
		) {
			moveToDeskTop();
		}
	};

	const handleDeleteProgram = () => {
		if (['내 컴퓨터', '휴지통', '메모장', '그림판'].includes(icon.name)) {
			alert('기본프로그램은 삭제못해요!');
			return;
		}
		if (confirm('이 파일을 완전히 삭제할래요?')) {
			let iconName = '';
			iconName =
				icon.notepadContent === undefined
					? icon.name
					: `_${icon.notepadContent.fontStyle}_${icon.notepadContent.fontSize}_${icon.name}`;
			if (icon.type === 'document') {
				iconName += '.json';
			}
			const selectProgram = programList.find((program) => program.name === icon.name);
			const account = JSON.parse(localStorage.getItem('account') as string);
			S3DeleteObject(`users/${account.uuid}/${icon.type}/${iconName}`);
			if (selectProgram !== undefined) {
				removeCookie(icon.uuid);
				closeProgram(selectProgram);
			}
			deleteProgram(icon);
		}
	};

	const moveToDocument = (element: Element) => {
		const iconName = element.getAttribute('alt');
		let iconObj = iconList.find((item) => item.name === iconName) as iconType;
		if (iconName === '내 컴퓨터') {
			return;
		}
		if (['내 컴퓨터', '휴지통', '메모장', '그림판'].includes(icon.name)) {
			alert('기본 프로그램은 폴더에 못넣어요!');
			return;
		}

		let cloneIcon = structuredClone(iconObj);
		if (cloneIcon.containIcons === undefined) {
			cloneIcon.containIcons = [];
		}
		cloneIcon.containIcons.push(icon);

		const containIconStr = JSON.stringify(cloneIcon.containIcons);
		const bytes = new TextEncoder().encode(containIconStr);
		const folderName = cloneIcon.name;

		const uploadKey = `${uuid}/document/${folderName}.json`;
		const file = new Blob([bytes], {
			type: 'application/json'
		});

		S3PutObject(file, uploadKey, 'application/json');

		modifyProgram(cloneIcon);
		deleteProgram(icon);
	};

	const moveToDeskTop = () => {};

	return (
		<>
			<Icon
				selected={selected === icon.name}
				onClick={(e) => handleClickIcon(e)}
				onDoubleClick={handleOpenProgram}
				draggable={true}
				onDragEnd={(e) => dragProgram(e)}>
				<Image
					src={icon.image}
					width={60}
					height={60}
					priority={true}
					alt={icon.name}
					data-type={icon.type}
				/>
				<IconName from={from}>{icon.name}</IconName>
			</Icon>
		</>
	);
}

const Icon = styled.div<{ selected: boolean }>`
	width: 80px;
	height: 100px;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	gap: 5px;
	background: ${(props) => (props.selected ? '#8ba3d6' : 'none')};
	border: ${(props) => (props.selected ? '1px dashed purple' : 'none')};
	user-select: none;
	z-index: 101;
`;

const IconName = styled.span<{ from: string }>`
	width: 80px;
	min-height: 18px;
	display: flex;
	justify-content: center;
	text-align: center;
	font-size: 1.5rem;
	color: ${(props) => (props.from === 'wallpaper' ? '#fff' : '#000')};
	overflow: hidden;
	text-overflow: ellipsis;
	word-break: break-all;
`;
