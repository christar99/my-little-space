import React, { useState, useMemo, useEffect, MouseEvent } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { useAtom } from 'jotai';
import { addIconList, startMenuToggle } from 'store';
import { changeZIndex, executeProgram, memorizeProgramStyle, updateProgram } from 'store/programs';
import { programType } from 'utils/type';
import { allCookie, setCookie } from 'utils/Cookie';
import { S3PutObject } from 'utils/aws';
import { uuid } from 'utils/common';
import { v4 as uuidv4 } from 'uuid';
import { VscSearch } from 'react-icons/vsc';
import { FiPower } from 'react-icons/fi';
import { SlSettings } from 'react-icons/sl';
import { IoDocumentOutline } from 'react-icons/io5';

function StartMenu() {
	const [toggleOn, setToggleOn] = useAtom(startMenuToggle);
	const [iconList, addNewIcon] = useAtom(addIconList);
	const [notUse, startProgram] = useAtom(executeProgram);
	const [programList, changeProgram] = useAtom(updateProgram);
	const [zIndex, setBigZIndex] = useAtom(changeZIndex);
	const [memorizeList, memorizeProgram] = useAtom(memorizeProgramStyle);
	const [newFolderToggle, openNewFolderToggle] = useState<boolean>(false);
	const [newFolderName, setNewFolderName] = useState<string>('');

	const topProgram = useMemo(() => {
		let result = programList[0];
		for (let program of programList) {
			if (program.style.zIndex > result.style.zIndex) {
				result = program;
			}
		}
		return result;
	}, [programList]);

	useEffect(() => {
		openNewFolderToggle(false);
	}, [toggleOn]);

	const handleToggle = () => {
		setToggleOn(!toggleOn);
	};

	const handleExecuteProgram = (program: programType) => {
		setBigZIndex();
		if (program.style.minimization) {
			const memorized = memorizeList.find((memorize) => program.name === memorize.name);
			if (memorized !== undefined) {
				changeProgram({
					program,
					type: 'restoration',
					value: [
						memorized.width,
						memorized.height,
						memorized.top,
						memorized.left,
						zIndex
					]
				});
			}
			memorizeProgram({ program, type: 'delete' });
		} else {
			if (topProgram.name === program.name) {
				memorizeProgram({ program, type: 'add' });
				changeProgram({
					program,
					type: 'minimize'
				});
			} else {
				changeProgram({ program, type: 'zIndex', value: [zIndex] });
			}
		}
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

		const file = new Blob([], {
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

	const handleClose = () => {
		if (confirm('정말 종료하시겠습니까?')) {
			window.close();
		}
	};

	return (
		<MenuContainer>
			<StartMenuButton onClick={handleToggle}>
				<ButtonImage />
			</StartMenuButton>

			<SearchInputContainer onClick={handleToggle}>
				<SearchInput placeholder="찾기" />
				<VscSearch />
			</SearchInputContainer>
			<RunningProgram>
				{programList.map((program, index) => {
					return (
						<ProgmamIcon
							key={index}
							onClick={() => handleExecuteProgram(program)}
							topProgram={
								!program.style.minimization && topProgram.name === program.name
							}>
							<Image src={program.image} width={25} height={25} alt="program icon" />
						</ProgmamIcon>
					);
				})}
			</RunningProgram>
			{toggleOn && (
				<MenuToggle>
					<SideMenu>
						<SideMenuButton
							title="새 폴더"
							onClick={() => openNewFolderToggle(!newFolderToggle)}>
							<IoDocumentOutline />
							{newFolderToggle && (
								<CreateNewFolder>
									<NewFolderInput
										placeholder="새폴더 이름"
										onClick={(e) => e.stopPropagation()}
										onChange={(e) => setNewFolderName(e.target.value)}
									/>
									<ConfirmButton onClick={(e) => createNewFolder(e)}>
										확인
									</ConfirmButton>
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
				</MenuToggle>
			)}
		</MenuContainer>
	);
}

const MenuContainer = styled.div`
	width: 100%;
	height: 40px;
	background-color: #222;
	position: absolute;
	bottom: 0;
	z-index: 101;
	display: flex;
`;

const StartMenuButton = styled.div`
	width: 48px;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;

	:hover {
		background: #111;
	}
`;

const ButtonImage = styled.button`
	width: 17px;
	height: 17px;
	border: none;
	background: #fff;
	mask-image: url('/window_logo.png');
	-webkit-mask-box-image: url('/window_logo.png');
	background-position: center center;

	:hover {
		background: skyblue;
	}
`;

const SearchInputContainer = styled.div`
	width: 300px;
	height: 100%;
	position: relative;
	display: flex;
	align-items: center;

	svg {
		width: 15px;
		height: 15px;
		color: #fff;
		position: absolute;
		left: 13px;
	}
`;

const SearchInput = styled.input`
	width: 100%;
	height: 100%;
	border: 1px solid rgba(0, 0, 0, 0.7);
	font-size: 1.5rem;
	font-weight: lighter;
	color: #fff;
	background-color: #666;
	padding-left: 35px;

	::placeholder {
		color: #fff;
		font-size: 1.5rem;
	}

	:focus {
		outline: none;
	}
`;

const RunningProgram = styled.div`
	display: flex;
	gap: 2px;
`;

const ProgmamIcon = styled.div<{ topProgram: boolean }>`
	width: 50px;
	height: 40px;
	padding: 0 2px;
	display: flex;
	justify-content: center;
	align-items: center;
	border-bottom: 2px solid skyblue;
	background-color: ${(props) => (props.topProgram ? '#444' : 'inherit')};

	:hover {
		background-color: ${(props) => (props.topProgram ? '#555' : '#333')};
		cursor: pointer;
	}
`;

const MenuToggle = styled.div`
	width: 348px;
	height: 500px;
	position: absolute;
	z-index: 101;
	left: 0;
	bottom: 40px;
	background-color: #444;
	display: flex;
`;

const SideMenu = styled.div`
	width: 48px;
	height: 100%;
	background-color: #333;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	color: #fff;
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
		background-color: #2d2d2d;
		cursor: pointer;
	}
`;

const CreateNewFolder = styled.div`
	width: 250px;
	height: 48px;
	background-color: #333;
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
	background-color: #aaa;
	border: none;

	::placeholder {
		color: #222;
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
	background-color: #ddd;

	:focus {
		background-color: #bbb;
	}

	:hover {
		cursor: pointer;
	}
`;

export default StartMenu;
