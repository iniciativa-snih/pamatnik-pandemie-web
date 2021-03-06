import React, { Dispatch, LegacyRef, SetStateAction, useState } from "react"
import { Persons } from "../Persons/Persons"
import VisibilitySensor from "react-visibility-sensor"
import { DayMessages } from "../Message/DayMessages"
import { DeadPerson, DateDeadsWithStatuesAndStories } from "../../common/types"

export const Day = ({ day, deadByDateIndex, onChangeActive, dayRef, onClickOpenModalHandler }: Props): JSX.Element => {
  const [isVisible, setVisibility] = useState<boolean>(false)

  const onChangeVisibility = (isVisible: boolean) => {
    setVisibility(isVisible)
  }

  return (
    <VisibilitySensor
      scrollCheck={true}
      resizeCheck={true}
      onChange={onChangeVisibility}
      active={!isVisible}
      offset={{ top: -1500, bottom: -1500 }}
      partialVisibility>
      {() => (
        <div className="PersonsWrapper" ref={dayRef} data-date={day.date}>
          {isVisible && (
            <VisibilitySensor
              scrollCheck={true}
              resizeCheck={true}
              offset={{ top: 200, bottom: 200 }}
              partialVisibility
              onChange={(isActive) => isActive && onChangeActive(day)}>
              <div className="height">
                {day.messages.length > 0 && <DayMessages messages={day.messages} />}
                <Persons day={day} deadByDateIndex={deadByDateIndex} onClickOpenModalHandler={onClickOpenModalHandler} />
              </div>
            </VisibilitySensor>
          )}
        </div>
      )}
    </VisibilitySensor>
  )
}

interface Props {
  day: DateDeadsWithStatuesAndStories
  deadByDateIndex: number
  onChangeActive: Dispatch<SetStateAction<DateDeadsWithStatuesAndStories>>
  activeDayUrl?: DateDeadsWithStatuesAndStories
  dayRef: LegacyRef<HTMLDivElement>
  onClickOpenModalHandler: (dayDead: DeadPerson) => void
}
