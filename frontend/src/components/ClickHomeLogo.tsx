import Link from 'next/link';

const ClickHomeLogo = () => {
    return (
        <div className="p-5 bg-#0000ff text-left border border-black rounded-md">
            <div>
                <Link href="/">
                        <h1 style={{ cursor: 'pointer' }}>ask.gov.my click home logo</h1>
                </Link>
            </div>
        </div>
    );
};

export default ClickHomeLogo;
