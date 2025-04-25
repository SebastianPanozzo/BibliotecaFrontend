import style from './loader.module.css';
//import img2 from '../../../public/img/bgDark.webp'
function Loader({context}) {
    const {image} = context

    return (
        <div className={style.container}
            style={{
                backgroundImage: `url(${image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
            }}
        >
            <div className={style.loader}></div>
        </div>
    );
}

export default Loader;