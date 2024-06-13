import Image from "next/image";

const LogoDetails = () => {
    return (
        <div className="flex">
            <div >
                <Image
                    src="/jata_logo.png"
                    width={500}
                    height={500}
                    alt="Logo Jata Negara"
                />
            </div>
            <div className="ml-4">
                <h1 className="text-l font-bold">GOVERNMENT OF MALAYSIA</h1>
                <div className="whitespace-nowrap overflow-x-auto">© 2024 Public Sector Open Data</div>
            </div>
        </div>
    );
};

export default LogoDetails;
