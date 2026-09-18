import { useParams } from "react-router";

const GiveFeedback = () => {
  const params = useParams();
  console.log("dajnjsdjksnjksd");
  console.log(params);
  return (
    <>
      <div>{params?.organizationSlug}</div>
      <div>{params?.surveySlug}</div>
    </>
  );
};

export default GiveFeedback;
