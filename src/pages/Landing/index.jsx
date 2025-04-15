// Imporatr las secciones que se van a utilizar dentro de la página landing
import Home from "./sections/home";
import About from "./sections/About";
import Services from "./sections/servicesType";
import Location from "./sections/location";


function Landing() {
    return (
        <div>
            < Home />
            < About />
            < Services />
            < Location /> 
        </div>
    );
}

export default Landing;