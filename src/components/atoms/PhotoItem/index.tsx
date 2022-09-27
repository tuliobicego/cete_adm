import { Container } from './styles'

type Props = {
    url: string
    name: string
    onDelete: (name: string) => void
}

export const PhotoItem: React.FC<Props> = ({ url, name, onDelete }) => {
    return (
        <Container>
            <img src={url} alt={name} />
            {name}
            <button onClick={()=>onDelete(name)}>Excluir</button>
        </Container>
    )
}