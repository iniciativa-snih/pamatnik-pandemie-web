import React from "react"
import { ItemsDrawer } from "../components/ItemsDrawer/ItemsDrawer"
import styled from "@emotion/styled"
import { GetStaticProps, GetStaticPropsResult } from "next"
import { getImageFileNameByIndex } from "../common/getImageFileNameByIndex"
import { randomInteger } from "../common/randomInteger"
import moment from "moment"
import { Menu } from "../components/Menu/Menu"
import { adminApiUrl, mainEmailAddress } from "../common/config"
import { apiFetcher } from "../common/apiFetcher"
import { DateDead, DateDeadsWithStatuesAndStories, Message, PersonStory } from "../common/types"

const dev = process.env.NODE_ENV !== "production"

const Index = ({ deadsWithStatuesAndStories }: Props) => {
  return (
    <>
      <main>
        <Menu />

        <HeaderText>
          <h1>Památník obětí pandemie v České republice</h1>
          <p>
            Památník obětí pandemie ve své elektronické podobě má dát příležitost virtuálně sdílet smutek i účast, empatii i stesk. Má připomenout oběti a dát
            prostor pozůstalým. A tím není jen blízký příbuzný, nýbrž každý, kdo pozůstal. Každý, komu zemřelý chybí, a kdo pociťuje jeho odchod jako ztrátu, s
            níž je třeba se vyrovnat. Rozloučení, na jaká jsme byli při odchodech našich blízkých zvyklí, se v těchto měsících nemohou uskutečnit. Smutek
            potřebujeme sdílet, třeba i ve virtuální podobě.
          </p>
          <p>
            Desítky tisíc obětí nejsou jen údaj, každá oběť žila svůj jedinečný příběh, který pandemie náhle ukončila. Nyní je na nás, abychom nesli jejich
            památku jako připomínku lidské křehkosti a zranitelnosti. Zůstávají součástí nás všech, kteří odmítáme lhostejnost a víme, že bez soucitu a ochoty
            navzájem se podepřít ve smutku by život byl nesnesitelně chudý.
          </p>
          <p>
            Pokud chcete přidat příběh, svou vzpomínku na vašeho blízkého, pošlete email na <a href={`mailto:${mainEmailAddress}`}>{mainEmailAddress}</a> se
            jménem, datem úmrtí, věkem a příběhem.
          </p>
        </HeaderText>

        <ItemsDrawer deadsWithStatuesAndStories={deadsWithStatuesAndStories} />
      </main>

      <footer>© {moment().format("YYYY")} Iniciativa Sníh</footer>
    </>
  )
}

interface Props {
  deadsWithStatuesAndStories: DateDeadsWithStatuesAndStories[]
}

export const getStaticProps: GetStaticProps = async (): Promise<GetStaticPropsResult<Props>> => {
  const deadsByDate: DateDead[] = await apiFetcher(`${adminApiUrl}/api/deads`)
  const stories: PersonStory[] = await apiFetcher(`${adminApiUrl}/api/stories`)
  const messages: Message[] = await apiFetcher(`${adminApiUrl}/api/messages`)

  const deadsWithStatuesAndStories = deadsByDate.map((day) => {
    const daily = Array(day.daily)
      .fill(0)
      .map(() => ({ statue: getImageFileNameByIndex(randomInteger(0, 23)) }))

    const dayMessages = messages.filter((m) => moment(m.date).isSame(moment(day.date))) ?? undefined

    return {
      ...day,
      ...(dayMessages && { messages: dayMessages }),
      daily: [...daily, ...stories.filter((s) => moment(s.date).isSame(moment(day.date)))]
    }
  })

  return {
    props: {
      deadsWithStatuesAndStories: deadsWithStatuesAndStories || []
    },
    revalidate: dev ? 1 : 60
  }
}

const HeaderText = styled.div`
  text-align: center;
  padding: 40px 40px 40px 20px;
  top: 0;
  left: 0;
  z-index: 999;
  animation: fadeIn ease 1s;
  color: rgb(0 0 0 / 80%);

  p {
    font-size: 15px;
    line-height: 1.6;
  }
`

export default Index
