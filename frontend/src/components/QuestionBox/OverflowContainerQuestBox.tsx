import DetailQuestionBox from "./DetailQuestionBox";

interface OverflowContainerQuestBoxProps {
    id: number;
    title: string;
    description: string;
}

const OverflowContainerQuestBox: React.FC<OverflowContainerQuestBoxProps> = ({ title, description }) => {
    return (
        <div className="p-5 bg-#0000ff text-left border border-black rounded-md" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <h2 style={{ fontWeight: 'bold', color: 'blue' }}>
                {title}
            </h2>
            {/* control overflow here using any style you want */}
            <DetailQuestionBox description={description} />
        </div>
    );
};

export default OverflowContainerQuestBox;