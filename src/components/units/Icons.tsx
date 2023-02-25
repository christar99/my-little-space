import React, { useState, MouseEvent } from 'react';
import { useAtom } from 'jotai';
import { iconList } from 'store';
import styled from 'styled-components';
import Image from 'next/image';

function Icons() {
	const [icons, setIcons] = useAtom(iconList);
	const [selected, setSelected] = useState<number>(0);
	const handleClickIcon = (e: MouseEvent<HTMLDivElement>, n: number) => {
		e.stopPropagation();
		setSelected(n);
	};
	return (
		<Desktop onClick={(e) => handleClickIcon(e, 0)}>
			{icons.map((icon, index) => {
				return (
					<Icon
						key={index}
						selected={selected === index + 1}
						onClick={(e) => handleClickIcon(e, index + 1)}>
						<Image src={icon.image} width={80} height={80} alt={icon.name} />
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
`;

const IconName = styled.span`
	font-size: 1.7rem;
	color: #fff;
`;

export default Icons;
