import React, { useState } from "react"
import Markdown from "markdown-to-jsx"
import {
  MarkdownSection,
  t,
  PageHeader,
  MediaCard,
  Modal,
  Video,
} from "@bloom-housing/ui-components"
import Layout from "../layouts/application"
import RenderIf from "../src/RenderIf"
import sidebarContent from "../page_content/resources/sidebar.md"
import styles from "./housing-basics.module.scss"

export default function HousingBasics() {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [currentVideoID, setCurrentVideoId] = useState<string>("")
  const [currentVideoTitle, setCurrentVideoTitle] = useState<string>("")

  const updateModal = (videoTitle: string, videoID: string) => {
    setCurrentVideoId(videoID)
    setCurrentVideoTitle(videoTitle)
    setOpenModal(true)
  }
  return (
    <Layout>
      <PageHeader
        title={t("pageTitle.housingBasics")}
        subtitle={t("pageDescription.housingBasics")}
        inverse
      />
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title={currentVideoTitle}
        className={"pb-0 px-0 max-w-3xl"}
      >
        <Video label={currentVideoTitle} videoId={currentVideoID} />
      </Modal>
      <section className="md:px-5 mt-8">
        <article className="max-w-5xl m-auto md:flex">
          <div className="pt-4 md:w-8/12 md:py-0 serif-paragraphs">
            <div className={`md:me-8 ${styles["media-grid"]}`}>
              <MediaCard
                title="Detroit Home Connect: What is Affordable Housing?"
                handleClick={() =>
                  updateModal("Detroit Home Connect: What is Affordable Housing?", "cqd1IlIm1HM")
                }
                className={styles["media-grid__cell"]}
              />
              <MediaCard
                title="Detroit Home Connect: Understanding Income Restrictions"
                handleClick={() => alert("boop")}
                className={styles["media-grid__cell"]}
              />
              <MediaCard
                title="Detroit Home Connect: The Affordable Housing Application"
                handleClick={() => alert("boop")}
                className={styles["media-grid__cell"]}
              />
              <MediaCard
                title="Detroit Home Connect: Affordable Housing Waitlists"
                handleClick={() => alert("boop")}
                className={styles["media-grid__cell"]}
              />
            </div>
          </div>
          <aside className="pt-4 pb-10 md:w-4/12 md:pl-4 md:py-0 md:border-s">
            <MarkdownSection>
              <Markdown
                options={{
                  overrides: {
                    h4: {
                      component: ({ children, ...props }) => (
                        <h4 {...props} className="text-caps-underline">
                          {children}
                        </h4>
                      ),
                    },
                    RenderIf,
                  },
                }}
              >
                {sidebarContent}
              </Markdown>
            </MarkdownSection>
          </aside>
        </article>
      </section>
    </Layout>
  )
}
