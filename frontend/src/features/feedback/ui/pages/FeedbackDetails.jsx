import React from 'react'
import { useParams } from 'react-router'

const FeedbackDetails = () => {
    const params = useParams()
    console.log(params)
  return (
    <div>FeedbackDetails for id ------------  {params?.feedbackId}</div>
  )
}

export default FeedbackDetails