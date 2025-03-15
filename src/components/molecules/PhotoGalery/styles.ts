import styled from "styled-components";

export const Container = styled.div`
    background-color: #E6E6E6;
    color: #2d76b2;
    width: 100%;
    border-radius: 10px;
`;

export const Area = styled.div`
    margin: auto;
    padding: 30px 0;
`;

export const Header = styled.h1`
    margin: 0;
    padding: 0;
    text-align: center;
    margin-bottom: 30px;
`;

export const ButtonsBox = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
`

export const ScreenWarning = styled.div`
    text-align: center;
    .emoji {
        font-size: 50px;
        margin-bottom: 20px;
    }
`;

export const PhotoList = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    padding: 2%;
`;

export const UploadForm = styled.form`
    background-color: transparent;
    padding: 15px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
    input[type=submit] {
        background-color: #2d76b2;
        border: 0;
        color: #000000;
        padding: 8px 16px;
        font-size: 15px;
        border-radius: 10px;
        margin: 0 20px;
        cursor: pointer;
        &:hover {
            opacity: .9;
      }
    }
`;