import DetailQuestionBox from "./DetailQuestionBox";

const OverflowContainerQuestBox = () => {
    return (
        <div  className="p-5 bg-#0000ff text-left border border-black rounded-md">
            {/* control overflow here using any style you want */}
            overflow controller
            <DetailQuestionBox></DetailQuestionBox>
        </div>
    );
};

export default OverflowContainerQuestBox;

