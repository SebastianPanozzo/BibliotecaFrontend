import style from './loader.module.css';

function Loader({context}) {
    const { img }= context;
    return (
        <div className={style.container}
            style={{
                backgroundImage: `url(${img})`,
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