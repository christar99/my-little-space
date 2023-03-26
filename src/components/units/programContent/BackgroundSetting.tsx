import React, { useState, useEffect, ChangeEvent } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { useAtom } from 'jotai';
import { backgroundAtom, screenShotAtom } from 'store';
import { exitProgram } from 'store/programs';
import { removeCookie } from 'utils/Cookie';
import { colors, uuid } from 'utils/common';
import { S3PutObject, S3DeleteObject } from 'utils/aws';
import { BsCheck } from 'react-icons/bs';

export default function BackgroundSetting() {
	const [programList, closeProgram] = useAtom(exitProgram);
	const [type, setType] = useState<string>('color');
	const [background, setBackground] = useAtom(backgroundAtom);
	const [screenShot, setScreenShot] = useAtom(screenShotAtom);

	useEffect(() => {
		const myComputer = programList.find((program) => program.name === '내 컴퓨터');
		if (myComputer !== undefined) {
			closeProgram(myComputer);
			removeCookie(myComputer.uuid);
		}
	}, []);

	const handleChangeColor = (color: string) => {
		deletePreImg();
		const backgroundProps = { type: 'color', value: color };
		setBackground(backgroundProps);
		localStorage.setItem('background', JSON.stringify(backgroundProps));
	};

	const saveImageFile = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.value === '') {
			return;
		}
		try {
			deletePreImg();
			if (e.target.files !== null) {
				const type = e.target.files[0].type.split('/')[1];
				const uploadKey = `${uuid}/mls_background_${new Date().getTime()}.${type}`;
				const imgSrc = `${
					process.env.NEXT_PUBLIC_S3_DEFAULT_URL as string
				}users/${uploadKey}`;
				S3PutObject(e.target.files[0], uploadKey, `image/${type}`);

				setTimeout(() => {
					const backgroundProps = { type: 'image', value: imgSrc };
					setBackground(backgroundProps);
					localStorage.setItem('background', JSON.stringify(backgroundProps));
					setScreenShot(imgSrc);
				}, 500);
			}
		} catch {
			console.log('업로드를 실패했어요');
		}
	};

	const deletePreImg = () => {
		if (background.type === 'image') {
			const deleteKey = background.value.replace(
				process.env.NEXT_PUBLIC_S3_DEFAULT_URL as string,
				''
			);
			S3DeleteObject([{ Key: deleteKey }]);
		}
	};

	return (
		<BackgroundContainer>
			<Title>배경</Title>
			{screenShot !== '' && (
				<Image src={screenShot} width={350} height={220} alt={'screenShot'} />
			)}
			<Switch>
				<Button currentType={type === 'color'} onClick={() => setType('color')}>
					단색
				</Button>
				<Button currentType={type === 'image'} onClick={() => setType('image')}>
					사진
				</Button>
			</Switch>
			<BackgroundColor>
				{type === 'color' && (
					<ColorCollection>
						{colors.map((color, index) => {
							return (
								<Color
									key={index}
									color={color.code}
									onClick={() => handleChangeColor(color.code)}>
									{background.value === color.code && <BsCheck />}
								</Color>
							);
						})}
					</ColorCollection>
				)}
				{type === 'image' && (
					<ImageInputContainer>
						<ImageInput
							type="file"
							id="uploadImage"
							accept="image/jpg, impge/png, image/jpeg"
							onChange={saveImageFile}
						/>
						<Label htmlFor="uploadImage">
							<FindImage>찾아보기</FindImage>
						</Label>
					</ImageInputContainer>
				)}
			</BackgroundColor>
		</BackgroundContainer>
	);
}

const BackgroundContainer = styled.div`
	width: 100%;
	height: 100%;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	gap: 30px;
	padding: 20px 30px;
	position: relative;
	color: ${(props) => props.theme.program.textColor};
`;

const Title = styled.span`
	font-size: 3rem;
`;

const Switch = styled.div`
	width: 150px;
	height: 35px;
	display: flex;
	border: 1px solid #fff;
	border-radius: 5px;
	background-color: #444;
`;

const Button = styled.div<{ currentType: boolean }>`
	width: 75px;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 1.8rem;
	background-color: ${(props) => (props.currentType ? '#3B5998' : 'inherit')};
	border-radius: 5px;

	:hover {
		background-color: ${(props) => (props.currentType ? '#6a7eaa' : '#666')};
		cursor: pointer;
	}
`;

const BackgroundColor = styled.div`
	display: flex;
	flex-direction: column;
	gap: 20px;
`;

const ColorCollection = styled.div`
	width: 200px;
	display: flex;
	flex-wrap: wrap;
	gap: 2px;
`;

const Color = styled.div<{ color: string }>`
	width: 30px;
	height: 30px;
	background-color: ${(props) => props.color};
	position: relative;

	:hover {
		cursor: pointer;
		border: 2px solid #fff;
	}

	svg {
		position: absolute;
		font-size: 3rem;
		right: 0;
		color: #fff;
	}
`;

const ImageInputContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 20px;
`;

const ImageInput = styled.input`
	display: none;
`;
const Label = styled.label``;

const FindImage = styled.span`
	padding: 8px 20px;
	background-color: #333;
	font-size: 1.7rem;
	color: #fff;

	:hover {
		border: 2px solid #fff;
		cursor: pointer;
	}
`;
