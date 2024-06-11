interface DetailQuestionBoxProps {
    description: string;
}

const truncateDescription = (description: string, wordLimit: number) => {
    const words = description.split(' ');
    if (words.length > wordLimit) {
        return words.slice(0, wordLimit).join(' ') + '...';
    }
    return description; //to make description show only 20 words on the main page
};

const DetailQuestionBox: React.FC<DetailQuestionBoxProps> = ({ description }) => {
    const truncatedDescription = truncateDescription(description.replace(/<[^>]+>/g, ''), 20); // removing HTML tags before truncating, because <p> tags are embedded in the db
    return (
        <div className="detail-box">
            <p>{truncatedDescription}</p>
        </div>
    );
};

export default DetailQuestionBox;