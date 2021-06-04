<?php
/**
 * PropertyCreateDto
 *
 * PHP version 5
 *
 * @category Class
 * @package  Swagger\Client
 * @author   Swagger Codegen team
 * @link     https://github.com/swagger-api/swagger-codegen
 */

/**
 * Bloom API
 *
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0
 * 
 * Generated by: https://github.com/swagger-api/swagger-codegen.git
 * Swagger Codegen version: 3.0.27-SNAPSHOT
 */
/**
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen
 * Do not edit the class manually.
 */

namespace Swagger\Client\Model;

use \ArrayAccess;
use \Swagger\Client\ObjectSerializer;

/**
 * PropertyCreateDto Class Doc Comment
 *
 * @category Class
 * @package  Swagger\Client
 * @author   Swagger Codegen team
 * @link     https://github.com/swagger-api/swagger-codegen
 */
class PropertyCreateDto implements ModelInterface, ArrayAccess
{
    const DISCRIMINATOR = null;

    /**
      * The original name of the model.
      *
      * @var string
      */
    protected static $swaggerModelName = 'PropertyCreateDto';

    /**
      * Array of property to type mappings. Used for (de)serialization
      *
      * @var string[]
      */
    protected static $swaggerTypes = [
        'building_address' => '\Swagger\Client\Model\AddressUpdateDto',
'units' => '\Swagger\Client\Model\UnitCreateDto[]',
'accessibility' => 'string',
'amenities' => 'string',
'building_total_units' => 'float',
'developer' => 'string',
'household_size_max' => 'float',
'household_size_min' => 'float',
'neighborhood' => 'string',
'pet_policy' => 'string',
'smoking_policy' => 'string',
'units_available' => 'float',
'unit_amenities' => 'string',
'services_offered' => 'string',
'year_built' => 'float'    ];

    /**
      * Array of property to format mappings. Used for (de)serialization
      *
      * @var string[]
      */
    protected static $swaggerFormats = [
        'building_address' => null,
'units' => null,
'accessibility' => null,
'amenities' => null,
'building_total_units' => null,
'developer' => null,
'household_size_max' => null,
'household_size_min' => null,
'neighborhood' => null,
'pet_policy' => null,
'smoking_policy' => null,
'units_available' => null,
'unit_amenities' => null,
'services_offered' => null,
'year_built' => null    ];

    /**
     * Array of property to type mappings. Used for (de)serialization
     *
     * @return array
     */
    public static function swaggerTypes()
    {
        return self::$swaggerTypes;
    }

    /**
     * Array of property to format mappings. Used for (de)serialization
     *
     * @return array
     */
    public static function swaggerFormats()
    {
        return self::$swaggerFormats;
    }

    /**
     * Array of attributes where the key is the local name,
     * and the value is the original name
     *
     * @var string[]
     */
    protected static $attributeMap = [
        'building_address' => 'buildingAddress',
'units' => 'units',
'accessibility' => 'accessibility',
'amenities' => 'amenities',
'building_total_units' => 'buildingTotalUnits',
'developer' => 'developer',
'household_size_max' => 'householdSizeMax',
'household_size_min' => 'householdSizeMin',
'neighborhood' => 'neighborhood',
'pet_policy' => 'petPolicy',
'smoking_policy' => 'smokingPolicy',
'units_available' => 'unitsAvailable',
'unit_amenities' => 'unitAmenities',
'services_offered' => 'servicesOffered',
'year_built' => 'yearBuilt'    ];

    /**
     * Array of attributes to setter functions (for deserialization of responses)
     *
     * @var string[]
     */
    protected static $setters = [
        'building_address' => 'setBuildingAddress',
'units' => 'setUnits',
'accessibility' => 'setAccessibility',
'amenities' => 'setAmenities',
'building_total_units' => 'setBuildingTotalUnits',
'developer' => 'setDeveloper',
'household_size_max' => 'setHouseholdSizeMax',
'household_size_min' => 'setHouseholdSizeMin',
'neighborhood' => 'setNeighborhood',
'pet_policy' => 'setPetPolicy',
'smoking_policy' => 'setSmokingPolicy',
'units_available' => 'setUnitsAvailable',
'unit_amenities' => 'setUnitAmenities',
'services_offered' => 'setServicesOffered',
'year_built' => 'setYearBuilt'    ];

