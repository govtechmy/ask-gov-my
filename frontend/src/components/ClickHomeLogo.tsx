import Link from 'next/link';
import Image from 'next/image';

const ClickHomeLogo = () => {
    return (
        <div className="p-5 text-left">
            <div>
                <Link href="/">
                        <h1 style={{ cursor: 'pointer' }}>
                            <Image                             
                            src="/askgovmy-logo.svg"
                            width={150}
                            height={150}
                            alt="ask logo">
                            </Image>
                        </h1>
                </Link>
            </div>
        </div>
    );
};

export default ClickHomeLogo;
