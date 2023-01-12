import React from "react"
import { IDataService } from '../common/types'
import Search from "../components/Search"

import { SectionGroup } from "../components/section/SectionGroup"
import { SectionPanel } from "../components/section/SectionPanel"

import "./QuestionOne.css"

export const QuestionOne: React.FC<{ service: IDataService }> = () => {
  return (
    <SectionGroup>
      <SectionPanel>
        <Search />
      </SectionPanel>
    </SectionGroup>
  )
}
