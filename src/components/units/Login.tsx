import React, { useState, DragEvent } from 'react';
import Image from 'next/image';
import { useAtom } from 'jotai';
import { needAccount } from 'store';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko');

function Loading() {
	const [currentTime] = useState<dayjs.Dayjs>(dayjs());
	const [isLogin, setLogin] = useAtom(needAccount);
	const [userName, setUserName] = useState<string>('');
	const [onLoginScreen, setLoginScreen] = useState<boolean>(false);
	const handleDragScreen = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setLoginScreen(true);
	};

	const handleSubmitID = () => {
		const account = {
			name: userName,
			uuid: uuidv4()
		};
		if (userName === '') {
			alert('로그인 할 계정을 적어주세요!');
		} else if (userName.length > 12) {
			alert('계정은 12자 이내로 적어주세요!');
		} else if (userName !== '') {
			localStorage.setItem('account', JSON.stringify(account));
			setLogin(JSON.stringify(account));
		}
	};

	return (
		<LoadingScreen draggable={true} onDragEnd={(e) => handleDragScreen(e)}>
			{!onLoginScreen ? (
				<Date>
					<CurrentTime>{currentTime.format('HH:mm')}</CurrentTime>
					<CurrentDate>{currentTime.format('M월 DD일 dddd')}</CurrentDate>
				</Date>
			) : (
				<LoginScreen>
					<Image src={'/account.png'} width={150} height={150} alt="accountImage" />
					<Announcement>로그인계정을 입력해 주세요.</Announcement>
					<InputContainer>
						<Input onChange={(e) => setUserName(e.target.value)} />
						<ConfirmButton onClick={handleSubmitID}>→</ConfirmButton>
					</InputContainer>
				</LoginScreen>
			)}
		</LoadingScreen>
	);
}

const LoadingScreen = styled.div`
	width: 100vw;
	height: 100vh;
	padding: 50px;
	background: url('/window10_wallpaper.jpg');
	background-size: cover;
	background-position: center center;
	color: #e5e5e5;
	user-select: none;
	position: relative;
`;

const Date = styled.div`
	color: #fff;
	font-weight: lighter;
	position: absolute;
	top: 60%;
`;

const CurrentTime = styled.p`
	font-size: 11rem;
	margin-bottom: 20px;
`;
const CurrentDate = styled.p`
	font-size: 6rem;
`;

const LoginScreen = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 20px;
	position: relative;
`;

const Announcement = styled.p`
	font-size: 4rem;
`;

const InputContainer = styled.div`
	display: flex;
	position: relative;
`;

const Input = styled.input`
	width: 300px;
	height: 40px;
	padding: 0 5px;
	font-size: 2.5rem;
	word-spacing: -1px;
	:focus {
		outline: none;
	}
`;

const ConfirmButton = styled.button`
	width: 40px;
	height: 40px;
	position: absolute;
	right: 0;
	bottom: 0;
	font-size: 2rem;
	font-weight: 700;
	background-color: #999292;
	border: 1px solid #fff;
	color: #fff;
`;

export default Loading;
