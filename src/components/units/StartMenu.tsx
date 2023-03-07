import React, { useMemo } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { useAtom } from 'jotai';
import { startMenuToggle } from 'store';
import { changeZIndex, memorizeProgramStyle, programList, updateProgram } from 'store/programs';
import { programType } from 'utils/type';
import { VscSearch } from 'react-icons/vsc';
import { FiPower } from 'react-icons/fi';
import { SlSettings } from 'react-icons/sl';
import { IoDocumentOutline } from 'react-icons/io5';

function StartMenu() {
	const [toggleOn, setToggleOn] = useAtom(startMenuToggle);
	const [programList, changeProgram] = useAtom(updateProgram);
	const [zIndex, setBigZIndex] = useAtom(changeZIndex);
	const [memorizeList, memorizeProgram] = useAtom(memorizeProgramStyle);
	const topProgram = useMemo(() => {
		let result = programList[0];
		for (let program of programList) {
			if (program.style.zIndex > result.style.zIndex) {
				result = program;
			}
		}
		return result;
	}, [programList]);

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
						<SideMenuButton title="문서">
							<IoDocumentOutline />
						</SideMenuButton>
						<SideMenuButton title="설정">
							<SlSettings />
						</SideMenuButton>
						<SideMenuButton title="종료">
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

	:hover {
		background-color: #2d2d2d;
		cursor: pointer;
	}
`;

export default StartMenu;
