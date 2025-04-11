// Imporatr las secciones que se van a utilizar dentro de la página landing
import Primary from "./sections/primary";
import About from "./sections/About";
import Services from "./sections/Services";


function Landing() {
    return (
        <div>
            < Primary />
            < About />
            < Services />
        </div>
    );
}

export default Landing;