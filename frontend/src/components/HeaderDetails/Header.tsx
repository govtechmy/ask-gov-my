import IdentifyWebsite from "./IdentifyWebsite";
import ClickHomeLogo from "./ClickHomeLogo";
import SearchNavbar from "./SearchNavBar";

const Header = () => {
    return (
        <div className="sticky top-0 left-0 w-full bg-white">
            <div>
                <IdentifyWebsite />
                <ClickHomeLogo />
                <SearchNavbar />
            </div>
        </div>
    );
};

export default Header;
