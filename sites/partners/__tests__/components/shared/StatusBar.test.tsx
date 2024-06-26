import React from "react"
import { render, cleanup, fireEvent } from "@testing-library/react"
import { Button, AppearanceStyleType } from "@bloom-housing/ui-components"
import { StatusBar } from "../../../src/components/shared/StatusBar"

afterEach(cleanup)

describe("<StatusBar>", () => {
  it("can render without a back button", () => {
    const { getByText, queryByText } = render(
      <StatusBar tagStyle={AppearanceStyleType.primary} tagLabel={"Draft"} />
    )
    expect(getByText("Draft")).not.toBeNull()
    expect(queryByText("Back")).toBeNull()
  })

  it("can render with a back button", () => {
    const onClickSpy = jest.fn()
    const { getByText } = render(
      <StatusBar
        backButton={
          <Button inlineIcon="left" icon="arrowBack" onClick={onClickSpy}>
            Back
          </Button>
        }
        tagLabel="Submitted"
        tagStyle={AppearanceStyleType.success}
      />
    )
    expect(getByText("Submitted")).not.toBeNull()
    expect(getByText("Back")).not.toBeNull()
    fireEvent.click(getByText("Back"))
    expect(onClickSpy).toHaveBeenCalledTimes(1)
  })
})
