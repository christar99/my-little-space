import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { useAtom } from 'jotai';
import { startMenuToggle } from 'store';
import { changeZIndex, memorizeProgramStyle, updateProgram } from 'store/programs';
import { programType } from 'utils/type';
import StartMenuToggle from 'components/units/StartMenuToggle';
import { VscSearch } from 'react-icons/vsc';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko');

function StartMenu() {
	const [toggleOn, setToggleOn] = useAtom(startMenuToggle);
	const [programList, changeProgram] = useAtom(updateProgram);
	const [zIndex, setBigZIndex] = useAtom(changeZIndex);
	const [memorizeList, memorizeProgram] = useAtom(memorizeProgramStyle);
	const [searchValue, setSearch] = useState<string>('');
	const [currentTime, setCurrentTime] = useState<dayjs.Dayjs>();

	const topProgram = useMemo(() => {
		let result = programList[0];
		for (let program of programList) {
			if (program.style.zIndex > result.style.zIndex) {
				result = program;
			}
		}
		return result;
	}, [programList]);

	const timeSet = useMemo(() => {
		const amPm = Number(currentTime?.format('HH')) < 12 ? '오전 ' : '오후 ';
		const time = amPm + currentTime?.format('HH:mm');
		const date = currentTime?.format('YYYY-MM-DD');

		return { time, date };
	}, [currentTime]);

	useEffect(() => {
		setCurrentTime(dayjs());
	}, []);

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
			<MainContainer>
				<StartMenuButton onClick={handleToggle}>
					<ButtonImage />
				</StartMenuButton>

				<SearchInputContainer onClick={handleToggle}>
					<SearchInput onChange={(e) => setSearch(e.target.value)} placeholder="찾기" />
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
								<Image
									src={program.image}
									width={25}
									height={25}
									alt="program icon"
								/>
							</ProgmamIcon>
						);
					})}
				</RunningProgram>
				{toggleOn && <StartMenuToggle searchValue={searchValue} />}
			</MainContainer>
			<TimeContainer>
				<TimeSet>{timeSet.time}</TimeSet>
				<DateSet>{timeSet.date}</DateSet>
			</TimeContainer>
		</MenuContainer>
	);
}

const MenuContainer = styled.div`
	width: 100%;
	height: 40px;
	background-color: ${(props) => props.theme.startMenu.menuContainer};
	position: absolute;
	bottom: 0;
	z-index: 101;
	display: flex;
	justify-content: space-between;
`;

const MainContainer = styled.div`
	display: flex;
`;

const StartMenuButton = styled.div`
	width: 48px;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;

	:hover {
		background: ${(props) => props.theme.startMenu.startMenuButton};
	}
`;

const ButtonImage = styled.button`
	width: 17px;
	height: 17px;
	border: none;
	background: ${(props) => props.theme.startMenu.buttonImage};
	mask-image: url('/window_logo.png');
	-webkit-mask-box-image: url('/window_logo.png');
	background-position: center center;

	:hover {
		background: ${(props) => props.theme.startMenu.startMenuHover};
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
		color: ${(props) => props.theme.startMenu.buttonImage};
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
	color: ${(props) => props.theme.startMenu.searchInputText};
	background-color: ${(props) => props.theme.startMenu.searchInput};
	padding-left: 35px;

	::placeholder {
		color: ${(props) => props.theme.startMenu.searchInputText};
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
	background-color: ${(props) =>
		props.topProgram ? props.theme.startMenu.runningTop : props.theme.startMenu.runningProgram};

	:hover {
		background-color: ${(props) =>
			props.topProgram
				? props.theme.startMenu.runningTopHover
				: props.theme.startMenu.runningHover};
		cursor: pointer;
	}
`;

const TimeContainer = styled.div`
	height: 100%;
	margin-right: 20px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	color: ${(props) => props.theme.startMenu.searchInputText};
	font-size: 1.5rem;
`;

const TimeSet = styled.div``;

const DateSet = styled.div``;

export default StartMenu;