    /**
     * Array of attributes to getter functions (for serialization of requests)
     *
     * @var string[]
     */
    protected static $getters = [
        'building_address' => 'getBuildingAddress',
'units' => 'getUnits',
'accessibility' => 'getAccessibility',
'amenities' => 'getAmenities',
'building_total_units' => 'getBuildingTotalUnits',
'developer' => 'getDeveloper',
'household_size_max' => 'getHouseholdSizeMax',
'household_size_min' => 'getHouseholdSizeMin',
'neighborhood' => 'getNeighborhood',
'pet_policy' => 'getPetPolicy',
'smoking_policy' => 'getSmokingPolicy',
'units_available' => 'getUnitsAvailable',
'unit_amenities' => 'getUnitAmenities',
'services_offered' => 'getServicesOffered',
'year_built' => 'getYearBuilt'    ];

    /**
     * Array of attributes where the key is the local name,
     * and the value is the original name
     *
     * @return array
     */
    public static function attributeMap()
    {
        return self::$attributeMap;
    }

    /**
     * Array of attributes to setter functions (for deserialization of responses)
     *
     * @return array
     */
    public static function setters()
    {
        return self::$setters;
    }

    /**
     * Array of attributes to getter functions (for serialization of requests)
     *
     * @return array
     */
    public static function getters()
    {
        return self::$getters;
    }

    /**
     * The original name of the model.
     *
     * @return string
     */
    public function getModelName()
    {
        return self::$swaggerModelName;
    }

    

    /**
     * Associative array for storing property values
     *
     * @var mixed[]
     */
    protected $container = [];

    /**
     * Constructor
     *
     * @param mixed[] $data Associated array of property values
     *                      initializing the model
     */
    public function __construct(array $data = null)
    {
        $this->container['building_address'] = isset($data['building_address']) ? $data['building_address'] : null;
        $this->container['units'] = isset($data['units']) ? $data['units'] : null;
        $this->container['accessibility'] = isset($data['accessibility']) ? $data['accessibility'] : null;
        $this->container['amenities'] = isset($data['amenities']) ? $data['amenities'] : null;
        $this->container['building_total_units'] = isset($data['building_total_units']) ? $data['building_total_units'] : null;
        $this->container['developer'] = isset($data['developer']) ? $data['developer'] : null;
        $this->container['household_size_max'] = isset($data['household_size_max']) ? $data['household_size_max'] : null;
        $this->container['household_size_min'] = isset($data['household_size_min']) ? $data['household_size_min'] : null;
        $this->container['neighborhood'] = isset($data['neighborhood']) ? $data['neighborhood'] : null;
        $this->container['pet_policy'] = isset($data['pet_policy']) ? $data['pet_policy'] : null;
        $this->container['smoking_policy'] = isset($data['smoking_policy']) ? $data['smoking_policy'] : null;
        $this->container['units_available'] = isset($data['units_available']) ? $data['units_available'] : null;
        $this->container['unit_amenities'] = isset($data['unit_amenities']) ? $data['unit_amenities'] : null;
        $this->container['services_offered'] = isset($data['services_offered']) ? $data['services_offered'] : null;
        $this->container['year_built'] = isset($data['year_built']) ? $data['year_built'] : null;
    }

    /**
     * Show all the invalid properties with reasons.
     *
     * @return array invalid properties with reasons
     */
    public function listInvalidProperties()
    {
        $invalidProperties = [];

        if ($this->container['building_address'] === null) {
            $invalidProperties[] = "'building_address' can't be null";
        }
        if ($this->container['units'] === null) {
            $invalidProperties[] = "'units' can't be null";
        }
        if ($this->container['accessibility'] === null) {
            $invalidProperties[] = "'accessibility' can't be null";
        }
        if ($this->container['amenities'] === null) {
            $invalidProperties[] = "'amenities' can't be null";
        }
        if ($this->container['building_total_units'] === null) {
            $invalidProperties[] = "'building_total_units' can't be null";
        }
        if ($this->container['developer'] === null) {
            $invalidProperties[] = "'developer' can't be null";
        }
        if ($this->container['household_size_max'] === null) {
            $invalidProperties[] = "'household_size_max' can't be null";
        }
        if ($this->container['household_size_min'] === null) {
            $invalidProperties[] = "'household_size_min' can't be null";
        }
        if ($this->container['neighborhood'] === null) {
            $invalidProperties[] = "'neighborhood' can't be null";
        }
        if ($this->container['pet_policy'] === null) {
            $invalidProperties[] = "'pet_policy' can't be null";
        }
        if ($this->container['smoking_policy'] === null) {
            $invalidProperties[] = "'smoking_policy' can't be null";
        }
        if ($this->container['units_available'] === null) {
            $invalidProperties[] = "'units_available' can't be null";
        }
        if ($this->container['unit_amenities'] === null) {
            $invalidProperties[] = "'unit_amenities' can't be null";
        }
        if ($this->container['year_built'] === null) {
            $invalidProperties[] = "'year_built' can't be null";
        }
        return $invalidProperties;
    }

