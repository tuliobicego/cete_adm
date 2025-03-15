import styled from 'styled-components'

interface Props {
  fade?: string
  mode?: string
}

export const AnimatedContainer = styled.div`
    width: 80%;
    height: auto;
    border-radius: .5rem;
    margin-top: 20%;
    padding: 2% 10%;
    align-items: center;
    background: rgba(0, 0, 0, 0.25);
    position: absolute;
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
    height: auto;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    background: rgba(255, 255, 255, 1);
    position: relative;
    padding: 2%;
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
    width: 100%;
    height: auto;
    align-items: center;
    flex-direction: column;
    justify-content: space-around;
    align-content: center;
`

export const ButtonContainer = styled.div`
display: flex;
    width: 50%;
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

export const Header = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    flex-direction: row;
    justify-content: center;
    align-content: center;
`