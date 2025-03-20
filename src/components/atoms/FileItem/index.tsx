import { IFile } from '../../../types'
import { Container } from './styles'

type Props = {
    file: IFile
}

export const FileItem: React.FC<Props> = ({ file }) => {
    console.log({file})
    return (
        <Container>
            {file.contentType === 'image/png' || file.contentType === 'image/jpeg' ?
            <img alt={file._id} src={`data:${file.contentType};base64,${file.base64}`} width="600px" height="400px" />
            : file.contentType === '' ? 
            <iframe title={file._id} src={`data:application/pdf;base64,${file.base64}`} width="600px" height="400px"></iframe>
            : null}
        </Container>
    )
}