    /**
     * Validate all the properties in the model
     * return true if all passed
     *
     * @return bool True if all properties are valid
     */
    public function valid()
    {
        return count($this->listInvalidProperties()) === 0;
    }


    /**
     * Gets building_address
     *
     * @return \Swagger\Client\Model\AddressUpdateDto
     */
    public function getBuildingAddress()
    {
        return $this->container['building_address'];
    }

    /**
     * Sets building_address
     *
     * @param \Swagger\Client\Model\AddressUpdateDto $building_address building_address
     *
     * @return $this
     */
    public function setBuildingAddress($building_address)
    {
        $this->container['building_address'] = $building_address;

        return $this;
    }

    /**
     * Gets units
     *
     * @return \Swagger\Client\Model\UnitCreateDto[]
     */
    public function getUnits()
    {
        return $this->container['units'];
    }

    /**
     * Sets units
     *
     * @param \Swagger\Client\Model\UnitCreateDto[] $units units
     *
     * @return $this
     */
    public function setUnits($units)
    {
        $this->container['units'] = $units;

        return $this;
    }

    /**
     * Gets accessibility
     *
     * @return string
     */
    public function getAccessibility()
    {
        return $this->container['accessibility'];
    }

    /**
     * Sets accessibility
     *
     * @param string $accessibility accessibility
     *
     * @return $this
     */
    public function setAccessibility($accessibility)
    {
        $this->container['accessibility'] = $accessibility;

        return $this;
    }

    /**
     * Gets amenities
     *
     * @return string
     */
    public function getAmenities()
    {
        return $this->container['amenities'];
    }

    /**
     * Sets amenities
     *
     * @param string $amenities amenities
     *
     * @return $this
     */
    public function setAmenities($amenities)
    {
        $this->container['amenities'] = $amenities;

        return $this;
    }

    /**
     * Gets building_total_units
     *
     * @return float
     */
    public function getBuildingTotalUnits()
    {
        return $this->container['building_total_units'];
    }

    /**
     * Sets building_total_units
     *
     * @param float $building_total_units building_total_units
     *
     * @return $this
     */
    public function setBuildingTotalUnits($building_total_units)
    {
        $this->container['building_total_units'] = $building_total_units;

        return $this;
    }

    /**
     * Gets developer
     *
     * @return string
     */
    public function getDeveloper()
    {
        return $this->container['developer'];
    }

    /**
     * Sets developer
     *
     * @param string $developer developer
     *
     * @return $this
     */
    public function setDeveloper($developer)
    {
        $this->container['developer'] = $developer;

        return $this;
    }

    /**
     * Gets household_size_max
     *
     * @return float
     */
    public function getHouseholdSizeMax()
    {
        return $this->container['household_size_max'];
    }

    /**
     * Sets household_size_max
     *
     * @param float $household_size_max household_size_max
     *
     * @return $this
     */
    public function setHouseholdSizeMax($household_size_max)
    {
        $this->container['household_size_max'] = $household_size_max;

        return $this;
    }

    /**
     * Gets household_size_min
     *
     * @return float
     */
    public function getHouseholdSizeMin()
    {
        return $this->container['household_size_min'];
    }

    /**
     * Sets household_size_min
     *
     * @param float $household_size_min household_size_min
     *
     * @return $this
     */
    public function setHouseholdSizeMin($household_size_min)
    {
        $this->container['household_size_min'] = $household_size_min;

        return $this;
    }

