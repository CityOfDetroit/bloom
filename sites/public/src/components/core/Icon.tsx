import * as React from "react"
import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styles from "./Icon.module.scss"
import {
  Accessible,
  Application,
  ArrowBack,
  ArrowDown,
  ArrowForward,
  Assistance,
  Asterisk,
  BadgeCheck,
  Bed,
  Browse,
  Building,
  Calendar,
  CalendarBlock,
  Check,
  CircleQuestionThin,
  Clock,
  Close,
  CloseRound,
  CloseSmall,
  Cross,
  Document,
  DoubleHouse,
  Down,
  Download,
  Draggable,
  Edit,
  Eligibility,
  Envelope,
  EnvelopeThin,
  Eye,
  Favorite,
  File,
  Filter,
  Forward,
  FrontDoor,
  Globe,
  Hamburger,
  House,
  HouseThin,
  Info,
  Left,
  Lightbulb,
  Like,
  LikeFill,
  Link,
  List,
  Lock,
  Mail,
  MailThin,
  Map,
  MapThin,
  Menu,
  Messages,
  Oval,
  Phone,
  Plus,
  Polygon,
  Profile,
  Question,
  QuestionThin,
  Result,
  Right,
  Search,
  Settings,
  Spinner,
  Star,
  Ticket,
  Trash,
  UniversalAccess,
  Warning,
} from "@bloom-housing/shared-helpers"

const IconMap = {
  accessible: Accessible,
  application: Application,
  arrowBack: ArrowBack,
  arrowForward: ArrowForward,
  arrowDown: ArrowDown,
  assistance: Assistance,
  asterisk: Asterisk,
  badgeCheck: BadgeCheck,
  bed: Bed,
  browse: Browse,
  building: Building,
  calendar: Calendar,
  calendarBlock: CalendarBlock,
  check: Check,
  clock: Clock,
  close: Close,
  closeRound: CloseRound,
  closeSmall: CloseSmall,
  cross: Cross,
  document: Document,
  doubleHouse: DoubleHouse,
  down: Down,
  download: Download,
  draggable: Draggable,
  edit: Edit,
  eligibility: Eligibility,
  envelope: Envelope,
  envelopeThin: EnvelopeThin,
  eye: Eye,
  favorite: Favorite,
  file: File,
  filter: Filter,
  forward: Forward,
  frontDoor: FrontDoor,
  globe: Globe,
  hamburger: Hamburger,
  house: House,
  houseThin: HouseThin,
  info: Info,
  left: Left,
  lightbulb: Lightbulb,
  like: Like,
  likeFill: LikeFill,
  link: Link,
  list: List,
  lock: Lock,
  mail: Mail,
  mailThin: MailThin,
  map: Map,
  mapThin: MapThin,
  menu: Menu,
  messages: Messages,
  oval: Oval,
  phone: Phone,
  plus: Plus,
  polygon: Polygon,
  profile: Profile,
  question: Question,
  questionThin: QuestionThin,
  circleQuestionThin: CircleQuestionThin,
  result: Result,
  right: Right,
  search: Search,
  settings: Settings,
  spinner: Spinner,
  star: Star,
  ticket: Ticket,
  trash: Trash,
  universalAccess: UniversalAccess,
  warning: Warning,
}

export type IconTypes = keyof typeof IconMap

export type UniversalIconType = IconTypes | IconDefinition

export type IconFill = "white" | "primary"

export const IconFillColors = {
  white: "#ffffff",
  black: "#000000",
  primary: "#0077DA",
  alert: "#b91c1c",
}

export type IconSize =
  | "tiny"
  | "small"
  | "base"
  | "medium"
  | "md-large"
  | "large"
  | "xlarge"
  | "2xl"
  | "3xl"

export interface IconProps {
  size: IconSize
  symbol: UniversalIconType
  className?: string
  fill?: string
  ariaHidden?: boolean
  iconClass?: string
  dataTestId?: string
  tabIndex?: number
}

const Icon = (props: IconProps) => {
  const wrapperClasses = [styles["ui-icon"]]
  wrapperClasses.push(styles[`ui-${props.size}`])
  if (props.className) wrapperClasses.push(props.className)
  if (props.symbol == "spinner") wrapperClasses.push("spinner-animation")

  const SpecificIcon =
    typeof props.symbol === "string" ? (
      IconMap[props.symbol as string]
    ) : (
      <FontAwesomeIcon icon={props.symbol} />
    )

  return typeof props.symbol === "string" ? (
    <span
      className={wrapperClasses.join(" ")}
      aria-hidden={props.ariaHidden}
      data-testid={props.dataTestId ?? null}
      tabIndex={props.tabIndex}
    >
      <SpecificIcon
        fill={props.fill ? props.fill : undefined}
        className={props.iconClass ?? undefined}
      />
    </span>
  ) : (
    <span
      className={wrapperClasses.join(" ")}
      aria-hidden={props.ariaHidden}
      data-testid={props.dataTestId ?? null}
      style={{ color: props.fill }}
    >
      {SpecificIcon}
    </span>
  )
}

export { Icon as default, Icon }
