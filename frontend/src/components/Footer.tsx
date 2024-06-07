import LogoDetails from "./LogoDetails";

const Footer = () => {
    return (
        <div className="main-content flex items-center border-black bg-blue-500">
            <div className="w-2/4">
                <LogoDetails />
            </div>
            <div className="w-2/4 flex justify-between">
                <div className="w-1/2">
                    <div className='font-bold'>Open Source</div>
                    <div>Frontend Repo: NextJS</div>
                    <div>Backend Repo: Django</div>
                    <div>UI + UX Design: Figma</div>
                </div>
                <div className="w-1/2">
                    <div className="font-bold">Open Data</div>
                    <div>Any Website In Gov</div>
                </div>
            </div>
        </div>
    );
    
    
};

export default Footer;