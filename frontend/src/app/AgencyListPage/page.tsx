"use Client"
import AgencyListComp from "@/components/AgencyListComp";

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