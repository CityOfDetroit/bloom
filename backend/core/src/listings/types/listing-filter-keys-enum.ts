// The names of supported filters on /listings
export enum ListingFilterKeys {
  status = "status",
  name = "name",
  bedrooms = "bedrooms",
  zipcode = "zipcode",
  availability = "availability",
  seniorHousing = "seniorHousing",
  independentLivingHousing = "independentLivingHousing",
  minRent = "minRent",
  maxRent = "maxRent",
  minAmiPercentage = "minAmiPercentage",
  leasingAgents = "leasingAgents",
  elevator = "elevator",
  wheelchairRamp = "wheelchairRamp",
  serviceAnimalsAllowed = "serviceAnimalsAllowed",
  accessibleParking = "accessibleParking",
  parkingOnSite = "parkingOnSite",
  inUnitWasherDryer = "inUnitWasherDryer",
  laundryInBuilding = "laundryInBuilding",
  barrierFreeEntrance = "barrierFreeEntrance",
  rollInShower = "rollInShower",
  grabBars = "grabBars",
  heatingInUnit = "heatingInUnit",
  acInUnit = "acInUnit",
}

export enum AvailabilityFilterEnum {
  hasAvailability = "hasAvailability",
  noAvailability = "noAvailability",
  waitlist = "waitlist",
}
