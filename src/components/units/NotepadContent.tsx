import React, { useState, useEffect, useRef, MouseEvent, ChangeEvent } from 'react';
import styled from 'styled-components';
import { programType } from 'utils/type';
import { AiOutlineClose } from 'react-icons/ai';

interface NotepadContentProps {
	program: programType;
}

interface signitureIndexProps {
	[key: string]: string;
}

interface fontStyleProps {
	name: string;
	value: string[];
}

const settingValue: signitureIndexProps = {
	fontStyle: '글꼴',
	fontSize: '글자 크기'
};

const fontStyle: fontStyleProps[] = [
	{ name: '바탕', value: ['Noto Serif KR', 'serif'] },
	{ name: '고딕', value: ['Nanum Gothic', 'sans-serif'] },
	{ name: '명조', value: ['Nanum Myeongjo', 'serif'] },
	{ name: '펜스크립트', value: ['Nanum Pen Script', 'cursive'] },
	{ name: '싱글데이', value: ['Single Day', 'cursive'] },
	{ name: '블랙한스', value: ['Black Han Sans', 'sans-serif'] },
	{ name: '주아', value: ['Jua', 'sans-serif'] }
];

function NotepadContent({ program }: NotepadContentProps) {
	const [dropDownMenu, setDropDownMenu] = useState<string | null>(null);
	const [modalOpen, setModalOpen] = useState<string | null>(null);
	const [fontSize, setFontSize] = useState<number>(15);
	const fontSizeRef = useRef<HTMLInputElement>(null);
	const [selectFontStyle, setFontStyle] = useState<fontStyleProps>({
		name: '바탕',
		value: ['Noto Serif KR', 'serif']
	});
	const handleDropDown = (e: MouseEvent, name: string | null) => {
		e.preventDefault();
		setDropDownMenu(name);
	};
	const handleModalOpen = (name: string) => {
		setModalOpen(name);
	};

	useEffect(() => {
		setDropDownMenu(null);
	}, [modalOpen]);

	const changeFontStyle = (e: ChangeEvent<HTMLSelectElement>) => {
		const selectStyle = fontStyle.find((font) => font.value[0] === e.target.value);
		if (selectStyle !== undefined) {
			setFontStyle(selectStyle);
		}
	};

	const confirmSetting = () => {
		if (modalOpen === 'fontSize' && fontSizeRef.current !== null) {
			setFontSize(Number(fontSizeRef.current.value));
		}
		setModalOpen(null);
	};
	return (
		<NotepadContainer>
			<SettingLine>
				<SettingMenu
					background={dropDownMenu === 'file'}
					onClick={(e) => handleDropDown(e, 'file')}>
					파일
				</SettingMenu>
				<SettingMenu
					background={dropDownMenu === 'form'}
					onClick={(e) => handleDropDown(e, 'form')}>
					서식
					{dropDownMenu === 'form' && (
						<Dropdown>
							<DetailMenu onClick={() => handleModalOpen('fontStyle')}>
								글꼴
							</DetailMenu>
							<DetailMenu onClick={() => handleModalOpen('fontSize')}>
								글자크기
							</DetailMenu>
						</Dropdown>
					)}
				</SettingMenu>
			</SettingLine>
			<TextArea
				fontSize={fontSize}
				fontFamily={selectFontStyle}
				onClick={(e) => handleDropDown(e, null)}></TextArea>
			{modalOpen !== null && (
				<SettingModal>
					<ModalHead>
						<span>{settingValue[modalOpen]}</span>
						<AiOutlineClose onClick={() => setModalOpen(null)} />
					</ModalHead>
					<ModalContent>
						{modalOpen === 'fontSize' && (
							<Input ref={fontSizeRef} defaultValue={fontSize} />
						)}
						{modalOpen === 'fontStyle' && (
							<Select onChange={(e) => changeFontStyle(e)}>
								{fontStyle.map((font, index) => {
									return (
										<option
											selected={selectFontStyle.name === font.name}
											value={font.value[0]}
											key={index}>
											{font.name}
										</option>
									);
								})}
							</Select>
						)}
						<ConfirmButton onClick={confirmSetting}>확인</ConfirmButton>
					</ModalContent>
				</SettingModal>
			)}
		</NotepadContainer>
	);
}

const NotepadContainer = styled.div`
	width: 100%;
	height: calc(100% - 40px);
`;

const SettingLine = styled.div`
	width: 100%;
	height: 25px;
	border-bottom: 1px solid rgba(0, 0, 0, 0.5);
	display: flex;
`;

const SettingMenu = styled.div<{ background: boolean }>`
	width: 50px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	font-size: 1.2rem;
	position: relative;
	background-color: ${(props) => (props.background ? '#b2d8e7' : 'inherit')};
	user-select: none;

	:hover {
		cursor: default;
		border: 1px solid skyblue;
		background-color: #b2d8e7;
	}
`;

const Dropdown = styled.div`
	width: 150px;
	position: absolute;
	left: 0;
	top: 25px;
	border: 1px solid #ccc;
	background-color: #f7eff2;
	box-shadow: 5px 5px 5px #555;
`;
const DetailMenu = styled.div`
	width: 100%;
	height: 20px;
	display: flex;
	justify-content: center;
	align-items: center;

	:hover {
		border: 1px solid skyblue;
		background-color: #b2d8e7;
	}
`;

const TextArea = styled.textarea<{ fontSize: number; fontFamily: fontStyleProps }>`
	width: 100%;
	height: calc(100% - 25px);
	border: none;
	resize: none;
	font-size: ${(props) => props.fontSize / 10 + 'rem'};
	font-family: ${(props) => props.fontFamily.value[0] + ', ' + props.fontFamily.value[1]};
	/* font-family: 'Single Day', cursive; */

	:focus {
		outline: none;
	}
`;

const SettingModal = styled.div`
	width: 200px;
	height: 120px;
	border: 1px solid #000;
	position: absolute;
	z-index: 990;
	top: 33%;
	left: 30%;
`;

const ModalHead = styled.div`
	width: 100%;
	height: 20px;
	padding: 12px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 1.4rem;
	user-select: none;
`;

const ModalContent = styled.div`
	width: 100%;
	height: calc(100% - 20px);
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 10px;
	background-color: #f7eff2;
	border-bottom: 1px solid #000;
`;

const Input = styled.input`
	width: 150px;
	height: 25px;

	:focus {
		outline: none;
	}
`;

const Select = styled.select``;

const ConfirmButton = styled.button`
	width: 70px;
	height: 25px;
`;

export default NotepadContent;
