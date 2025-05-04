import React from "react";
import { UserProfile } from "../../types";

interface CustomQAProps {
  profile: UserProfile;
  handleCustomQAChange: (
    index: number,
    field: "question" | "answer",
    value: string
  ) => void;
  addCustomQA: () => void;
  removeCustomQA: (index: number) => void;
}

const CustomQA: React.FC<CustomQAProps> = ({
  profile,
  handleCustomQAChange,
  addCustomQA,
  removeCustomQA,
}) => {
  return (
    <div className='section'>
      <h2>Custom Questions & Answers</h2>
      {profile.customQA.map((qa, index) => (
        <div key={index} className='custom-qa-item'>
          <textarea
            name={`customQA-${index}-question`}
            placeholder='Question'
            value={qa.question}
            onChange={(e) => handleCustomQAChange(index, "question", e.target.value)}
          />
          <textarea
            name={`customQA-${index}-answer`}
            placeholder='Answer'
            value={qa.answer}
            onChange={(e) => handleCustomQAChange(index, "answer", e.target.value)}
          />
          <button type='button' onClick={() => removeCustomQA(index)}>
            Remove
          </button>
        </div>
      ))}
      <button type='button' onClick={addCustomQA}>
        Add Question
      </button>
    </div>
  );
};

export default CustomQA;
