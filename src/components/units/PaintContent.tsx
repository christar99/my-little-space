import React, { ChangeEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { programType } from 'utils/type';

interface PaintContentProps {
	program: programType;
}

const colors = [
	{ code: '#000000' },
	{ code: '#1abc9c' },
	{ code: '#3498db' },
	{ code: '#0400ff' },
	{ code: '#27ae60' },
	{ code: '#8e44ad' },
	{ code: '#f1da0f' },
	{ code: '#e74c3c' },
	{ code: '#95a5a6' },
	{ code: '#5c2a09' },
	{ code: '#c9cfd3' },
	{ code: '#ff0000' }
];

function PaintContent({ program }: PaintContentProps) {
	const { style } = program;
	const { width, height } = style;
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
	const [isPainting, setPanting] = useState<boolean>(false);
	const [lineWidth, setLineWidth] = useState<number>(2);
	const [color, setColor] = useState<string>('#000000');
	const [mode, setMode] = useState<string>('drawing');
	useEffect(() => {
		if (canvasRef.current !== null) {
			setCtx(canvasRef.current.getContext('2d'));
		}
	}, []);
	useEffect(() => {
		if (canvasRef.current !== null) {
			canvasRef.current.width = width - 2;
			canvasRef.current.height = height - 87;
		}
	}, [width, height]);

	useEffect(() => {
		if (color !== '#ffffff') {
			setMode('drawing');
		}
		if (ctx !== null) {
			ctx.strokeStyle = color;
			ctx.fillStyle = color;
		}
	}, [color]);

	useEffect(() => {
		if (mode === 'eraser') {
			setColor('#ffffff');
		}
	}, [mode]);

	const startPainting = (e: MouseEvent<HTMLCanvasElement>) => {
		setPanting(true);
		ctx?.beginPath();
		ctx?.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
	};

	const drawingCanvas = (e: MouseEvent<HTMLCanvasElement>) => {
		if (isPainting) {
			ctx?.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
			ctx?.stroke();
		}
	};

	const fillCanvas = () => {
		if (mode === 'fill' && canvasRef.current !== null) {
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

	return (
		<PaintContainer>
			<TopMenu>
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
		</PaintContainer>
	);
}

const PaintContainer = styled.div`
	width: 100%;
	height: 100%;
`;

const TopMenu = styled.div`
	width: 100%;
	height: 50px;
	padding: 0 10px;
	border-bottom: 1px solid #000;
	display: flex;
	align-items: center;
	gap: 20px;
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

const Canvas = styled.canvas``;

export default PaintContent;
