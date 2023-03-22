import React, { useState, useEffect, useRef, MouseEvent, ChangeEvent, useCallback } from 'react';
import styled from 'styled-components';
import { useAtom } from 'jotai';
import { addIconList } from 'store';
import { changeZIndex, exitProgram } from 'store/programs';
import { programType } from 'utils/type';
import { removeCookie } from 'utils/Cookie';
import { S3PutObject } from 'utils/aws';
import { uuid } from 'utils/common';
import { v4 as uuidv4 } from 'uuid';
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
	save: '저장하기',
	fontStyle: '글꼴',
	fontSize: '글자 크기'
};

const fontStyle: fontStyleProps[] = [
	{ name: '바탕', value: ['Noto Serif KR', 'serif'] },
	{ name: '고딕', value: ['Nanum Gothic', 'sans-serif'] },
	{ name: '명조', value: ['Nanum Myeongjo', 'serif'] },
	{ name: '펜스크립트', value: ['Nanum Pen Script', 'cursive'] },
	{ name: '싱글데이', value: ['Single Day', 'cursive'] },
	{ name: '블랙한산스', value: ['Black Han Sans', 'sans-serif'] },
	{ name: '주아', value: ['Jua', 'sans-serif'] }
];

function NotepadContent({ program }: NotepadContentProps) {
	const { notepadContent } = program;
	const [zIndex] = useAtom(changeZIndex);
	const [dropDownMenu, setDropDownMenu] = useState<string | null>(null);
	const [modalOpen, setModalOpen] = useState<string | null>(null);
	const [fontSize, setFontSize] = useState<number>(
		notepadContent === undefined ? 15 : notepadContent.fontSize
	);
	const [selectFontStyle, setFontStyle] = useState<fontStyleProps>(
		notepadContent === undefined
			? {
					name: '바탕',
					value: ['Noto Serif KR', 'serif']
			  }
			: (fontStyle.find((style) => style.name === notepadContent.fontStyle) as fontStyleProps)
	);
	const fontSizeRef = useRef<HTMLInputElement>(null);
	const textAreaRef = useRef<HTMLTextAreaElement>(null);
	const filenameRef = useRef<HTMLInputElement>(null);
	const [notUse, closeProgram] = useAtom(exitProgram);
	const [iconList, addNewIcon] = useAtom(addIconList);

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

	const handleCloseProgram = (program: programType) => {
		closeProgram(program);
		removeCookie(program.uuid);
	};

	const checkNumber = (e: ChangeEvent<HTMLInputElement>) => {
		const number = e.target.value;
		const regExp = /^[0-9]+$/;
		if (!regExp.test(number) && number !== '') {
			alert('숫자만 입력하세요!');
		}
	};

	const changeFontStyle = (e: ChangeEvent<HTMLSelectElement>) => {
		const selectStyle = fontStyle.find((font) => font.value[0] === e.target.value);
		if (selectStyle !== undefined) {
			setFontStyle(selectStyle);
		}
	};

	const confirmSetting = (program: programType) => {
		if (modalOpen === 'fontSize' && fontSizeRef.current !== null) {
			setFontSize(Number(fontSizeRef.current.value));
		}
		if (modalOpen === 'save' && textAreaRef.current !== null && filenameRef.current !== null) {
			const textValue = textAreaRef.current.value;
			const filenameValue = filenameRef.current.value;
			const reg = /[\{\}\[\]\/?,;:|\)*~`!^\+<>@\#$%&\\\=\(\'\"]/g;

			if (filenameValue.length < 2) {
				alert('두글자 이상 적어주세요');
				return;
			}
			if (reg.test(filenameValue)) {
				alert('특수문자는 언더바(_), 하이픈(-), 점(.)만 가능해요! (공백문자 불가)');
				return;
			}

			if (iconList.find((icon) => icon.name === filenameValue + '.txt') !== undefined) {
				alert('중복된 이름이 있습니다!');
				return;
			}

			const uploadKey = `${uuid}/notepad/_${selectFontStyle.name}_${fontSize}_${filenameValue}.txt`;
			const file = new Blob([textValue], {
				type: 'text/plain'
			});

			S3PutObject(file, uploadKey, 'text/plain');
			addNewIcon([
				{
					name: filenameValue + '.txt',
					uuid: uuidv4(),
					image: '/icons/notepad.png',
					type: 'notepad',
                    from: 'desktop',
					notepadContent: {
						content: textValue,
						fontSize,
						fontStyle: selectFontStyle.name
					}
				}
			]);
			handleCloseProgram(program);
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
					{dropDownMenu === 'file' && (
						<Dropdown zIndex={zIndex + 2}>
							<DetailMenu onClick={() => handleModalOpen('save')}>
								다른이름으로 저장
							</DetailMenu>
						</Dropdown>
					)}
				</SettingMenu>
				<SettingMenu
					background={dropDownMenu === 'form'}
					onClick={(e) => handleDropDown(e, 'form')}>
					서식
					{dropDownMenu === 'form' && (
						<Dropdown zIndex={zIndex + 2}>
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
			<TextContainer>
				<TextArea
					ref={textAreaRef}
					fontSize={fontSize}
					fontFamily={selectFontStyle}
					onClick={(e) => handleDropDown(e, null)}
					modalOpen={modalOpen !== null}
					defaultValue={notepadContent?.content}
				/>
				{modalOpen !== null && (
					<SettingModal zIndex={zIndex + 1}>
						<ModalHead>
							<span>{settingValue[modalOpen]}</span>
							<AiOutlineClose onClick={() => setModalOpen(null)} />
						</ModalHead>
						<ModalContent>
							{modalOpen === 'fontSize' && (
								<Input
									ref={fontSizeRef}
									defaultValue={fontSize}
									onChange={(e) => checkNumber(e)}
								/>
							)}
							{modalOpen === 'fontStyle' && (
								<Select onChange={(e) => changeFontStyle(e)}>
									<option value={fontStyle[0].value[0]}>
										{fontStyle[0].name}
									</option>
									{fontStyle.map((font, index) => {
										if (index > 0) {
											return (
												<option value={font.value[0]} key={index}>
													{font.name}
												</option>
											);
										}
									})}
								</Select>
							)}
							{modalOpen === 'save' && (
								<>
									<Label>파일이름</Label>
									<Input ref={filenameRef} placeholder="확장자빼고 적으세요" />
								</>
							)}
							<ConfirmButton onClick={() => confirmSetting(program)}>
								확인
							</ConfirmButton>
						</ModalContent>
					</SettingModal>
				)}
			</TextContainer>
		</NotepadContainer>
	);
}

const NotepadContainer = styled.div`
	width: 100%;
	height: 100%;
`;

const SettingLine = styled.div`
	width: 100%;
	height: 25px;
	background-color: #fff;
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

const Dropdown = styled.div<{ zIndex: number }>`
	width: 120px;
	position: absolute;
	left: 0;
	top: 25px;
	border: 1px solid #ccc;
	background-color: #f7eff2;
	box-shadow: 5px 5px 5px #555;
	z-index: ${(props) => props.zIndex};
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

const TextContainer = styled.div`
	width: 100%;
	height: calc(100% - 25px);
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
`;

const TextArea = styled.textarea<{
	fontSize: number;
	fontFamily: fontStyleProps;
	modalOpen: boolean;
}>`
	width: 100%;
	height: 100%;
	border: none;
	resize: none;
	font-size: ${(props) => props.fontSize / 10 + 'rem'};
	font-family: ${(props) => props.fontFamily.value[0] + ', ' + props.fontFamily.value[1]};
	opacity: ${(props) => (props.modalOpen ? 0.5 : 1)};

	:focus {
		outline: none;
	}
`;

const SettingModal = styled.div<{ zIndex: number }>`
	width: 300px;
	height: 150px;
	border: 1px solid #000;
	position: absolute;
	z-index: ${(props) => props.zIndex};
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
	background-color: #fff;

	svg {
		:hover {
			background-color: #f7eff2;
		}
	}
`;

const ModalContent = styled.div`
	width: 100%;
	height: calc(100% - 25px);
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 10px;
	background-color: #f7eff2;
`;

const Label = styled.label`
	font-size: 1.3rem;
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
