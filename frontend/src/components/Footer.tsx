import LogoDetails from "./LogoDetails";

const Footer = () => {
    return (
        <div className="main-content flex items-center">
            <div className="w-2/4">
                <LogoDetails></LogoDetails>
            </div>
            <div className="w-1/4"></div>
            <div className="w-1/8">
                <div className='font-bold'>Open Source</div>
                <div>Frontend Repo:NextJS</div>
                <div>Backend Repo:Django</div>
                <div>Ui + UX Design : Figma</div>
            </div>
            <div className="w-1/8">
                <div className="font-bold">Open Data</div>
                <div>Any Website In Gov</div>
            </div>
        </div>

    );
};

export default Footer;