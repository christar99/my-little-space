import React, { useState, useEffect, useCallback, MouseEvent } from 'react';
import Image from 'next/image';
import { useAtom } from 'jotai';
import styled from 'styled-components';
import { deleteProgramAtom, iconList, startMenuToggle } from 'store';
import { executeProgram, changeZIndex, exitProgram } from 'store/programs';
import { iconType } from 'utils/type';
import { allCookie, setCookie, removeCookie } from 'utils/Cookie';
import { S3DeleteObject, S3GetObject, S3ListObject } from 'utils/aws';

interface ListObjectProps {
	ChecksumAlgorithm?: string;
	ETag: string;
	Key: string;
	LastModified: Date;
	Owner?: string;
	Size: number;
	StorageClass: String;
}

function Icons() {
	const [openStartMenu, setOpenStartMenu] = useAtom(startMenuToggle);
	const [icons, addNewIcon] = useAtom(iconList);
	const [notUse, closeProgram] = useAtom(exitProgram);
	const [programList, startProgram] = useAtom(executeProgram);
	const [notUse2, deleteProgram] = useAtom(deleteProgramAtom);
	const [zIndex, setBigZIndex] = useAtom(changeZIndex);
	const [selected, setSelected] = useState<number>(0);

	useEffect(() => {
		getS3Objects();
		const openedProgram = allCookie();
		for (let name in openedProgram) {
			const icon = icons.find((icon) => icon.value === name);
			if (icon !== undefined) {
				setBigZIndex();
				startProgram({ icon, zIndex });
			}
		}
	}, []);

	const getS3Objects = useCallback(async () => {
		const s3Objects = await S3ListObject();
		if (s3Objects === undefined || s3Objects.length === 0) {
			return;
		}
		let promises = [];
		let notepadContentProps = [];
		for (let object of s3Objects as ListObjectProps[]) {
			promises.push(S3GetObject(object?.Key));
			notepadContentProps.push([object?.Key.split('_')]);
		}
		const notepadObject = await Promise.all(promises);

		promises = [];
		for (let object of notepadObject) {
			promises.push(object.Body?.transformToString());
		}
		const notepadContent = await Promise.all(promises);

		let notepadProps: iconType[] = [];
		notepadContentProps.forEach((props, index) => {
			notepadProps.push({
				name: props[0][3],
				value: 'notepad',
				image: '/icons/notepad.png',
				type: 'notepad',
				notepadContent: {
					content: notepadContent[index] as string,
					fontSize: Number(props[0][2]),
					fontStyle: props[0][1]
				}
			});
		});
		addNewIcon([...notepadProps]);
	}, []);

	const handleClickIcon = (e: MouseEvent<HTMLDivElement>, n: number) => {
		e.stopPropagation();
		setSelected(n);
		setOpenStartMenu(false);
	};

	const handleOpenProgram = useCallback(
		(icon: iconType) => {
			setSelected(0);
			setBigZIndex();
			if (!allCookie().hasOwnProperty(icon.value)) {
				setCookie(icon.value, icon.type);
				startProgram({ icon, zIndex });
			}
		},
		[startProgram]
	);

	const removeProgram = (e: MouseEvent<HTMLDivElement>, icon: iconType) => {
		if (['내 컴퓨터', '휴지통', '메모장', '그림판'].includes(icon.name)) {
			alert('기본프로그램은 삭제못해요!');
			return;
		}
		if (e.clientX > 50 && e.clientX < 150 && e.clientY > 210 && e.clientY < 340) {
			if (confirm('이 파일을 완전히 삭제할래요?')) {
				let iconName =
					icon.notepadContent === undefined
						? ''
						: `_${icon.notepadContent.fontStyle}_${icon.notepadContent.fontSize}_${icon.name}`;
				const selectProgram = programList.find((program) => program.name === icon.name);
				if (selectProgram !== undefined) {
					removeCookie(icon.value);
					closeProgram(selectProgram);
				}
				const account = JSON.parse(localStorage.getItem('account') as string);
				S3DeleteObject(`users/${account.uuid}/${icon.type}/${iconName}`);
				deleteProgram(icon);
				alert('삭제했어요!');
			}
		}
	};

	return (
		<Desktop onClick={(e) => handleClickIcon(e, 0)}>
			{icons.map((icon, index) => {
				return (
					<Icon
						key={index}
						selected={selected === index + 1}
						onClick={(e) => handleClickIcon(e, index + 1)}
						onDoubleClick={() => handleOpenProgram(icon)}
						draggable={true}
						onDragEnd={(e) => removeProgram(e, icon)}>
						<Image
							src={icon.image}
							width={80}
							height={80}
							alt={icon.name}
							priority={true}
						/>
						<IconName>{icon.name}</IconName>
					</Icon>
				);
			})}
		</Desktop>
	);
}

const Desktop = styled.div`
	width: 100%;
	height: calc(100% - 40px);
	padding: 50px;
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	align-content: flex-start;
	gap: 30px;
	position: absolute;
	z-index: 100;
`;

const Icon = styled.div<{ selected: boolean }>`
	width: 100px;
	height: 130px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 10px;
	background: ${(props) => (props.selected ? '#3B5998' : 'none')};
	border: ${(props) => (props.selected ? '1px dashed purple' : 'none')};
	user-select: none;
	z-index: 101;
`;

const IconName = styled.span`
	width: 100px;
	max-height: 35px;
	display: flex;
	justify-content: center;
	font-size: 1.7rem;
	color: #fff;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: no-wrap;
	word-break: break-all;
`;

export default Icons;