    /**
     * Gets neighborhood
     *
     * @return string
     */
    public function getNeighborhood()
    {
        return $this->container['neighborhood'];
    }

    /**
     * Sets neighborhood
     *
     * @param string $neighborhood neighborhood
     *
     * @return $this
     */
    public function setNeighborhood($neighborhood)
    {
        $this->container['neighborhood'] = $neighborhood;

        return $this;
    }

    /**
     * Gets pet_policy
     *
     * @return string
     */
    public function getPetPolicy()
    {
        return $this->container['pet_policy'];
    }

    /**
     * Sets pet_policy
     *
     * @param string $pet_policy pet_policy
     *
     * @return $this
     */
    public function setPetPolicy($pet_policy)
    {
        $this->container['pet_policy'] = $pet_policy;

        return $this;
    }

    /**
     * Gets smoking_policy
     *
     * @return string
     */
    public function getSmokingPolicy()
    {
        return $this->container['smoking_policy'];
    }

    /**
     * Sets smoking_policy
     *
     * @param string $smoking_policy smoking_policy
     *
     * @return $this
     */
    public function setSmokingPolicy($smoking_policy)
    {
        $this->container['smoking_policy'] = $smoking_policy;

        return $this;
    }

    /**
     * Gets units_available
     *
     * @return float
     */
    public function getUnitsAvailable()
    {
        return $this->container['units_available'];
    }

    /**
     * Sets units_available
     *
     * @param float $units_available units_available
     *
     * @return $this
     */
    public function setUnitsAvailable($units_available)
    {
        $this->container['units_available'] = $units_available;

        return $this;
    }

    /**
     * Gets unit_amenities
     *
     * @return string
     */
    public function getUnitAmenities()
    {
        return $this->container['unit_amenities'];
    }

    /**
     * Sets unit_amenities
     *
     * @param string $unit_amenities unit_amenities
     *
     * @return $this
     */
    public function setUnitAmenities($unit_amenities)
    {
        $this->container['unit_amenities'] = $unit_amenities;

        return $this;
    }

    /**
     * Gets services_offered
     *
     * @return string
     */
    public function getServicesOffered()
    {
        return $this->container['services_offered'];
    }

    /**
     * Sets services_offered
     *
     * @param string $services_offered services_offered
     *
     * @return $this
     */
    public function setServicesOffered($services_offered)
    {
        $this->container['services_offered'] = $services_offered;

        return $this;
    }

    /**
     * Gets year_built
     *
     * @return float
     */
    public function getYearBuilt()
    {
        return $this->container['year_built'];
    }

    /**
     * Sets year_built
     *
     * @param float $year_built year_built
     *
     * @return $this
     */
    public function setYearBuilt($year_built)
    {
        $this->container['year_built'] = $year_built;

        return $this;
    }
    /**
     * Returns true if offset exists. False otherwise.
     *
     * @param integer $offset Offset
     *
     * @return boolean
     */
    public function offsetExists($offset)
    {
        return isset($this->container[$offset]);
    }

    /**
     * Gets offset.
     *
     * @param integer $offset Offset
     *
     * @return mixed
     */
    public function offsetGet($offset)
    {
        return isset($this->container[$offset]) ? $this->container[$offset] : null;
    }

    /**
     * Sets value based on offset.
     *
     * @param integer $offset Offset
     * @param mixed   $value  Value to be set
     *
     * @return void
     */
    public function offsetSet($offset, $value)
    {
        if (is_null($offset)) {
            $this->container[] = $value;
        } else {
            $this->container[$offset] = $value;
        }
    }

    /**
     * Unsets offset.
     *
     * @param integer $offset Offset
     *
     * @return void
     */
    public function offsetUnset($offset)
    {
        unset($this->container[$offset]);
    }

    /**
     * Gets the string presentation of the object
     *
     * @return string
     */
    public function __toString()
    {
        if (defined('JSON_PRETTY_PRINT')) { // use JSON pretty print
            return json_encode(
                ObjectSerializer::sanitizeForSerialization($this),
                JSON_PRETTY_PRINT
            );
        }

        return json_encode(ObjectSerializer::sanitizeForSerialization($this));
    }
}
