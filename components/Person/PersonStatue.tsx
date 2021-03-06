import React from "react"
import Image from "next/image"
import { personSize } from "../../common/config"
import styled from "@emotion/styled"

export const PersonStatue = ({ personName, withStory }: Props): JSX.Element => {
  return (
    <PersonStatueWrapper withStory={withStory}>
      <Image
        src={`/images/persons/${personName}.png`}
        alt={personName}
        width={personSize.width}
        height={personSize.height}
        objectFit="contain"
        loading="eager"
      />
    </PersonStatueWrapper>
  )
}

interface Props {
  personName: string
  withStory?: boolean
}

const PersonStatueWrapper = styled.div<{ withStory?: boolean }>`
  width: ${personSize.width}px;
  height: ${personSize.height}px;
  flex: 0 0 40px;
  ${(props: { withStory?: boolean }) => (props.withStory ? `filter: invert(20%);` : "")}
`
