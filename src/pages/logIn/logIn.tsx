import React, { useState } from "react";
import { withRouter } from "../../routes/router";
import Logo from "../../assets/svg/trending-up.svg";
import Loading from "../../components/atoms/Loading";
import { useAuth } from "../../api/services/firebase/auth";
import { emailVerifier } from "../../utils/verifiers/verifiers";
import { useNavigate } from "react-router-dom";
import { Form, Container, Button } from "./styles";

const LogIn: React.FC = () => {
  const navigate = useNavigate();
  const { logIn, setLoading, loading } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [disclaimer, setDisclaimer] = useState<
    "emptyEmail" | "emptyPassword" | "invalidEmail" | "emptyType" | ""
  >("");

  async function handleLogIn() {
    if (email === "") {
      setDisclaimer("emptyEmail");
      return;
    }
    if (!emailVerifier(email)) {
      setDisclaimer("invalidEmail");
      return;
    }
    if (password === "") {
      setDisclaimer("emptyPassword");
      return;
    }
    console.log({ disclaimer });
    try {
      console.log("trying to login");
      await logIn(email, password);
      navigate("/dashboard");
    } catch (error: any) {
      console.log(error.message);
    }
    setLoading(false);
  }
  if (loading)
    return (
      <Container style={{ backgroundColor: "#10A0f864" }}>
        <Loading />
      </Container>
    );
  return (
    <Container style={{ backgroundColor: "#10A0f8" }}>
      <Form onSubmit={handleLogIn}>
        <img src={Logo} alt="CETE logo" />
        <hr />
        <div>
          <input
            type="email"
            placeholder="Email"
            title="Seu usuário"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button onClick={handleLogIn} name="logInButtom">
            Entrar
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default withRouter(LogIn);
