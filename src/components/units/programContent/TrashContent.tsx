import React from 'react';
import styled from 'styled-components';

export default function TrashContent() {
	return (
		<TrashContainer>
			다른 프로그램을 휴지통으로 드래그 하시면 삭제할 수 있습니다.
		</TrashContainer>
	);
}

const TrashContainer = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	padding-top: 30px;
	color: ${(props) => props.theme.program.textColor};
	font-size: 1.5rem;
	user-select: none;
`;
