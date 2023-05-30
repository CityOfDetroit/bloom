import { PropsWithChildren } from "react"
import Link from "next/link"

const LinkComponent = (props: PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => {
  const anchorProps = { ...props }
  delete anchorProps.href

  return <Link href={props.href} {...anchorProps}></Link>
}

export default LinkComponent
