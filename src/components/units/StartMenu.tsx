import React from 'react';
import styled from 'styled-components';
import { useAtom } from 'jotai';
import { startMenuToggle } from 'store';
import { VscSearch } from 'react-icons/vsc';
import { FiPower } from 'react-icons/fi';
import { SlSettings } from 'react-icons/sl';
import { IoDocumentOutline } from 'react-icons/io5';

function StartMenu() {
	const [toggleOn, setToggleOn] = useAtom(startMenuToggle);
	const handleToggle = () => {
		setToggleOn(!toggleOn);
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
