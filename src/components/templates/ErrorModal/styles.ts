import styled from 'styled-components'

interface Props {
  fade?: string
  mode?: string
}

export const AnimatedContainer = styled.div`
    width: 30%;
    height: 30%;
    border-radius: .5rem;
    padding: .5% .5%;
    align-items: center;
    background: rgba(255, 0, 0, 0.4);
    position: absolute;
    top: 30%;
    flex: ${(props: Props) => {
    switch (props.mode) {
      case "open":
        return "1";
      default:
        return "0";
    }
    }};
    display: ${(props: Props) => {
      switch (props.mode) {
        case "open":
          return "flex";
        default:
          return "none";
      }
    }};
    opacity: ${(props: Props) => {
  switch (props.fade) {
    case "in":
      return "1";
    default:
      return "0";
  };
  }};
  transition: ${(props: Props) => {
    switch (props.fade) {
      case "in":
        return `opacity linear 0.4s;`;
      case "out":
        return `opacity linear 0.4s;`;
      default:
        return "";
    }
  }
}
`


export const AnimatedModalContainer = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    background: rgba(255, 255, 255, 1);
    position: relative;
    padding: 2% 2%;
    border-radius: .5rem;
    flex: ${(props: Props) => {
    switch (props.mode) {
      case "open":
        return "1";
      default:
        return "0";
    }
    }};
    transition: ${(props: Props) => {
      switch (props.fade) {
        case "in":
          return `opacity linear 0.4s;`;
        case "out":
          return `opacity linear 0.4s;`;
        default:
          return "";
      }
    }
  };
`




export const Content = styled.div`
  display: flex;
    width: 80%;
    height: 80%;
    align-items: center;
    flex-direction: column;
    justify-content: space-around;
    align-content: center;
`

export const ButtonContainer = styled.div`
display: flex;
    width: 100%;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    align-content: center;
`


export const Space = styled.div`
  display: flex;
    width: 100%;
    height: 30px;
`

export const ButtonsContainer = styled.div`
  display : flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
`