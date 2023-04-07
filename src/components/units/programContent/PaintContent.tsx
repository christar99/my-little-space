import React, { ChangeEvent, MouseEvent, useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { useAtom } from 'jotai';
import { accountAtom } from 'store';
import { addIconList } from 'store/icons';
import { changeZIndex, exitProgram } from 'store/programs';
import { programType } from 'utils/type';
import { S3PutObject } from 'utils/aws';
import { removeCookie } from 'utils/Cookie';
import { colors } from 'utils/common';
import { v4 as uuidv4 } from 'uuid';
import { AiOutlineClose } from 'react-icons/ai';

interface PaintContentProps {
	program: programType;
}

function PaintContent({ program }: PaintContentProps) {
	const [account] = useAtom(accountAtom);
	const { style } = program;
	const { width, height, left, top } = style;
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
	const [isPainting, setPanting] = useState<boolean>(false);
	const [lineWidth, setLineWidth] = useState<number>(2);
	const [color, setColor] = useState<string>('#000000');
	const [mode, setMode] = useState<string>('drawing');
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [fileName, setFileName] = useState<string>('');
	const [isDrawingStart, setDrawingStart] = useState<boolean>(false);
	const [canvasSize, setCanvasSize] = useState<number[]>([598, 313]);

	const [iconList, addNewIcon] = useAtom(addIconList);
	const [notUse2, closeProgram] = useAtom(exitProgram);
	const [zIndex] = useAtom(changeZIndex);
	const fileNameRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (canvasRef.current !== null) {
			setCtx(canvasRef.current.getContext('2d'));
		}
	}, []);

	useEffect(() => {
		if (canvasRef.current !== null) {
			canvasRef.current.width = canvasSize[0];
			canvasRef.current.height = canvasSize[1];
		}
	}, [canvasSize]);

	useEffect(() => {
		if (ctx !== null) {
			ctx.fillStyle = color;
			ctx.strokeStyle = color;
		}
	}, [color]);

	useEffect(() => {
		if (mode === 'eraser') {
			setColor('#ffffff');
		}
	}, [mode]);

	useEffect(() => {
		if (ctx !== null) {
			ctx.lineCap = 'round';
		}
	}, [lineWidth]);

	useEffect(() => {
		if (!modalOpen) {
			setFileName('');
		} else {
			fileNameRef.current?.focus();
		}
	}, [modalOpen]);

	// confirm('캔버스 크기를 변경하면 그림이 초기화됩니다. 진행하시겠어요?')
	useEffect(() => {
		if (canvasSize[0] > width || canvasSize[1] > height) {
			if (isDrawingStart) {
				alert('캔버스 크기를 변경하면 그림이 초기화됩니다!');
			}
			setCanvasSize([width - 2, height - 87]);
		}
	}, [width, height]);

	const startPainting = (e: MouseEvent<HTMLCanvasElement>) => {
		setPanting(true);
		ctx?.beginPath();
		ctx?.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
	};

	const drawingCanvas = (e: MouseEvent<HTMLCanvasElement>) => {
		if (isPainting) {
			setDrawingStart(true);
			ctx?.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
			ctx?.stroke();
		}
	};

	const fillCanvas = () => {
		if (mode === 'fill' && canvasRef.current !== null) {
			setDrawingStart(true);
			ctx?.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
		}
	};

	const cancelPainting = (e: MouseEvent<HTMLCanvasElement>) => {
		setPanting(false);
	};

	const changeLineWidth = (e: ChangeEvent<HTMLInputElement>) => {
		setLineWidth(Number(e.target.value));
		if (ctx !== null) {
			ctx.lineWidth = lineWidth;
		}
	};

	const sizeAdjustment = useCallback(
		(e: MouseEvent<HTMLDivElement>) => {
			const canvasWidth = e.clientX - left;
			const canvasHeight = e.clientY - top - 85;
			if (
				canvasWidth > 100 &&
				canvasWidth < width - 1 &&
				canvasHeight > 100 &&
				canvasHeight < height - 89
			) {
				setCanvasSize([canvasWidth, canvasHeight]);
			}
		},
		[width, height]
	);

	const savePaint = () => {
		const reg = /[\{\}\[\]\/?,;:|\)*~`!^\+<>@\#$%&\\\=\(\'\"]/g;
		if (fileName.length < 2) {
			alert('두글자 이상 적어주세요');
			return;
		}

		if (reg.test(fileName)) {
			alert('특수문자는 언더바(_), 하이픈(-), 점(.)만 가능해요! (공백문자 불가)');
			return;
		}

		if (iconList.find((icon) => icon.name === fileName + '.txt') !== undefined) {
			alert('중복된 이름이 있습니다!');
			return;
		}

		try {
			if (canvasRef.current !== null) {
				const uploadKey = `${account.uuid}/image/${fileName}.png`;
				canvasRef.current.toBlob((blob) => {
					if (blob !== null) {
						S3PutObject(blob, uploadKey, 'image/png');
					}
				});

				addNewIcon([
					{
						name: fileName + '.png',
						uuid: uuidv4(),
						image: '/icons/window_image.png',
						type: 'image',
						from: 'desktop',
						src:
							(process.env.NEXT_PUBLIC_S3_DEFAULT_URL as string) +
							'users/' +
							uploadKey
					}
				]);
			}
		} catch {
			alert('업로드를 실패했어요');
		}
		closeProgram(program);
		removeCookie(program.uuid);
		setModalOpen(false);
	};

	return (
		<PaintContainer>
			<TopMenu>
				<SaveButton onClick={() => setModalOpen(true)}>저장</SaveButton>
				<DrawingMode>
					<ModeButton
						active={mode === 'drawing'}
						onClick={() => setMode('drawing')}
						title="그리기">
						<Image src={'/pen_mode.png'} width={20} height={25} alt="pen_mode" />
					</ModeButton>
					<ModeButton
						active={mode === 'fill'}
						onClick={() => setMode('fill')}
						title="채우기">
						<Image src={'/fill_mode.png'} width={25} height={25} alt="fill_mode" />
					</ModeButton>
					<ModeButton
						active={mode === 'eraser'}
						onClick={() => setMode('eraser')}
						title="지우개">
						<Image src={'/eraser_mode.png'} width={25} height={25} alt="fill_mode" />
					</ModeButton>
				</DrawingMode>
				<Input
					type="range"
					min={mode === 'drawing' ? 1 : 2}
					max={mode === 'drawing' ? 10 : 50}
					defaultValue={mode === 'drawing' ? 2 : 20}
					step={mode === 'drawing' ? 0.5 : 4}
					onChange={(e) => changeLineWidth(e)}
					title={mode === 'drawing' ? '펜 굵기' : '지우개 크기'}
				/>
				<Input type="color" onChange={(e) => setColor(e.target.value)} value={color} />
				<ColorSetContainer>
					{colors.map((color, index) => {
						return (
							<ColorSet
								key={index}
								colorCode={color.code}
								onClick={() => setColor(color.code)}
							/>
						);
					})}
				</ColorSetContainer>
			</TopMenu>
			<Canvas
				ref={canvasRef}
				onMouseDown={startPainting}
				onMouseMove={drawingCanvas}
				onMouseUp={cancelPainting}
				onMouseLeave={cancelPainting}
				onClick={fillCanvas}
			/>
			{modalOpen && (
				<SaveModal zIndex={zIndex}>
					<SaveModalBox>
						<ModalHeader>
							<span>저장하기</span>
							<AiOutlineClose onClick={() => setModalOpen(false)} />
						</ModalHeader>
						<ModalContent>
							<SaveInput
								ref={fileNameRef}
								onChange={(e) => setFileName(e.currentTarget.value)}
								placeholder="확장자 빼고 적으세요."
							/>
							<ConfirmButton onClick={savePaint}>확인</ConfirmButton>
						</ModalContent>
					</SaveModalBox>
				</SaveModal>
			)}
			{!isDrawingStart && (
				<CanvasResize
					left={canvasSize[0] - 5}
					top={canvasSize[1] + 45}
					draggable={true}
					onDrag={(e) => sizeAdjustment(e)}
				/>
			)}
		</PaintContainer>
	);
}

const PaintContainer = styled.div`
	width: 100%;
	height: 100%;
	user-select: none;
	background-color: #aecbd6;
	position: relative;
	border: 1px solid rgba(0, 0, 0, 0.5);
`;

const TopMenu = styled.div`
	width: 100%;
	height: 50px;
	padding: 0 10px;
	border-bottom: 1px solid #000;
	display: flex;
	align-items: center;
	gap: 20px;
	background-color: #fff;
`;

const SaveButton = styled.button`
	width: 60px;
	height: 30px;
	font-size: 1.5rem;

	:hover {
		cursor: pointer;
	}
`;

const DrawingMode = styled.div`
	display: flex;
	gap: 5px;
`;

const ModeButton = styled.button<{ active: boolean }>`
	border: 1px solid ${(props) => (props.active ? '#899baf' : '#fff')};
	background-color: ${(props) => (props.active ? '#c4e4ff' : '#fff')};
	:hover {
		cursor: pointer;
		border: 1px solid #a5e4ee;
		background-color: #d9f1f5;
	}
`;

const Input = styled.input`
	:hover {
		cursor: pointer;
	}
`;
const ColorSetContainer = styled.div`
	width: 132px;
	margin-left: -10px;
	display: flex;
	flex-wrap: wrap;
`;
const ColorSet = styled.div<{ colorCode: string }>`
	width: 22px;
	height: 22px;
	background-color: ${(props) => props.colorCode};

	:hover {
		cursor: pointer;
	}
`;

const SaveModal = styled.div<{ zIndex: number }>`
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	top: 0;
	left: 0;
	z-index: ${(props) => props.zIndex + 1};
	border: 1px solid #000;
	background-color: rgba(0, 0, 0, 0.5);
`;

const SaveModalBox = styled.div`
	width: 250px;
	height: 150px;
	background-color: #fff;
`;

const ModalHeader = styled.div`
	width: 100%;
	height: 30px;
	padding: 0 10px;
	border-bottom: 1px solid rgba(0, 0, 0, 0.7);
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 1.4rem;

	svg {
		:hover {
			cursor: pointer;
		}
	}
`;

const ModalContent = styled.div`
	width: 100%;
	height: calc(100% - 30px);
	background-color: #f7eff2;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 10px;
`;

const SaveInput = styled.input`
	width: 150px;
	height: 25px;
	padding: 0 5px;
	font-size: 1.3rem;
	:focus {
		outline: none;
	}
`;

const ConfirmButton = styled.button`
	:hover {
		cursor: pointer;
	}
`;

const Canvas = styled.canvas`
	background-color: #fff;
`;

const CanvasResize = styled.div<{ left: number; top: number }>`
	width: 7px;
	height: 7px;
	border: 1px solid #000;
	background-color: #fff;
	position: absolute;
	left: ${(props) => props.left + 'px'};
	top: ${(props) => props.top + 'px'};

	:hover {
		cursor: nw-resize;
	}
`;

export default PaintContent;
