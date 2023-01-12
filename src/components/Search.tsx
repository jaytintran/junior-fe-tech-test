import React, { useState, useEffect } from 'react'
import { DataService } from '../service/DataService';
import { Job } from '../common/types';
import { JobCard } from './JobCard';

import "./Search.css"

function Search() {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        if (!event.target.value) setJobs([])
    }
    
    const [jobs, setJobs] = useState<Job[]>([]);
    useEffect(() => {
        if (searchTerm.length >= 3) {
            DataService.getJobsWithSearchTerm(searchTerm)
                .then(data => setJobs(data as Job[]));
        } else {
            DataService.getJobs().then(data => setJobs(data as Job[]))
        }
    }, [searchTerm]);

    return (
        <div>
            <input type='text' placeholder='Search for jobs' onChange={handleSearchChange} className='jobs__searchbar' aria-label='Search' />

            <div className='jobs__container'>
                {jobs.map(job => (
                    <JobCard key={job.id} job={job}></JobCard>
                ))}
            </div>

        </div>

    )
}

export default Search