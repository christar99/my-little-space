import React, { useState, useRef, useEffect, MouseEvent, useMemo } from 'react';
import styled from 'styled-components';
import { useAtom } from 'jotai';
import { startMenuToggle } from 'store';
import { addIconList } from 'store/icons';
import { changeZIndex, executeProgram, updateProgram } from 'store/programs';
import { uuid } from 'utils/common';
import { S3PutObject } from 'utils/aws';
import { allCookie, setCookie } from 'utils/Cookie';
import { iconType, programType } from 'utils/type';
import { v4 as uuidv4 } from 'uuid';
import { FiPower } from 'react-icons/fi';
import { SlSettings } from 'react-icons/sl';
import { IoDocumentOutline } from 'react-icons/io5';
import Image from 'next/image';

interface StartMenuToggleProps {
	searchValue: string;
}

export default function StartMenuToggle({ searchValue }: StartMenuToggleProps) {
	const [zIndex, setBigZIndex] = useAtom(changeZIndex);
	const [programList, changeProgram] = useAtom(updateProgram);
	const [iconList, addNewIcon] = useAtom(addIconList);
	const [notUse, startProgram] = useAtom(executeProgram);
	const [toggleOn, setToggleOn] = useAtom(startMenuToggle);
	const [newFolderToggle, openNewFolderToggle] = useState<boolean>(false);
	const newFolderRef = useRef<HTMLInputElement>(null);
	const [newFolderName, setNewFolderName] = useState<string>('');

	const searchList = useMemo(() => {
		const containIcons = iconList.filter((icon) => icon.containIcons !== undefined);
		let allProgram = structuredClone(iconList);
		containIcons.forEach((icon) => {
			if (icon.containIcons !== undefined) {
				allProgram = allProgram.concat(icon.containIcons);
			}
		});

		const result = allProgram.filter((icon) => icon.name.includes(searchValue));

		return result;
	}, [searchValue]);

	useEffect(() => {
		openNewFolderToggle(false);
	}, [toggleOn]);

	useEffect(() => {
		if (newFolderToggle) {
			newFolderRef.current?.focus();
		}
	}, [newFolderToggle]);

	const handleToggle = () => {
		setToggleOn(!toggleOn);
	};

	const clickStartProgram = (icon: iconType) => {
		setBigZIndex();
		startProgram({ icon, zIndex });
		setToggleOn(false);
	};

	const openMyComputer = () => {
		setBigZIndex();
		const setting = iconList[0];
		if (!allCookie().hasOwnProperty(setting.uuid)) {
			setCookie(setting.uuid, setting.name);
			startProgram({ icon: setting, zIndex });
		} else {
			const settingProgram = programList.find((program) => program.name === setting.name);
			changeProgram({
				program: settingProgram as programType,
				type: 'zIndex',
				value: [zIndex]
			});
		}
		setToggleOn(false);
	};

	const createNewFolder = (e: MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		const reg = /[\{\}\[\]\/?,;:|\)*~`!^\+<>@\#$%&\\\=\(\'\"]/g;
		if (newFolderName === '') {
			alert('이름을 작성해주세요!');
			return;
		}

		if (iconList.find((icon) => icon.name === newFolderName) !== undefined) {
			alert('중복된 이름이 있습니다!');
			return;
		}
		if (reg.test(newFolderName)) {
			alert('특수문자는 언더바(_), 하이픈(-), 점(.)만 가능해요! (공백문자 불가)');
			return;
		}

		const uploadKey = `${uuid}/document/${newFolderName}.json`;
		const bytes = new TextEncoder().encode('[]');
		const file = new Blob([bytes], {
			type: 'application/json'
		});

		S3PutObject(file, uploadKey, 'application/json');
		addNewIcon([
			{
				name: newFolderName,
				uuid: uuidv4(),
				image: '/icons/newFolder.png',
				type: 'document',
				from: 'desktop'
			}
		]);
		handleToggle();
	};

	const handleClose = () => {
		if (confirm('정말 종료하시겠습니까?')) {
			window.close();
		}
	};

	return (
		<MenuToggle>
			<SideMenu>
				<SideMenuButton
					title="새 폴더"
					onClick={() => openNewFolderToggle(!newFolderToggle)}>
					<IoDocumentOutline />
					{newFolderToggle && (
						<CreateNewFolder>
							<NewFolderInput
								ref={newFolderRef}
								placeholder="새폴더 이름"
								onClick={(e) => e.stopPropagation()}
								onChange={(e) => setNewFolderName(e.target.value)}
							/>
							<ConfirmButton onClick={(e) => createNewFolder(e)}>확인</ConfirmButton>
						</CreateNewFolder>
					)}
				</SideMenuButton>
				<SideMenuButton title="내컴퓨터 설정" onClick={openMyComputer}>
					<SlSettings />
				</SideMenuButton>
				<SideMenuButton title="종료" onClick={handleClose}>
					<FiPower />
				</SideMenuButton>
			</SideMenu>
			<SearchProgram>
				{searchList.map((icon, index) => {
					return (
						<Program key={index} onClick={() => clickStartProgram(icon)}>
							<Image src={icon.image} width={30} height={30} alt={icon.name} />
							<ProgramName>{icon.name}</ProgramName>
						</Program>
					);
				})}
			</SearchProgram>
		</MenuToggle>
	);
}

const MenuToggle = styled.div`
	width: 348px;
	height: 500px;
	position: absolute;
	z-index: 101;
	left: 0;
	bottom: 40px;
	background-color: ${(props) => props.theme.startMenu.runningProgram};
	display: flex;
`;

const SideMenu = styled.div`
	width: 48px;
	height: 100%;
	background-color: ${(props) => props.theme.startMenu.runningHover};
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	color: ${(props) => props.theme.startMenu.searchInputText}; ;
`;

const SideMenuButton = styled.div`
	width: 100%;
	height: 48px;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 2rem;
	position: relative;

	:hover {
		background-color: ${(props) => props.theme.startMenu.sideMenuHover};
		cursor: pointer;
	}
`;

const CreateNewFolder = styled.div`
	width: 250px;
	height: 48px;
	background-color: ${(props) => props.theme.startMenu.runningHover};
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	gap: 10px;
	left: 48px;
`;

const NewFolderInput = styled.input`
	width: 180px;
	height: 30px;
	padding: 0 5px;
	font-size: 1.5rem;
	background-color: ${(props) => props.theme.startMenu.searchInput};
	border: none;
	color: ${(props) => props.theme.startMenu.searchInputText};

	::placeholder {
		color: ${(props) => props.theme.startMenu.searchInputText};
	}

	:focus {
		outline: none;
	}
`;

const ConfirmButton = styled.button`
	width: 50px;
	height: 30px;
	border: none;
	font-size: 1.4rem;
	font-weight: 700;
	background-color: ${(props) => props.theme.startMenu.confirmButton};

	:focus {
		background-color: #bbb;
	}

	:hover {
		cursor: pointer;
	}
`;

const SearchProgram = styled.div`
	width: calc(100% - 48px);
	height: 100%;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
`;

const Program = styled.div`
	width: 100%;
	height: 48px;
	padding: 0 10px;
	border-top: 1px solid ${(props) => props.theme.startMenu.confirmButton};
	display: flex;
	align-items: center;
	gap: 20px;

	:hover {
		background-color: ${(props) => props.theme.startMenu.runningTopHover};
		cursor: default;
	}
`;

const ProgramName = styled.span`
	font-size: 1.7rem;
	color: ${(props) => props.theme.startMenu.confirmButton};
`;
