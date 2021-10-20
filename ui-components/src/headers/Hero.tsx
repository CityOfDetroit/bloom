import React, { useContext } from "react"
import { LinkButton } from "../actions/LinkButton"
import { t } from "../helpers/translator"
import { NavigationContext } from "../config/NavigationContext"
import "./Hero.scss"

export interface HeroProps {
  title: React.ReactNode
  backgroundImage?: string
  buttonTitle?: string
  buttonLink?: string
  secondaryButtonTitle?: string
  secondaryButtonLink?: string
  allApplicationsClosed?: boolean
  children?: React.ReactNode
  centered?: boolean
}

const HeroButton = (props: { title: string; href: string; className?: string }) => {
  return (
    <a href={props.href} className={props.className + " hero__button"}>
      {props.title}
    </a>
  )
}

const Hero = (props: HeroProps) => {
  let subHeader, styles
  let classNames = ""
  if (props.allApplicationsClosed) {
    subHeader = <h2 className="hero__subtitle">{t("welcome.allApplicationClosed")}</h2>
  } else if (props.children) {
    subHeader = <h2 className="hero__subtitle">{props.children}</h2>
  }
  if (props.backgroundImage) {
    styles = { backgroundImage: `url(${props.backgroundImage})` }
  }
  if (props.centered) {
    classNames = "centered"
  }
  return (
    <div className={`hero ${classNames}`} style={styles}>
      <h1 className="hero__title">{props.title}</h1>
      {subHeader}

      {props.buttonTitle && props.buttonLink && (
        <>
          {props.secondaryButtonTitle && props.secondaryButtonLink ? (
            <div /*className="grid md:grid-cols-6 gap-5 "*/ className="hero__container">
              <div className="hero__text">
                Detroit Home Connect is a place for you to find housing that you can afford based on
                your household needs and characteristics.
              </div>
              <HeroButton
                // className={"md:col-start-3 with_secondary"}
                className={"hero__button__left"}
                href={props.buttonLink}
                title={props.buttonTitle}
              />
              <HeroButton
                // className={"with_secondary"}
                className={"hero__button__right"}
                href={props.secondaryButtonLink}
                title={props.secondaryButtonTitle}
              />
            </div>
          ) : (
            <HeroButton className={"px-5"} href={props.buttonLink} title={props.buttonTitle} />
          )}
        </>
      )}
    </div>
  )
}

export { Hero as default, Hero }
