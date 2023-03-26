import React, { ChangeEvent, useEffect } from 'react';
import styled from 'styled-components';
import { useAtom } from 'jotai';
import { setDarkModeAtom, setFontStyleAtom, setResolutionAtom } from 'store';
import { removeCookie } from 'utils/Cookie';
import { exitProgram } from 'store/programs';
import { fontStyle } from 'utils/common';
import { fontStyleProps } from 'utils/type';

export default function ThemeSetting() {
	const [programList, closeProgram] = useAtom(exitProgram);
	const [darkMode, setDarkMode] = useAtom(setDarkModeAtom);
	const [resolution, setResolution] = useAtom(setResolutionAtom);
	const [notUse, setFontStyle] = useAtom(setFontStyleAtom);

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

	const changeResolution = (e: ChangeEvent<HTMLInputElement>) => {
		setResolution(Number(e.target.value));
		localStorage.setItem('resolution', e.target.value);
	};

	const changeFontStyle = (font: fontStyleProps) => {
		setFontStyle(font);
		localStorage.setItem('fontStyle', JSON.stringify(font));
	};

	return (
		<ThemeContainer>
			<Title>테마</Title>
			<ColorTheme>
				<Label>
					<SubTitle>{darkMode ? '다크모드' : '라이트모드'}</SubTitle>
					<Switch
						type="checkbox"
						onChange={(e) => changeMode(e)}
						defaultChecked={darkMode}
					/>
				</Label>
			</ColorTheme>
			<Resolution>
				<SubTitle>해상도</SubTitle>
				<RangeInput
					type="range"
					min="1"
					max="4"
					defaultValue={resolution}
					step="1"
					onChange={(e) => changeResolution(e)}
				/>
			</Resolution>
			<SubTitle>글꼴</SubTitle>
			<FontStyleContainer>
				{fontStyle.map((font, index) => {
					return (
						<FontStyle
							key={index}
							fontStyle={font.value[0] + ', ' + font.value[1]}
							onClick={() => changeFontStyle(font)}>
							<FontName>{font.name}</FontName>
							<FontExample>
								로렘 입숨은 출판이나 그래픽 디자인 분야에서...
								<br />
								Lorem Ipsum is simply dummy text of the...
								<br />
								1234567890;!@#$%^&*
							</FontExample>
						</FontStyle>
					);
				})}
			</FontStyleContainer>
		</ThemeContainer>
	);
}

const ThemeContainer = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	overflow-y: auto;
	flex-direction: column;
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

const SubTitle = styled.span`
	font-size: 2.2rem;
	font-weight: 700;
	letter-spacing: -1px;
`;

const Resolution = styled.div`
	width: 270px;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const RangeInput = styled.input`
	width: 150px;
`;

const FontStyleContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	margin-top: -20px;
	gap: 10px;
	align-items: center;
`;

const FontStyle = styled.div<{ fontStyle: string }>`
	width: 370px;
	border: 1px solid ${(props) => props.theme.program.borderColor};
	font-family: ${(props) => props.fontStyle};

	:hover {
		cursor: pointer;
	}
`;

const FontName = styled.span`
	display: block;
	font-size: 2rem;
	padding: 5px;
	border-bottom: 1px solid ${(props) => props.theme.program.borderColor};
	background-color: #3b5998;
`;

const FontExample = styled.p`
	font-size: 1.5rem;
	padding: 5px;
	line-height: 30px;
`;
