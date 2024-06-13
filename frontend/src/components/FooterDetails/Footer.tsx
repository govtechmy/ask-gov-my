import Link from "next/link";
import Image from "next/image";

const Footer = () => {
    return (
        <div className="bg-background dark:bg-white border-t pt-12 pb-16 z-10">
            <div className="flex flex-col lg:flex-row">
                <div className="flex flex-col sm:px-6 lg:flex-row items-start lg:items-start mb-6 lg:mb-0">
                    <div className="flex items-center">
                        <Image
                            src="/jata_logo.png"
                            width={100}
                            height={100}
                            alt="Logo Jata Negara"
                        />
                        <div className="ml-4 text-center lg:text-left">
                            <h1 className="text-lg font-bold whitespace-nowrap">GOVERNMENT OF MALAYSIA</h1>
                            <div>© 2024 Public Sector Open Data</div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row lg:w-3/4 justify-end sm:pl-6">
                    <div className="mb-6 lg:mb-0 lg:pr-12 ">
                        <div className="font-bold">Open Source</div>
                        <p className="hover:underline block mt-2">
                            <Link href="https://www.google.com">
                                Frontend Repo: NextJS
                            </Link>
                        </p>
                        <p className="hover:underline block mt-2">
                            <Link href="https://www.google.com">
                                Backend Repo: Django
                            </Link>
                        </p>
                        <p className="hover:underline block mt-2">
                            <Link href="https://www.google.com">
                                AI Helper: OpenAI
                            </Link>
                        </p>
                        <p className="hover:underline block mt-2">
                            <Link href="https://www.google.com">
                                UI + UX Design: Figma
                            </Link>
                        </p>
                    </div>
                    <div className="lg:pl-12">
                        <div className="font-bold">Open Data</div>
                        <p className="hover:underline block mt-2">
                            <Link href="https://www.google.com">
                                Guiding Principles
                            </Link>
                        </p>
                        <p className="hover:underline block mt-2">
                            <Link href="https://www.google.com">
                                FAQ
                            </Link>
                        </p>
                        <p className="hover:underline block mt-2">
                            <Link href="https://www.google.com">
                                OpenDOSM
                            </Link>
                        </p>
                        <p className="hover:underline block mt-2">
                            <Link href="https://www.google.com">
                                KKMNOW
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
