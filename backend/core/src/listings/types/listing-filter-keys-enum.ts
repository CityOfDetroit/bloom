// The names of supported filters on /listings
export enum ListingFilterKeys {
  status = "status",
  name = "name",
  isVerified = "isVerified",
  bedrooms = "bedrooms",
  zipcode = "zipcode",
  availability = "availability",
  program = "program",
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
  neighborhood = "neighborhood",
  jurisdiction = "jurisdiction",
}

export enum AvailabilityFilterEnum {
  hasAvailability = "hasAvailability",
  noAvailability = "noAvailability",
  waitlist = "waitlist",
}
