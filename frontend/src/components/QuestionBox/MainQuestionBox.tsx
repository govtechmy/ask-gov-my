import OverflowContainerQuestBox from "./OverflowContainerQuestBox";

const MainQuestionBox = () => {
    return (
        <header className="p-5 bg-#0000ff text-left border border-black rounded-md">
            <h1>Top Questions From Citizens</h1>
            {/* ubah some detail question box so it can onlyt show limit of the box */}
            <OverflowContainerQuestBox></OverflowContainerQuestBox>
            <OverflowContainerQuestBox></OverflowContainerQuestBox>
            <OverflowContainerQuestBox></OverflowContainerQuestBox>
            <OverflowContainerQuestBox></OverflowContainerQuestBox>
            <OverflowContainerQuestBox></OverflowContainerQuestBox>
            <OverflowContainerQuestBox></OverflowContainerQuestBox>
            <OverflowContainerQuestBox></OverflowContainerQuestBox>
            <OverflowContainerQuestBox></OverflowContainerQuestBox>
            <OverflowContainerQuestBox></OverflowContainerQuestBox>
            <OverflowContainerQuestBox></OverflowContainerQuestBox>
            <div className="text-center">paging</div>
            {/* do paging later on after link with plane.so */}
        </header>
    );
};

export default MainQuestionBox;