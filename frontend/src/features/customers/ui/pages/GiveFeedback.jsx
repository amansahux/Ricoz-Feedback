import { useParams } from "react-router";

const GiveFeedback = () => {
  const params = useParams();
  console.log(params);
  console.log(params?.organizationSlug)
  console.log(params?.surveySlug)
  return (
    <>
      <div>{params?.organizationSlug}</div>
      <div>{params?.surveySlug}</div>
    </>
  );
};

export default GiveFeedback;
