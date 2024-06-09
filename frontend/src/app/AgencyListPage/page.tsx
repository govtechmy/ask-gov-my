import Footer from "@/components/Footer";
import AgencyListComp from "@/components/AgencyListComp";
import IdentifyWebsite from "@/components/IdentifyWebsite";
import SearchNavbar from "@/components/SearchNavBar";
import { getAgencies } from "@/API Services/AgencyServices";
import { useState, useEffect } from "react";

const AgencyListPage = () => {
    return (
        <div className="container max-w-full">
            <div className="sticky top-0 left-0 w-full bg-white">
                <IdentifyWebsite></IdentifyWebsite>
                <SearchNavbar></SearchNavbar>
                <div>
                    <div>view questions and answers pertaining to the following public agencies</div>
                    <AgencyListComp></AgencyListComp>
                </div>
                <Footer></Footer>
            </div>
        </div>
    );
};

export default AgencyListPage;

// return (
//     <div className="container max-w-full">
//         <div className="sticky top-0 left-0 w-full bg-white">
//             <div>
//                 <IdentifyWebsite />
//                 <ClickHomeLogo />
//                 <SearchNavbarAgency />
//             </div>
//         </div>

//         <div>
//             <div className="main-content flex">
//                 <div className="w-3/4">
//                     <MainQuestionBox />
//                 </div>
//                 <div className="w-1/4 fixed -right-1">
//                     <AgencyListNavbar />
//                 </div>
//             </div>
//             <Footer />
//         </div>
//     </div>
// );