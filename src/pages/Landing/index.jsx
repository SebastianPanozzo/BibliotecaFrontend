import Home from "./sections/home";
import About from "./sections/About";
import Services from "./sections/services";
import Location from "./sections/location";
import Footer from "../../components/Footer";

function Landing() {

    return (
        <div>
            < Home />
            < About />
            < Services />
            < Location />
            < Footer />
        </div>
    );
}

export default Landing;