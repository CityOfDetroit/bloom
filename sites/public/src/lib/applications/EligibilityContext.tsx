import React from "react"
//import { AccessibilityFeatures } from "../pages/eligibility/accessibility"

export enum AgeRangeType {
  "LessThanFiftyFive" = "lessThan55",
  "FiftyFiveToSixtyOne" = "55to61",
  "SixtyTwoAndUp" = "62andUp",
  "PreferNotSay" = "preferNotSay",
}

export enum AccessibilityFeatures {
  "elevator" = "elevator",
  "wheelchairRamp" = "wheelchairRamp",
  "serviceAnimalsAllowed" = "serviceAnimalsAllowed",
  "accessibleParking" = "accessibleParking",
  "parkingOnSite" = "parkingOnSite",
  "inUnitWasherDryer" = "inUnitWasherDryer",
  "laundryInBuilding" = "laundryInBuilding",
  "barrierFreeEntrance" = "barrierFreeEntrance",
  "rollInShower" = "rollInShower",
  "grabBars" = "grabBars",
  "heatingInUnit" = "heatingInUnit",
  "acInUnit" = "acInUnit",
  "barrierFreeUnitEntrance" = "barrierFreeUnitEntrance",
  "loweredLightSwitch" = "loweredLightSwitch",
  "barrierFreeBathroom" = "barrierFreeBathroom",
  "wideDoorways" = "wideDoorways",
  "loweredCabinets" = "loweredCabinets",
}

class EligibilityRequirements {
  age: AgeRangeType
  householdSizeCount: number
  income: string
  disability: string
  elevator: boolean
  wheelchairRamp: boolean
  serviceAnimalsAllowed: boolean
  accessibleParking: boolean
  parkingOnSite: boolean
  inUnitWasherDryer: boolean
  laundryInBuilding: boolean
  barrierFreeEntrance: boolean
  rollInShower: boolean
  grabBars: boolean
  heatingInUnit: boolean
  acInUnit: boolean
  completedSections: number
  barrierFreeUnitEntrance: boolean
  loweredLightSwitch: boolean
  barrierFreeBathroom: boolean
  wideDoorways: boolean
  loweredCabinets: boolean

  constructor(
    age: AgeRangeType,
    householdSizeCount: number,
    income: string,
    disability: string,
    elevator: boolean,
    wheelchairRamp: boolean,
    serviceAnimalsAllowed: boolean,
    accessibleParking: boolean,
    parkingOnSite: boolean,
    inUnitWasherDryer: boolean,
    laundryInBuilding: boolean,
    barrierFreeEntrance: boolean,
    rollInShower: boolean,
    grabBars: boolean,
    heatingInUnit: boolean,
    acInUnit: boolean,
    barrierFreeUnitEntrance: boolean,
    loweredLightSwitch: boolean,
    barrierFreeBathroom: boolean,
    wideDoorways: boolean,
    loweredCabinets: boolean
  ) {
    this.age = age
    this.householdSizeCount = householdSizeCount
    this.income = income
    this.disability = disability
    this.elevator = elevator
    this.wheelchairRamp = wheelchairRamp
    this.serviceAnimalsAllowed = serviceAnimalsAllowed
    this.accessibleParking = accessibleParking
    this.parkingOnSite = parkingOnSite
    this.inUnitWasherDryer = inUnitWasherDryer
    this.laundryInBuilding = laundryInBuilding
    this.barrierFreeEntrance = barrierFreeEntrance
    this.rollInShower = rollInShower
    this.grabBars = grabBars
    this.heatingInUnit = heatingInUnit
    this.acInUnit = acInUnit
    this.completedSections = 0
    this.barrierFreeUnitEntrance = barrierFreeUnitEntrance
    this.loweredLightSwitch = loweredLightSwitch
    this.barrierFreeBathroom = barrierFreeBathroom
    this.wideDoorways = wideDoorways
    this.loweredCabinets = loweredCabinets
  }

  setAge(age: AgeRangeType) {
    this.age = age
  }

  setHouseholdSizeCount(householdSizeCount: number) {
    this.householdSizeCount = householdSizeCount
  }
  setIncome(income: string) {
    this.income = income
  }

  setElevator(elevator: boolean) {
    this.elevator = elevator
  }

  setWheelchairRamp(wheelchairRamp: boolean) {
    this.wheelchairRamp = wheelchairRamp
  }

  setServiceAnimalsAllowed(serviceAnimalsAllowed: boolean) {
    this.serviceAnimalsAllowed = serviceAnimalsAllowed
  }

  setAccessibleParking(accessibleParking: boolean) {
    this.accessibleParking = accessibleParking
  }

  setParkingOnSite(parkingOnSite: boolean) {
    this.parkingOnSite = parkingOnSite
  }

  setInUnitWasherDryer(inUnitWasherDryer: boolean) {
    this.inUnitWasherDryer = inUnitWasherDryer
  }

  setLaundryInBuilding(laundryInBuilding: boolean) {
    this.laundryInBuilding = laundryInBuilding
  }

  setBarrierFreeEntrance(barrierFreeEntrance: boolean) {
    this.barrierFreeEntrance = barrierFreeEntrance
  }

  setRollInShower(rollInShower: boolean) {
    this.rollInShower = rollInShower
  }

  setGrabBars(grabBars: boolean) {
    this.grabBars = grabBars
  }

  setHeatingInUnit(heatingInUnit: boolean) {
    this.heatingInUnit = heatingInUnit
  }

  setaAcInUnit(acInUnit: boolean) {
    this.acInUnit = acInUnit
  }

  setDisability(disability: string) {
    this.disability = disability
  }

  setCompletedSections(numCompleted: number) {
    this.completedSections = numCompleted
  }

  setBarrierFreeUnitEntrance(barrierFreeUnitEntrance: boolean) {
    this.barrierFreeUnitEntrance = barrierFreeUnitEntrance
  }

  setLoweredLightSwitch(loweredLightSwitch: boolean) {
    this.loweredLightSwitch = loweredLightSwitch
  }

  setBarrierFreeBathroom(barrierFreeBathroom: boolean) {
    this.barrierFreeBathroom = barrierFreeBathroom
  }

  setWideDoorways(wideDoorways: boolean) {
    this.wideDoorways = wideDoorways
  }

  setLoweredCabinets(loweredCabinets: boolean) {
    this.loweredCabinets = loweredCabinets
  }
}

export const blankEligibilityRequirements = () => {
  return new EligibilityRequirements(
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
  )
}

export const EligibilityContext = React.createContext({
  eligibilityRequirements: blankEligibilityRequirements(),
})
