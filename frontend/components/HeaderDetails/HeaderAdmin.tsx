import IdentifyWebsite from "./IdentifyWebsite";
import ClickHomeLogoAdmin from "./ClickHomeLogoAdmin";

const Header = ({ locale }: { locale: string }) => {
  return (
    <div className="sticky left-0 top-0 w-full">
      <div>
        <IdentifyWebsite />
        <ClickHomeLogoAdmin locale={locale} />
      </div>
    </div>
  );
};

export default Header;
