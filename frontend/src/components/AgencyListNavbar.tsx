
import AgencyListComp from "./AgencyListComp";

const AgencyListNavbar = () => {
    return (
        <div className="p-5 bg-#0000ff text-left border border-black rounded-md">
            <h1>Agencies List</h1>
            <AgencyListComp></AgencyListComp>
            <AgencyListComp></AgencyListComp>
            <AgencyListComp></AgencyListComp>
            <AgencyListComp></AgencyListComp>
            <AgencyListComp></AgencyListComp>
            <div>&nbsp;</div>
            <h1 className="underline" style={{ cursor: 'pointer' }}>
            {/* add onClick after finish all */}
      See All Agencies
    </h1>
        </div>
    );
};

export default AgencyListNavbar;
