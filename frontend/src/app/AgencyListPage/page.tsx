"use Client"
import AgencyListComp from "@/components/AgencyListComp";
import IdentifyWebsite from "@/components/IdentifyWebsite";
import SearchNavbar from "@/components/SearchNavBar";
import ClickHomeLogo from "@/components/ClickHomeLogo";

const AgencyListPage = () => {
    return (
        <div className="container max-w-full">
            <div className="">
                <div>
                    <div>view questions and answers pertaining to the following public agencies</div>
                    <AgencyListComp></AgencyListComp>
                </div>
            </div>
        </div>
    );
};

export default AgencyListPage;