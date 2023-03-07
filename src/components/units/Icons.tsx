import React, { useState, useEffect, useCallback, MouseEvent } from 'react';
import Image from 'next/image';
import { useAtom } from 'jotai';
import styled from 'styled-components';
import { iconList, startMenuToggle } from 'store';
import { executeProgram, changeZIndex } from 'store/programs';
import { iconType } from 'utils/type';
import { allCookie, setCookie } from 'utils/Cookie';

function Icons() {
	const [openStartMenu, setOpenStartMenu] = useAtom(startMenuToggle);
	const [icons, setIcons] = useAtom(iconList);
	const [programList, startProgram] = useAtom(executeProgram);
	const [zIndex, setBigZIndex] = useAtom(changeZIndex);
	const [selected, setSelected] = useState<number>(0);

	useEffect(() => {
		const openedProgram = allCookie();
		for (let name in openedProgram) {
			const icon = icons.find((icon) => icon.value === name);
			if (icon !== undefined) {
				setBigZIndex();
				startProgram({ icon, zIndex });
			}
		}
	}, []);

	const handleClickIcon = (e: MouseEvent<HTMLDivElement>, n: number) => {
		e.stopPropagation();
		setSelected(n);
		setOpenStartMenu(false);
	};

	const handleOpenProgram = useCallback(
		(icon: iconType) => {
			setSelected(0);
			setBigZIndex();
			if (!allCookie().hasOwnProperty(icon.value)) {
				setCookie(icon.value, icon.type);
				startProgram({ icon, zIndex });
			}
		},
		[startProgram]
	);

	return (
		<Desktop onClick={(e) => handleClickIcon(e, 0)}>
			{icons.map((icon, index) => {
				return (
					<Icon
						key={index}
						selected={selected === index + 1}
						onClick={(e) => handleClickIcon(e, index + 1)}
						onDoubleClick={() => handleOpenProgram(icon)}>
						<Image
							src={icon.image}
							width={80}
							height={80}
							alt={icon.name}
							priority={true}
						/>
						<IconName>{icon.name}</IconName>
					</Icon>
				);
			})}
		</Desktop>
	);
}

const Desktop = styled.div`
	width: 100%;
	height: 100%;
	padding: 50px;
	display: grid;
	grid-template-rows: repeat(auto-fill, 100px);
	gap: 50px;
	position: absolute;
	z-index: 100;
`;

const Icon = styled.div<{ selected: boolean }>`
	width: 100px;
	height: 120px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 10px;
	background: ${(props) => (props.selected ? '#3B5998' : 'none')};
	border: ${(props) => (props.selected ? '1px dashed purple' : 'none')};
	user-select: none;
	z-index: 101;
`;

const IconName = styled.span`
	font-size: 1.7rem;
	color: #fff;
`;

export default Icons;
