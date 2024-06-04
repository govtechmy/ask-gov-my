import QuestionBox from "./QuestionBox";

const MainQuestionBox = () => {
    return (
        <header className="p-5 bg-#0000ff text-left border border-black rounded-md">
            <h1>Top Questions From Citizens</h1>
            <QuestionBox></QuestionBox>
        </header>
    );
};

export default MainQuestionBox;