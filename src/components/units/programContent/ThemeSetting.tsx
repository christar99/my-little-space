import React, { ChangeEvent, useEffect } from 'react';
import styled from 'styled-components';
import { useAtom } from 'jotai';
import { setDarkModeAtom } from 'store';
import { removeCookie } from 'utils/Cookie';
import { exitProgram } from 'store/programs';

export default function ThemeSetting() {
	const [darkMode, setDarkMode] = useAtom(setDarkModeAtom);
	const [programList, closeProgram] = useAtom(exitProgram);

	useEffect(() => {
		const myComputer = programList.find((program) => program.name === '내 컴퓨터');
		if (myComputer !== undefined) {
			closeProgram(myComputer);
			removeCookie(myComputer.uuid);
		}
	}, []);

	const changeMode = (e: ChangeEvent<HTMLInputElement>) => {
		localStorage.setItem('darkMode', String(e.target.checked));
		setDarkMode(e.target.checked);
	};

	return (
		<ThemeContainer>
			<Title>테마</Title>
			<ColorTheme>
				<Label>
					<ModeName>{darkMode ? '다크모드' : '라이트모드'}</ModeName>
					<Switch
						type="checkbox"
						onChange={(e) => changeMode(e)}
						defaultChecked={darkMode}
					/>
				</Label>
			</ColorTheme>
		</ThemeContainer>
	);
}

const ThemeContainer = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	gap: 30px;
	padding: 20px 30px;
	color: ${(props) => props.theme.program.textColor};
`;

const Title = styled.span`
	font-size: 3rem;
`;

const ColorTheme = styled.div``;

const Label = styled.label`
	width: 180px;
	display: inline-flex;
	align-items: center;
	justify-content: space-between;
`;

const Switch = styled.input`
	appearance: none;
	position: relative;
	border: max(2px, 1px) solid ${(props) => props.theme.program.textColor};
	border-radius: 30px;
	width: 60px;
	height: 30px;

	:hover {
		cursor: pointer;
		box-shadow: 0 0 0 max(3px, 2px) ${(props) => props.theme.program.textHover};
	}

	::before {
		content: '';
		position: absolute;
		left: 0;
		width: 27px;
		height: 27px;
		border-radius: 50%;
		transform: scale(0.8);
		background-color: ${(props) => props.theme.program.textColor};
		transition: left 150ms linear;
	}

	:checked {
		::before {
			left: 28px;
		}
	}
`;

const ModeName = styled.span`
	font-size: 2.2rem;
	font-weight: 700;
	letter-spacing: -1px;
`;
