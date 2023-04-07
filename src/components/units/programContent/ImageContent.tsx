import React from 'react';
import styled from 'styled-components';
import { programType } from 'utils/type';

interface ImageContentProps {
	program: programType;
}

function ImageContent({ program }: ImageContentProps) {
	return (
		<ImageContainer>
			<ImgContent src={program.src as string} />
		</ImageContainer>
	);
}

const ImageContainer = styled.div`
	width: 100%;
	height: calc(100% - 35px);
	display: flex;
	justify-content: center;
	position: relative;
`;

const ImgContent = styled.div<{ src: string }>`
	width: 100%;
	height: 100%;
	background-image: url(${(props) => props.src});
	background-position: center center;
	background-repeat: no-repeat;
`;

export default ImageContent;
