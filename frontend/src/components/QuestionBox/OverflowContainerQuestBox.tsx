import DetailQuestionBox from "./DetailQuestionBox";

interface OverflowContainerQuestBoxProps {
    id: number;
    title: string;
    description: string;
}

const OverflowContainerQuestBox: React.FC<OverflowContainerQuestBoxProps> = ({ id, title, description }) => {
    return (
        <div className="p-5 bg-#0000ff text-left border border-black rounded-md" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <h2>{title}</h2>
            <p>{description}</p>
            {/* control overflow here using any style you want */}
            <DetailQuestionBox id={id} />
        </div>
    );
};

export default OverflowContainerQuestBox;

