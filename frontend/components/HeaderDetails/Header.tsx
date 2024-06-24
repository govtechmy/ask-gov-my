import IdentifyWebsite from "./IdentifyWebsite";
import ClickHomeLogo from "./ClickHomeLogo";

const Header = ({ locale }: { locale: string }) => {
  return (
    <div className="sticky left-0 top-0 w-full">
      <div>
        <IdentifyWebsite />
        <ClickHomeLogo locale={locale} />
      </div>
    </div>
  );
};

export default Header;
