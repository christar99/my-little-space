import React, { MouseEvent, useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { useAtom } from 'jotai';
import { changeZIndex, exitProgram, memorizeProgramStyle, updateProgram } from 'store/programs';
import { programType, programStyle } from 'utils/type';
import { removeCookie } from 'utils/Cookie';
import ProgramContent from 'components/common/ProgramContent';
import { VscChromeMinimize } from 'react-icons/vsc';
import { VscChromeMaximize } from 'react-icons/vsc';
import { AiOutlineClose } from 'react-icons/ai';

interface adJustStatusType {
	display: string;
	width: number;
	height: number;
	top: number;
	left: number;
	zIndex: number;
}

function Programs() {
	const [programList, changeProgram] = useAtom(updateProgram);
	const [zIndex, setBigZIndex] = useAtom(changeZIndex);
	const [memorizeList, memorizeProgram] = useAtom(memorizeProgramStyle);
	const [notUse, closeProgram] = useAtom(exitProgram);
	const [initialPosition, setInitialPosition] = useState<{ x: number; y: number } | null>(null);
	const [sizeAdjustStatus, setAdjustStatus] = useState<adJustStatusType>({
		display: 'none',
		width: 0,
		height: 0,
		top: 0,
		left: 0,
		zIndex: 0
	});

	const setZIndexTop = (program: programType) => {
		setBigZIndex();
		changeProgram({ program, type: 'zIndex', value: [zIndex] });
	};

	const windowMaximize = (e: MouseEvent<HTMLDivElement>, program: programType) => {
		e.stopPropagation();
		setBigZIndex();
		if (program.style.maximization) {
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
			memorizeProgram({ program, type: 'add' });
			changeProgram({
				program,
				type: 'maximize',
				value: [window.innerWidth, window.innerHeight - 40, zIndex]
			});
		}
	};

	const windowMinimize = (e: MouseEvent<HTMLDivElement>, program: programType) => {
		e.stopPropagation();
		memorizeProgram({ program, type: 'add' });
		changeProgram({
			program,
			type: 'minimize'
		});
	};

	const handleCloseProgram = (program: programType) => {
		closeProgram(program);
		removeCookie(program.uuid);
	};

	const sizeAdjustment = (e: MouseEvent<HTMLDivElement>, program: programType) => {
		setZIndexTop(program);
		setAdjustStatus({
			display: 'block',
			width: e.clientX - program.style.left,
			height: e.clientY - program.style.top,
			left: program.style.left,
			top: program.style.top,
			zIndex: zIndex - 2
		});
	};

	const sizeAdjustEnd = (e: MouseEvent<HTMLDivElement>, program: programType) => {
		changeProgram({
			program,
			type: 'size',
			value: [sizeAdjustStatus.width, sizeAdjustStatus.height]
		});
		setAdjustStatus({
			display: 'none',
			width: 0,
			height: 0,
			left: 0,
			top: 0,
			zIndex: 0
		});
	};

	const handleDragStart = (e: MouseEvent<HTMLDivElement>, program: programType) => {
		setZIndexTop(program);
		setInitialPosition({ x: e.clientX - program.style.left, y: e.clientY - program.style.top });
	};

	const handleMoveProgram = (e: MouseEvent<HTMLDivElement>, program: programType) => {
		e.preventDefault();
		if (initialPosition !== null) {
			changeProgram({
				program,
				type: 'locate',
				value: [e.clientX - initialPosition.x, e.clientY - initialPosition.y]
			});
		}
	};
	const handleDragEnd = (e: MouseEvent<HTMLDivElement>, program: programType) => {
		if (initialPosition !== null) {
			changeProgram({
				program,
				type: 'locate',
				value: [e.clientX - initialPosition.x, e.clientY - initialPosition.y]
			});
			setInitialPosition({ x: 0, y: 0 });
		}
	};

	return (
		<>
			{programList.map((program, index) => {
				return (
					<Program
						key={index}
						programStyle={program.style}
						onClick={() => setZIndexTop(program)}>
						<TopBar
							onDoubleClick={(e) => windowMaximize(e, program)}
							draggable={true}
							onDragStart={(e) => handleDragStart(e, program)}
							onDrag={(e) => handleMoveProgram(e, program)}
							onDragEnd={(e) => handleDragEnd(e, program)}>
							<ProgramInfo>
								<Image
									src={program.image}
									width={20}
									height={20}
									alt="programIcon"
								/>
								<ProgramName> {program.name}</ProgramName>
							</ProgramInfo>
							<ControlGroup>
								<ControlButton onClick={(e) => windowMinimize(e, program)}>
									<VscChromeMinimize />
								</ControlButton>
								<ControlButton onClick={(e) => windowMaximize(e, program)}>
									<VscChromeMaximize />
								</ControlButton>
								<ControlButton>
									<AiOutlineClose onClick={() => handleCloseProgram(program)} />
								</ControlButton>
							</ControlGroup>
						</TopBar>
						<ProgramContent program={program} />
						<SizeAdjustment
							programStyle={program.style}
							draggable={true}
							onDrag={(e) => sizeAdjustment(e, program)}
							onDragEnd={(e) => sizeAdjustEnd(e, program)}
						/>
					</Program>
				);
			})}
			<SizeAdjustStatus sizeAdjustStatus={sizeAdjustStatus} />
		</>
	);
}

const Program = styled.div<{ programStyle: programStyle }>`
	display: ${(props) => (props.programStyle.minimization ? 'none' : 'block')};
	width: ${(props) => props.programStyle.width + 'px'};
	height: ${(props) => props.programStyle.height + 'px'};
	position: absolute;
	top: ${(props) => props.programStyle.top + 'px'};
	left: ${(props) => props.programStyle.left + 'px'};
	z-index: ${(props) => props.programStyle.zIndex};
	border: 1px solid rgba(0, 0, 0, 0.5);
	background-color: #fff;
`;

const TopBar = styled.div`
	height: 35px;
	padding-left: 10px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	color: #fff;
	background-color: #222;
	user-select: none;
`;

const ProgramInfo = styled.div`
	display: flex;
	gap: 10px;
`;

const ProgramName = styled.span`
	font-size: 1.4rem;
`;

const ControlGroup = styled.div`
	display: flex;
`;

const ControlButton = styled.div`
	width: 35px;
	height: 35px;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 1.7rem;

	:hover {
		cursor: pointer;
		background-color: #000;
	}
`;

const SizeAdjustment = styled.div<{ programStyle: programStyle }>`
	width: 20px;
	height: 20px;
	position: absolute;
	top: ${(props) => props.programStyle.height - 15 + 'px'};
	left: ${(props) => props.programStyle.width - 15 + 'px'};

	:hover {
		cursor: nw-resize;
	}
`;

const SizeAdjustStatus = styled.div<{ sizeAdjustStatus: adJustStatusType }>`
	display: ${(props) => props.sizeAdjustStatus.display};
	width: ${(props) => props.sizeAdjustStatus.width + 'px'};
	height: ${(props) => props.sizeAdjustStatus.height + 'px'};
	left: ${(props) => props.sizeAdjustStatus.left + 'px'};
	top: ${(props) => props.sizeAdjustStatus.top + 'px'};
	z-index: ${(props) => props.sizeAdjustStatus.zIndex};
	position: absolute;
	opacity: 0.5;
	background-color: #3b5998;
	border-bottom: 1px dashed purple;
	border-right: 1px dashed purple;
`;
export default Programs;
