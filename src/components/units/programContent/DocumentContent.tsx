import React, { useMemo } from 'react';
import styled from 'styled-components';
import IconComponent from 'components/common/IconComponent';
import { programType } from 'utils/type';
import { useAtom } from 'jotai';
import { selectedIcon } from 'store';
import { deleteProgramAtom } from 'store/icons';

interface DocumentContentProps {
	program: programType;
}

function DocumentContent({ program }: DocumentContentProps) {
	const [notUse, setSelected] = useAtom(selectedIcon);
	const [iconList] = useAtom(deleteProgramAtom);

	const currentProgram = useMemo(() => {
		return iconList.find((icon) => icon.name === program.name);
	}, [iconList]);

	return (
		<DocumentContainer
			onClick={() => setSelected('')}
			data-type={'document'}
			data-name={program.name}>
			{currentProgram?.containIcons === undefined ? (
				<NoContent>이 폴더는 비어 있습니다.</NoContent>
			) : (
				currentProgram?.containIcons?.map((icon, index) => {
					return <IconComponent key={index} icon={icon} from={'document'} />;
				})
			)}
		</DocumentContainer>
	);
}

const DocumentContainer = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-wrap: wrap;
	gap: 20px;
	padding: 20px 30px;
	position: relative;
	color: ${(props) => props.theme.program.textColor};
`;

const NoContent = styled.p`
	width: calc(100% - 60px);
	margin-top: 50px;
	display: flex;
	justify-content: center;
	position: absolute;
	font-size: 1.3rem;
	user-select: none;
`;

export default DocumentContent;
