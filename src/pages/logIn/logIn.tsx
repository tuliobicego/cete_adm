import React, { useEffect, useState } from "react";
import { withRouter } from "../../routes/router";
import Logo from "../../assets/svg/logoCETE40.svg";
import Loading from "../../components/atoms/Loading";
import { useAuth } from "../../api/services/firebase/auth";
import { emailVerifier } from "../../utils/verifiers/verifiers";
import { useNavigate } from "react-router-dom";
import { Form, Container, Button, Content } from "./styles";
import ErrorModal from "../../components/templates/ErrorModal";
import Disclaimer from "../../components/atoms/Disclaimer";
import { GET_USER_BY_ID, UserInput, UserPayload } from "../../api/database/queries/getUser";
import { useLazyQuery } from "@apollo/client";

const LogIn: React.FC = () => {
  const navigate = useNavigate();
  const { logIn, setLoading, loading, user, setRole, logOut} = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorModalVisible, setErrorModalVisible] = useState<boolean>(false);

  useEffect(() => {
    if (user?.id && user?.email) {
      getUserRole({ variables: { firebaseUid: user.id } });
    }
    if(user?.id && user.email && user.role) {
      navigate("/panel");
    }
  }, [user]);
  
  const [disclaimer, setDisclaimer] = useState<
    "emptyEmail" | "emptyPassword" | "invalidEmail" | ""
  >("");
  const clearDisclaimerEmail = (value) => {
    if(value.trim() !== '' || !emailVerifier(value)) setDisclaimer("");
    setEmail(value.trim())
  }
  const clearDisclaimerPasword = (value) => {
    if(value.trim() !== '') setDisclaimer("");
    setPassword(value.trim())
  }

  const [getUserRole, { loading: loadingUser }] =
    useLazyQuery<UserPayload, UserInput>(
      GET_USER_BY_ID,
      {
        onCompleted: (data) => {
          if (data.user.user.role) {
            setRole(data.user.user.role)
            sessionStorage.setItem("@Auth:userRole", data.user.user.role);
          } else { logOut() } 
        },
        onError: (error) => {
          console.log(JSON.stringify(error, null, 2));
          logOut()
        },
        fetchPolicy: "network-only",
      }
    );

  const  handleLogIn = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email.trim() === "") {
      setDisclaimer("emptyEmail");
      setLoading(false);
      return;
    }
    if (!emailVerifier(email)) {
      setDisclaimer("invalidEmail");
      setLoading(false);
      return;
    }
    if (password.trim() === "") {
      setDisclaimer("emptyPassword");
      setLoading(false);
      return;
    }
    else {
      setDisclaimer("");
      const loginResult = await logIn(email, password);
      if(!loginResult) setErrorModalVisible(true)
      setLoading(false);
      return
    }
  }
  if (loading || loadingUser)
    return (
      <Container style={{ backgroundColor: "#2d76b264" }}>
        <Content>
          <Loading />
        </Content>
      </Container>
    );
  return (
    <Container>
      <Content>
          <Form onSubmit={handleLogIn}>
          <img src={Logo} alt="CETE logo" />
          <hr />
            <input
              type="email"
              placeholder="Email"
              title="Seu usuário"
              onChange={(e) => clearDisclaimerEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Senha"
              onChange={(e) => clearDisclaimerPasword(e.target.value)}
            />
            <Button type="submit" name="logInButtom">
              Entrar
            </Button>
          </Form>
          <Disclaimer disclaimer={disclaimer}/>
        
        </Content>
      <ErrorModal
        loading = {loading}
        show={errorModalVisible}
        onPressClose={()=>setErrorModalVisible(false)}
        onPressError={()=>setErrorModalVisible(false)}
        content={{errorDescription: 'Não foi possível validar seu usuário e/ou sua senha'}}
      />
    </Container>
  );
};

export default withRouter(LogIn);
