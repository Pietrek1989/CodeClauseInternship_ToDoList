import "./index.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Doing from "./components/Doing";
import Done from "./components/Done";
import Nav from "./components/Nav";
import ToDo from "./components/ToDo";
import { Button, Container } from "react-bootstrap";

const App = () => {
  return (
    <div className="App d-flex flex-column">
      <div>
        <Nav />
      </div>
      <Container>
        <Button>+</Button>
      </Container>

      <Container className="d-flex ">
        <ToDo />
        <Doing />
        <Done />
      </Container>
    </div>
  );
};

export default App;
