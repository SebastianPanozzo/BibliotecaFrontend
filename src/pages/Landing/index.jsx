import { useEffect } from 'react';
import useFetchData from "../../hooks/useFetchData"
import useStore from "../../hooks/useStore"
import Home from "./sections/home";
import About from "./sections/About";
import Services from "./sections/services";
import Location from "./sections/location";
import Contacts from "./sections/contacts";
import Loader from "../../components/LoadAndErr/Loader";

const img = '/img/bgDark'

function Landing() {
    const { storage, saveInStorage } = useStore();

    const { trigger, error, isMutating } = useFetchData('https://back-production-3d53.up.railway.app/api/findObjects');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const spaId = import.meta.env.VITE_SPA_ID;
                const body = [{ "$match": { "_id": { "$eq": spaId } } }]

                const data = await trigger({
                    method: 'POST',
                    body: body
                });
                saveInStorage({ spaData: data.items[0] });
            } catch (err) {
                console.error('Error al hacer la request:', err.message);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            {isMutating && <Loader context={{img: img}} />}
            {error && <h1>HERRORRRRRRR</h1>}
            {storage.spaData && (
                <>
                    < Home />
                    < About />
                    < Services />
                    < Location />
                    < Contacts />
                </>
            )}
        </div>
    );
}

export default Landing;