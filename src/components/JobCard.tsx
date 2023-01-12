import React from "react"
import { Job } from "../common/types"

interface Props {
    job: Job
}

export const JobCard: React.FC<Props> = ({job}) => {
    return (
        <div className="jobs__card">
            <h2>{job.name}</h2>
            <p>Start Date: {job.start}</p>
            <p>End Date: {job.end}</p>
            <p>Location: {job.location}</p>
            <p>Contact: {job.contactId}</p>
        </div>
    )
}
